import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { calculateXP, getTier } from '@/lib/xp'

const COOKIE_OPTS = (secure: boolean) => ({
  httpOnly: false,
  secure,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

const PRIVATE_COOKIE_OPTS = (secure: boolean) => ({
  httpOnly: true,
  secure,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const appUrl = url.origin
  const isProd = process.env.NODE_ENV === 'production'

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/?error=strava_denied`)
  }

  // 1. Exchange code for tokens
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

  const { athlete, access_token, refresh_token, expires_at } = tokenData

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 2. Ensure Auth User exists (create or find)
  const name = `${athlete.firstname} ${athlete.lastname}`.trim()
  const avatarUrl = athlete.profile_medium || athlete.profile
  const email = `strava-${athlete.id}@verve.run`
  let userId: string

  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { strava_id: athlete.id, name },
  })

  if (authErr) {
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

  // 3. Relink profile if strava_id belongs to a different auth user
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, xp')
    .eq('strava_id', athlete.id)
    .single()

  const isNewUser = !existingProfile

  if (existingProfile && existingProfile.id !== userId) {
    console.log('Relinking profile to new auth user')
    await supabase.from('profiles').delete().eq('id', existingProfile.id)
  }

  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    strava_id: athlete.id,
    strava_access_token: access_token,
    strava_refresh_token: refresh_token,
    strava_token_expires_at: expires_at,
    avatar_url: avatarUrl,
  })

  if (profileErr) {
    console.error('Profile sync error:', profileErr)
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=profile_sync_failed&msg=${encodeURIComponent(profileErr.message)}`
    )
  }

  // 4. Set persistent auth cookies (30-day session)
  const cookieStore = await cookies()
  cookieStore.set('verve_user_id', userId, PRIVATE_COOKIE_OPTS(isProd))
  cookieStore.set('verve_strava_id', String(athlete.id), PRIVATE_COOKIE_OPTS(isProd))
  cookieStore.set('verve_name', name, COOKIE_OPTS(isProd))
  cookieStore.set('verve_avatar', avatarUrl || '', COOKIE_OPTS(isProd))

  // 5. Backfill recent Strava activities for new users (or if XP is still 0)
  const shouldBackfill = isNewUser || (existingProfile?.xp === 0)
  if (shouldBackfill) {
    try {
      // Fetch up to 60 most recent activities from Strava
      const activitiesRes = await fetch(
        'https://www.strava.com/api/v3/athlete/activities?per_page=60&page=1',
        { headers: { Authorization: `Bearer ${access_token}` } }
      )

      if (activitiesRes.ok) {
        const activities: any[] = await activitiesRes.json()

        // Get the fresh profile to use for XP calculations
        const { data: freshProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (freshProfile && activities.length > 0) {
          let totalXp = freshProfile.xp || 0

          for (const act of activities) {
            // Skip non-run activities
            if (!['Run', 'TrailRun', 'VirtualRun'].includes(act.sport_type)) continue

            // Avoid duplicates
            const { data: existing } = await supabase
              .from('runs')
              .select('id')
              .eq('strava_activity_id', act.id)
              .maybeSingle()

            if (existing) continue

            const xp = calculateXP(act as any, freshProfile)

            const { error: runErr } = await supabase.from('runs').insert({
              user_id: userId,
              strava_activity_id: act.id,
              distance_km: act.distance / 1000,
              duration_seconds: act.moving_time,
              pace_per_km:
                act.distance > 0
                  ? act.moving_time / (act.distance / 1000) / 60
                  : 0,
              elevation_m: act.total_elevation_gain,
              start_time: act.start_date,
              xp_earned: xp,
            })

            if (!runErr) totalXp += xp
          }

          // Update XP + tier after backfill
          await supabase
            .from('profiles')
            .update({ xp: totalXp, tier: getTier(totalXp) })
            .eq('id', userId)
        }
      }
    } catch (backfillErr) {
      // Non-fatal — user can still proceed
      console.error('Activity backfill error:', backfillErr)
    }
  }

  return NextResponse.redirect(`${appUrl}/dashboard`)
}
