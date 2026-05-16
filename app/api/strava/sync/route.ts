import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { backfillActivities } from '@/lib/stravaSync'
import { refreshTokenIfNeeded } from '@/lib/strava'

// Simple in-memory rate limiter per userId (resets on cold start, good enough for Vercel)
const lastSyncTime = new Map<string, number>()
const RATE_LIMIT_MS = 30_000 // 30 seconds between syncs per user

export async function POST() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('verve_user_id')?.value
  const stravaId = cookieStore.get('verve_strava_id')?.value

  if (!userId || !stravaId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limiting
  const now = Date.now()
  const last = lastSyncTime.get(userId) ?? 0
  if (now - last < RATE_LIMIT_MS) {
    const remainingMs = RATE_LIMIT_MS - (now - last)
    return NextResponse.json(
      { error: `Please wait ${Math.ceil(remainingMs / 1000)}s before syncing again.` },
      { status: 429 }
    )
  }
  lastSyncTime.set(userId, now)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch profile and refresh token if needed
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileErr || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  let accessToken: string
  try {
    accessToken = await refreshTokenIfNeeded(profile, supabase)
  } catch (err) {
    console.error('[sync] Token refresh failed:', err)
    return NextResponse.json({ error: 'Failed to refresh Strava token. Please re-connect Strava.' }, { status: 502 })
  }

  console.info('[sync] Manual sync started for user:', userId)

  try {
    const result = await backfillActivities({
      supabase,
      userId,
      stravaId: Number(stravaId),
      accessToken,
      limit: 30,
    })

    console.info('[sync] Manual sync complete:', result)
    return NextResponse.json({
      success: true,
      inserted: result.inserted,
      skipped: result.skipped,
      xpGained: result.xpGained,
      errors: result.errors,
    })
  } catch (err) {
    console.error('[sync] Exception during sync:', err)
    return NextResponse.json({ error: 'Sync failed. Please try again.' }, { status: 500 })
  }
}
