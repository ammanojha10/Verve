import { SupabaseClient } from '@supabase/supabase-js'
import { calculateXP, getTier } from '@/lib/xp'
import { checkBadges } from '@/lib/badges'
import { refreshTokenIfNeeded } from '@/lib/strava'

const RUN_TYPES = ['Run', 'TrailRun', 'VirtualRun']

export interface SyncResult {
  inserted: number
  skipped: number
  xpGained: number
  errors: string[]
}

/**
 * Fetches up to `limit` recent Strava activities for a user and upserts
 * them into the `runs` table.  Uses upsert with onConflict on
 * strava_activity_id so re-runs are always safe (idempotent).
 */
export async function backfillActivities({
  supabase,
  userId,
  stravaId,
  accessToken,
  limit = 60,
}: {
  supabase: SupabaseClient
  userId: string
  stravaId: number
  accessToken: string
  limit?: number
}): Promise<SyncResult> {
  const result: SyncResult = { inserted: 0, skipped: 0, xpGained: 0, errors: [] }

  // Fetch recent activities from Strava
  let activities: any[] = []
  try {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${limit}&page=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) {
      const body = await res.text()
      result.errors.push(`Strava activities fetch failed: ${body}`)
      console.error('[stravaSync] Strava activities fetch failed:', body)
      return result
    }
    activities = await res.json()
  } catch (err) {
    result.errors.push(`Strava activities fetch exception: ${String(err)}`)
    console.error('[stravaSync] Exception fetching activities:', err)
    return result
  }

  // Get current profile for XP/streak calculation
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileErr || !profile) {
    result.errors.push('Profile not found for XP calculation')
    return result
  }

  let totalXp = profile.xp || 0

  for (const act of activities) {
    if (!RUN_TYPES.includes(act.sport_type)) {
      result.skipped++
      continue
    }

    const distanceKm = act.distance / 1000
    if (distanceKm < 0.1) {
      result.skipped++
      continue
    }

    const xp = calculateXP(act, profile)
    const runPayload = {
      user_id: userId,
      strava_activity_id: Number(act.id),
      distance_km: distanceKm,
      duration_seconds: act.moving_time,
      pace_per_km:
        act.distance > 0
          ? act.moving_time / distanceKm / 60
          : 0,
      elevation_m: act.total_elevation_gain || 0,
      start_time: act.start_date,
      xp_earned: xp,
    }

    // Upsert – conflict on strava_activity_id ensures idempotency
    const { error: upsertErr } = await supabase
      .from('runs')
      .upsert(runPayload, { onConflict: 'strava_activity_id', ignoreDuplicates: true })

    if (upsertErr) {
      // Log but don't abort – continue with remaining activities
      result.errors.push(`Run upsert error (${act.id}): ${upsertErr.message}`)
      console.error(`[stravaSync] Run upsert error for activity ${act.id}:`, upsertErr.message)
    } else {
      result.inserted++
      result.xpGained += xp
      totalXp += xp
    }
  }

  // Update XP + tier in one shot
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ xp: totalXp, tier: getTier(totalXp) })
    .eq('id', userId)

  if (updateErr) {
    result.errors.push(`Profile XP update error: ${updateErr.message}`)
    console.error('[stravaSync] Profile XP update error:', updateErr.message)
  }

  console.info(
    `[stravaSync] Sync complete for user ${userId}:`,
    `inserted=${result.inserted}`,
    `skipped=${result.skipped}`,
    `xpGained=${result.xpGained}`,
    `errors=${result.errors.length}`
  )

  return result
}

/**
 * Process a single Strava activity from a webhook event.
 * Fetches activity details, inserts run, updates XP, checks badges.
 * Returns false if profile not found (expected for non-Verve athletes).
 */
export async function processSingleActivity({
  supabase,
  stravaUserId,
  activityId,
}: {
  supabase: SupabaseClient
  stravaUserId: number
  activityId: number
}): Promise<boolean> {
  console.info(`[stravaSync] Processing webhook activity ${activityId} for strava_id ${stravaUserId}`)

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('strava_id', stravaUserId)
    .single()

  if (profileErr || !profile) {
    console.info(`[stravaSync] No profile found for strava_id ${stravaUserId} – ignoring`)
    return false
  }

  // Refresh token if needed
  let accessToken: string
  try {
    accessToken = await refreshTokenIfNeeded(profile, supabase)
  } catch (err) {
    console.error(`[stravaSync] Token refresh failed for user ${profile.id}:`, err)
    return false
  }

  // Fetch activity details
  let activity: any
  try {
    const res = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      console.error(`[stravaSync] Failed to fetch activity ${activityId}:`, await res.text())
      return false
    }
    activity = await res.json()
  } catch (err) {
    console.error(`[stravaSync] Exception fetching activity ${activityId}:`, err)
    return false
  }

  if (!RUN_TYPES.includes(activity.sport_type)) {
    console.info(`[stravaSync] Activity ${activityId} is ${activity.sport_type} – skipping`)
    return false
  }

  const distanceKm = activity.distance / 1000
  const xp = calculateXP(activity, profile)

  const runPayload = {
    user_id: profile.id,
    strava_activity_id: activityId,
    distance_km: distanceKm,
    duration_seconds: activity.moving_time,
    pace_per_km: distanceKm > 0 ? activity.moving_time / distanceKm / 60 : 0,
    elevation_m: activity.total_elevation_gain || 0,
    start_time: activity.start_date,
    xp_earned: xp,
  }

  const { data: run, error: runErr } = await supabase
    .from('runs')
    .upsert(runPayload, { onConflict: 'strava_activity_id', ignoreDuplicates: false })
    .select()
    .single()

  if (runErr) {
    console.error(`[stravaSync] Run upsert error for activity ${activityId}:`, runErr.message)
    return false
  }

  const newXp = (profile.xp || 0) + xp
  await supabase
    .from('profiles')
    .update({ xp: newXp, tier: getTier(newXp) })
    .eq('id', profile.id)

  if (run) {
    await checkBadges(profile, run, supabase)
  }

  console.info(`[stravaSync] Activity ${activityId} processed: +${xp} XP for user ${profile.id}`)
  return true
}
