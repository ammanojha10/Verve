import { NextResponse } from 'next/server'
import { requireAdminApi, logAdminAction } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const session = await requireAdminApi()
    if (session instanceof NextResponse) return session // Unauthorized

    const supabaseAdmin = createAdminClient()

    // Find runs with duplicate strava_activity_id
    // This is a complex query, we will fetch all runs, group them in memory for safety
    // since we want to be very careful with deletions.
    const { data: runs, error } = await supabaseAdmin
      .from('runs')
      .select('id, strava_activity_id, user_id, xp_earned, start_time')
      .order('start_time', { ascending: true })

    if (error) throw error

    const grouped = new Map<number, typeof runs>()
    runs?.forEach(run => {
      const existing = grouped.get(run.strava_activity_id) || []
      grouped.set(run.strava_activity_id, [...existing, run])
    })

    const duplicatesToRemove: string[] = []
    const affectedUsers = new Set<string>()
    let totalXpDeducted = 0

    for (const [activityId, groupedRuns] of Array.from(grouped.entries())) {
      if (groupedRuns.length > 1) {
        // Keep the first one, mark the rest for deletion
        const [keep, ...remove] = groupedRuns
        remove.forEach(r => {
          duplicatesToRemove.push(r.id)
          affectedUsers.add(r.user_id)
          totalXpDeducted += r.xp_earned
        })
      }
    }

    // Instead of deleting directly, we just return the analysis if it's a dry run
    const body = await request.json().catch(() => ({}))
    const isDryRun = body.dryRun !== false

    if (isDryRun) {
      return NextResponse.json({
        message: 'Dry run completed',
        duplicatesFound: duplicatesToRemove.length,
        affectedUsers: Array.from(affectedUsers).length,
        estimatedXpDeduction: totalXpDeducted,
        isDryRun: true
      })
    }

    // Execute deletion
    if (duplicatesToRemove.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('runs')
        .delete()
        .in('id', duplicatesToRemove)

      if (deleteError) throw deleteError

      // Log the action
      await logAdminAction({
        admin_id: session.userId,
        admin_name: session.name,
        action: 'deduplicate_runs',
        target_type: 'system',
        metadata: { duplicatesRemoved: duplicatesToRemove.length, xpDeducted: totalXpDeducted },
        severity: 'warning'
      })
    }

    return NextResponse.json({
      message: 'Deduplication completed',
      duplicatesRemoved: duplicatesToRemove.length,
      affectedUsers: Array.from(affectedUsers).length,
      isDryRun: false
    })

  } catch (error: any) {
    console.error('Deduplicate error:', error)
    return NextResponse.json({ error: error.message || 'Failed to deduplicate' }, { status: 500 })
  }
}
