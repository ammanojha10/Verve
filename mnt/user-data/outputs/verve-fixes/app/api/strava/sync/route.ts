import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { calculateXP, getTier } from '@/lib/xp'
import { refreshTokenIfNeeded } from '@/lib/strava'

export async function POST() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('verve_user_id')?.value
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  let token: string
  try {
    token = await refreshTokenIfNeeded(profile, supabase)
  } catch {
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }

  const activitiesRes = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=30&page=1',
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!activitiesRes.ok) {
    return NextResponse.json({ error: 'Strava API error' }, { status: 502 })
  }

  const activities: any[] = await activitiesRes.json()
  let newRuns = 0
  let totalXp = profile.xp || 0

  for (const act of activities) {
    if (!['Run', 'TrailRun', 'VirtualRun'].includes(act.sport_type)) continue

    const { data: existing } = await supabase
      .from('runs')
      .select('id')
      .eq('strava_activity_id', act.id)
      .maybeSingle()

    if (existing) continue

    const xp = calculateXP(act as any, profile)

    const { error } = await supabase.from('runs').insert({
      user_id: userId,
      strava_activity_id: act.id,
      distance_km: act.distance / 1000,
      duration_seconds: act.moving_time,
      pace_per_km: act.distance > 0 ? act.moving_time / (act.distance / 1000) / 60 : 0,
      elevation_m: act.total_elevation_gain,
      start_time: act.start_date,
      xp_earned: xp,
    })

    if (!error) {
      totalXp += xp
      newRuns++
    }
  }

  await supabase
    .from('profiles')
    .update({ xp: totalXp, tier: getTier(totalXp) })
    .eq('id', userId)

  return NextResponse.json({ synced: newRuns, xp: totalXp })
}
