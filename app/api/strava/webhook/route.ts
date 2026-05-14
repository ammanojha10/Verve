import { createServerClient } from '@/lib/supabase/server'
import { calculateXP, getTier } from '@/lib/xp'
import { checkBadges } from '@/lib/badges'
import { fetchStravaActivity, refreshTokenIfNeeded } from '@/lib/strava'

export async function GET(req: Request) {
  // Strava subscription verification
  const { searchParams } = new URL(req.url)
  if (searchParams.get('hub.verify_token') !== process.env.STRAVA_VERIFY_TOKEN) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  return Response.json({ 'hub.challenge': searchParams.get('hub.challenge') })
}

export async function POST(req: Request) {
  const event = await req.json()
  
  // Return 200 immediately — Strava requires < 2s response
  const response = Response.json({ received: true })

  if (event.object_type === 'activity' && event.aspect_type === 'create') {
    // Process async after returning
    // Note: In Next.js App Router, to prevent the background task from being killed 
    // when the response is returned, we would ideally use waitUntil() or an external queue.
    // We will call it here without awaiting, but deploy environments like Vercel 
    // might require waitUntil for proper background execution.
    processActivity(event.owner_id, event.object_id).catch(console.error)
  }
  
  return response
}

async function processActivity(stravaId: number, activityId: number) {
  const supabase = await createServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('strava_id', stravaId)
    .single()
    
  if (!profile) return

  const token = await refreshTokenIfNeeded(profile, supabase)
  const activity = await fetchStravaActivity(activityId, token)

  const xp = calculateXP(activity, profile)
  
  const { data: run, error: runError } = await supabase.from('runs').insert({
    user_id: profile.id,
    strava_activity_id: activityId,
    distance_km: activity.distance / 1000,
    duration_seconds: activity.moving_time,
    pace_per_km: activity.moving_time / (activity.distance / 1000) / 60,
    elevation_m: activity.total_elevation_gain,
    start_time: activity.start_date,
    xp_earned: xp
  }).select().single()

  if (runError || !run) {
    console.error('Error inserting run:', runError)
    return
  }

  const newXp = profile.xp + xp
  await supabase.from('profiles')
    .update({ xp: newXp, tier: getTier(newXp) })
    .eq('id', profile.id)

  await checkBadges(profile, run, supabase)
}
