import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getTier } from '@/lib/xp'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const appUrl = url.origin

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/?error=strava_denied`)
  }

  // Exchange code for tokens
  let tokenData: any
  try {
    const res = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${appUrl}/api/auth/callback`,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('Strava token exchange failed:', body)
      return NextResponse.redirect(`${appUrl}/?error=token_exchange_failed`)
    }

    tokenData = await res.json()
  } catch (err) {
    console.error('Strava token exchange error:', err)
    return NextResponse.redirect(`${appUrl}/?error=server_error`)
  }

  const {
    athlete,
    access_token,
    refresh_token,
    expires_at,
  } = tokenData

  // Use service role client to upsert — bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Ensure Auth User exists
  let userId: string
  const email = `strava-${athlete.id}@verve.run`
  
  // Try to find existing auth user first
  const { data: searchData } = await supabase.auth.admin.listUsers()
  // Since listUsers is paginated, we should ideally use a better way, 
  // but for now let's try to create and handle "already exists"
  
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { strava_id: athlete.id, name },
  })

  if (authErr) {
    // If user exists, we need to get their ID. 
    // Admin listUsers is the only way without knowing the ID, 
    // but we can try to "sign in" or just search again.
    const { data: users } = await supabase.auth.admin.listUsers()
    const found = users?.users.find(u => u.email === email)
    if (found) {
      userId = found.id
    } else {
      console.error('Auth User error:', authErr)
      return NextResponse.redirect(`${appUrl}/?error=user_creation_failed`)
    }
  } else {
    userId = authUser.user!.id
  }

  // 2. Upsert Profile
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    strava_id: athlete.id,
    strava_access_token: access_token,
    strava_refresh_token: refresh_token,
    strava_token_expires_at: expires_at,
    avatar_url: avatarUrl,
    tier: 'Jogger', // Default, but upsert won't overwrite XP if we handle it
  }, {
    onConflict: 'strava_id',
    ignoreDuplicates: false,
  })

  if (profileErr) {
    console.error('Profile Upsert Error:', profileErr)
    // Fallback attempt by ID if strava_id conflict fails
    await supabase.from('profiles').upsert({
      id: userId,
      name,
      strava_id: athlete.id,
      strava_access_token: access_token,
      strava_refresh_token: refresh_token,
      strava_token_expires_at: expires_at,
      avatar_url: avatarUrl,
    })
  }

  // Create a signed-in session for the user
  const { data: sessionData, error: sessionErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: `strava-${athlete.id}@verve.run`,
  })

  if (sessionErr || !sessionData.properties?.hashed_token) {
    console.error('Session generation failed:', sessionErr)
    // Even if session fails, store user info in an http-only cookie as fallback
  }

  // Store session in a secure http-only cookie
  const cookieStore = await cookies()
  cookieStore.set('verve_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  cookieStore.set('verve_strava_id', String(athlete.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  cookieStore.set('verve_name', name, {
    httpOnly: false, // readable by client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  cookieStore.set('verve_avatar', avatarUrl || '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.redirect(`${appUrl}/dashboard`)
}
