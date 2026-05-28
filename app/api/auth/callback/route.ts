import { NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getTier } from '@/lib/xp'
import { backfillActivities } from '@/lib/stravaSync'
import { getCredentialsForProfile } from '@/lib/strava'

const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/** Private (HTTP-only) – never readable by JS on the client */
const PRIVATE_COOKIE = (isProd: boolean) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
})

/** Public – readable by JS for UI display (name, avatar) */
const PUBLIC_COOKIE = (isProd: boolean) => ({
  httpOnly: false,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const stateClientId = url.searchParams.get('state') // retrieve selected client_id from state parameter
  const appUrl = url.origin
  const isProd = process.env.NODE_ENV === 'production'

  console.info('[auth/callback] Received callback', { hasCode: !!code, error, stateClientId })

  if (error || !code) {
    console.warn('[auth/callback] No code or error param:', { error, code })
    return NextResponse.redirect(`${appUrl}/?error=strava_denied`)
  }

  // Resolve dynamic credentials based on state client_id
  let creds;
  try {
    creds = getCredentialsForProfile(stateClientId || undefined)
  } catch (err) {
    console.error('[auth/callback] Credential resolution failed:', err)
    return NextResponse.redirect(`${appUrl}/?error=invalid_strava_shard`)
  }

  // ── 1. Exchange code for Strava tokens ────────────────────────────────────
  let tokenData: any
  try {
    const res = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${appUrl}/api/auth/callback`,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[auth/callback] Token exchange failed:', body)
      return NextResponse.redirect(`${appUrl}/?error=token_exchange_failed`)
    }

    tokenData = await res.json()
    console.info('[auth/callback] Token exchange success, athlete:', tokenData.athlete?.id)
  } catch (err) {
    console.error('[auth/callback] Token exchange exception:', err)
    return NextResponse.redirect(`${appUrl}/?error=server_error`)
  }

  const { athlete, access_token, refresh_token, expires_at } = tokenData
  const name = `${athlete.firstname} ${athlete.lastname}`.trim()
  const avatarUrl = athlete.profile_medium || athlete.profile || ''
  const email = `strava-${athlete.id}@verve.run`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 2. Create or find Supabase Auth user ─────────────────────────────────
  let userId: string

  const { data: authUser, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password: crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { strava_id: athlete.id, name },
  })

  if (createErr) {
    // User already exists – look them up by email (no listUsers scan)
    const { data: existingUsers, error: lookupErr } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })
    // listUsers with filters isn't exposed in this SDK version; use getUserByEmail equivalent via admin
    // Workaround: query auth.users via rpc or profiles table
    const { data: profileByEmail } = await supabase
      .from('profiles')
      .select('id')
      .eq('strava_id', athlete.id)
      .maybeSingle()

    if (profileByEmail) {
      userId = profileByEmail.id
      console.info('[auth/callback] Found existing user via profile lookup:', userId)
    } else {
      // Final fallback: scan (only triggers for edge case of profile not yet created)
      const { data: allUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
      const found = allUsers?.users.find(u => u.email === email)
      if (found) {
        userId = found.id
        console.info('[auth/callback] Found existing user via email scan:', userId)
      } else {
        console.error('[auth/callback] Failed to resolve user:', createErr)
        return NextResponse.redirect(`${appUrl}/?error=user_creation_failed`)
      }
    }
  } else {
    userId = authUser.user!.id
    console.info('[auth/callback] Created new auth user:', userId)
  }

  // ── 3. Upsert profile ─────────────────────────────────────────────────────
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, xp')
    .eq('strava_id', athlete.id)
    .maybeSingle()

  // If strava_id was linked to a different auth uid, remove the old profile row
  if (existingProfile && existingProfile.id !== userId) {
    console.info('[auth/callback] Relinking strava_id to new auth uid')
    await supabase.from('profiles').delete().eq('id', existingProfile.id)
  }

  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    strava_id: athlete.id,
    strava_access_token: access_token,
    strava_refresh_token: refresh_token,
    strava_token_expires_at: expires_at,
    strava_client_id: creds.clientId, // Store which client was used to register this athlete
    avatar_url: avatarUrl,
    // Preserve XP if profile already existed
    xp: existingProfile?.xp ?? 0,
    tier: getTier(existingProfile?.xp ?? 0),
  })

  if (profileErr) {
    console.error('[auth/callback] Profile upsert error:', profileErr)
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=profile_sync_failed&msg=${encodeURIComponent(profileErr.message)}`
    )
  }

  console.info('[auth/callback] Profile upserted for user:', userId)

  // ── 4. Set persistent auth cookies ───────────────────────────────────────
  const cookieStore = await cookies()
  cookieStore.set('verve_user_id', userId, PRIVATE_COOKIE(isProd))
  cookieStore.set('verve_strava_id', String(athlete.id), PRIVATE_COOKIE(isProd))
  cookieStore.set('verve_name', name, PUBLIC_COOKIE(isProd))
  cookieStore.set('verve_avatar', avatarUrl, PUBLIC_COOKIE(isProd))

  // ── 5. Backfill activities via after() ────────────────────────────────────
  // `after()` keeps the serverless function alive until the callback completes,
  // even after the response has been sent. This prevents Vercel from terminating
  // the process before DB writes finish.
  after(async () => {
    try {
      console.info('[auth/callback:after] Starting activity backfill for user:', userId)
      const result = await backfillActivities({
        supabase,
        userId,
        stravaId: athlete.id,
        accessToken: access_token,
        limit: 60,
      })
      console.info('[auth/callback:after] Backfill complete:', result)
    } catch (err) {
      console.error('[auth/callback:after] Backfill exception:', err)
    }
  })

  return NextResponse.redirect(`${appUrl}/dashboard`)
}
