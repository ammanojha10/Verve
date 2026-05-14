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

  // Upsert profile keyed by strava_id (custom UUID stable per athlete)
  const athleteId = `strava-${athlete.id}`
  const name = `${athlete.firstname} ${athlete.lastname}`.trim()
  const avatarUrl = athlete.profile_medium || athlete.profile

  // Check if a profile with this strava_id already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, xp')
    .eq('strava_id', athlete.id)
    .single()

  let userId: string

  if (existing) {
    userId = existing.id
    // Update tokens
    await supabase
      .from('profiles')
      .update({
        strava_access_token: access_token,
        strava_refresh_token: refresh_token,
        strava_token_expires_at: expires_at,
        avatar_url: avatarUrl,
        name,
        tier: getTier(existing.xp),
      })
      .eq('id', userId)
  } else {
    // New user — need to create a Supabase auth user first
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: `strava-${athlete.id}@verve.run`,
      password: crypto.randomUUID(),
      email_confirm: true,
      user_metadata: { strava_id: athlete.id, name },
    })

    if (authErr || !authUser.user) {
      console.error('Failed to create auth user:', authErr)
      return NextResponse.redirect(`${appUrl}/?error=user_creation_failed`)
    }

    userId = authUser.user.id

    await supabase.from('profiles').insert({
      id: userId,
      name,
      strava_id: athlete.id,
      strava_access_token: access_token,
      strava_refresh_token: refresh_token,
      strava_token_expires_at: expires_at,
      avatar_url: avatarUrl,
      xp: 0,
      tier: 'Jogger',
      streak_weeks: 0,
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
