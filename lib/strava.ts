import { SupabaseClient } from '@supabase/supabase-js'
import { Profile, StravaActivity } from './types'

export interface StravaShard {
  clientId: string
  clientSecret: string
}

/**
 * Retrieves all configured Strava API Shards from environment variables.
 * Falls back dynamically to the default single application if no shards are configured.
 */
export function getStravaShards(): StravaShard[] {
  const shards: StravaShard[] = []

  // 1. Scan for numbered keys (e.g. STRAVA_CLIENT_ID_1, STRAVA_CLIENT_SECRET_1)
  let i = 1
  while (true) {
    const cid = process.env[`STRAVA_CLIENT_ID_${i}`]
    const sec = process.env[`STRAVA_CLIENT_SECRET_${i}`]
    if (cid && sec) {
      shards.push({ clientId: cid.trim(), clientSecret: sec.trim() })
      i++
    } else {
      break
    }
  }

  // 2. Fall back to standard single keys if no sharded keys exist
  if (shards.length === 0) {
    const defaultCid = process.env.STRAVA_CLIENT_ID
    const defaultSec = process.env.STRAVA_CLIENT_SECRET
    if (defaultCid && defaultSec) {
      shards.push({ clientId: defaultCid.trim(), clientSecret: defaultSec.trim() })
    }
  }

  return shards
}

/**
 * Resolves the client ID and client secret for a user's profile based on their stored `strava_client_id`.
 * Falls back to the default or first shard if none is specified or found.
 */
export function getCredentialsForProfile(stravaClientId?: string): StravaShard {
  const shards = getStravaShards()
  if (shards.length === 0) {
    throw new Error('No Strava API credentials configured in environment variables.')
  }

  if (stravaClientId) {
    const match = shards.find(s => s.clientId === stravaClientId)
    if (match) return match
  }

  // Default to first shard if no match is found
  return shards[0]
}

export async function refreshTokenIfNeeded(profile: Profile, supabase: SupabaseClient): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  
  // If the token is not expired (adding a 5 min buffer), return it
  if (profile.strava_token_expires_at && profile.strava_token_expires_at > now + 300) {
    return profile.strava_access_token!
  }

  // Resolve dynamic credentials for this user's profile
  const creds = getCredentialsForProfile(profile.strava_client_id)

  // Refresh the token
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: profile.strava_refresh_token,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`[strava/refreshTokenIfNeeded] Token refresh failed for user ${profile.id}:`, body)
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
