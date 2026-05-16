import { NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { processSingleActivity } from '@/lib/stravaSync'

function makeSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * GET – Strava webhook subscription verification.
 * Strava sends hub.verify_token and hub.challenge; we echo the challenge.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verifyToken = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.info('[webhook] Verification request received, verify_token match:', verifyToken === process.env.STRAVA_VERIFY_TOKEN)

  if (verifyToken !== process.env.STRAVA_VERIFY_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ 'hub.challenge': challenge })
}

/**
 * POST – Strava sends activity events here.
 * We MUST respond within 2 seconds; all async work happens inside after().
 */
export async function POST(req: Request) {
  let event: any
  try {
    event = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.info('[webhook] Event received:', {
    object_type: event.object_type,
    aspect_type: event.aspect_type,
    object_id: event.object_id,
    owner_id: event.owner_id,
  })

  // Only process new activity creation events
  if (event.object_type === 'activity' && event.aspect_type === 'create') {
    const stravaUserId: number = event.owner_id
    const activityId: number = event.object_id

    // Use after() so Vercel keeps the function alive until DB writes complete
    after(async () => {
      const supabase = makeSupabase()
      try {
        const processed = await processSingleActivity({ supabase, stravaUserId, activityId })
        console.info('[webhook:after] processSingleActivity result:', processed)
      } catch (err) {
        console.error('[webhook:after] processSingleActivity exception:', err)
      }
    })
  }

  // Respond immediately with 200 so Strava doesn't retry
  return NextResponse.json({ received: true })
}
