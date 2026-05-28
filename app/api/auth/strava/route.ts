import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStravaShards } from '@/lib/strava'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const appUrl = url.origin
  const shards = getStravaShards()

  if (shards.length === 0) {
    console.error('[auth/strava] No Strava shards configured in environment.')
    return NextResponse.redirect(`${appUrl}/?error=no_strava_config`)
  }

  let selectedShard = shards[0]

  // If we have multiple shards, find the one with the least connected athletes
  if (shards.length > 1) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Query all profiles to accurately count legacy users as well
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('strava_client_id')

      if (!error && profiles) {
        // Initialize counts dictionary
        const counts: Record<string, number> = {}
        shards.forEach(s => {
          counts[s.clientId] = 0
        })

        profiles.forEach(p => {
          const cid = p.strava_client_id
          if (cid && counts[cid] !== undefined) {
            counts[cid]++
          } else {
            // Count any unassigned/legacy users toward the default first shard
            counts[shards[0].clientId]++
          }
        })

        // Select the shard with the minimum count
        let minCount = Infinity
        shards.forEach(s => {
          if (counts[s.clientId] < minCount) {
            minCount = counts[s.clientId]
            selectedShard = s
          }
        })

        console.info('[auth/strava] Capacity balancing selection:', {
          counts,
          selectedClientId: selectedShard.clientId,
          currentLoad: minCount
        })
      } else if (error) {
        console.warn('[auth/strava] Failed to load profile shard counts from DB, using fallback first shard:', error.message)
      }
    } catch (err) {
      console.error('[auth/strava] Error picking shard, falling back to first shard:', err)
    }
  }

  // Pass selected client_id in the OAuth state so that we can retrieve it in the callback
  const params = new URLSearchParams({
    client_id: selectedShard.clientId,
    redirect_uri: `${appUrl}/api/auth/callback`,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
    state: selectedShard.clientId, // pass client_id in the state parameter
  })

  return NextResponse.redirect(
    `https://www.strava.com/oauth/authorize?${params.toString()}`
  )
}
