import { SupabaseClient } from '@supabase/supabase-js'
import { Profile, StravaActivity } from './types'

export async function refreshTokenIfNeeded(profile: Profile, supabase: SupabaseClient): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  
  // If the token is not expired (adding a 5 min buffer), return it
  if (profile.strava_token_expires_at && profile.strava_token_expires_at > now + 300) {
    return profile.strava_access_token!
  }

  // Refresh the token
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: profile.strava_refresh_token,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Strava token')
  }

  const data = await response.json()

  // Save new tokens to Supabase
  await supabase.from('profiles').update({
    strava_access_token: data.access_token,
    strava_refresh_token: data.refresh_token,
    strava_token_expires_at: data.expires_at,
  }).eq('id', profile.id)

  return data.access_token
}

export async function fetchStravaActivity(activityId: number, accessToken: string): Promise<StravaActivity> {
  const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Strava activity')
  }

  return response.json()
}
