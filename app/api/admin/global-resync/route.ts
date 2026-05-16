import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'
import { backfillActivities } from '@/lib/stravaSync'
import { refreshTokenIfNeeded } from '@/lib/strava'
import { after } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAdminApi()
    
    // Global resync is heavy, maybe restrict to super_admin or admin
    if (adminSession.role !== 'super_admin' && adminSession.role !== 'admin') {
        return NextResponse.json({ error: 'Requires admin privileges' }, { status: 403 })
    }

    const body = await request.json()
    const isDryRun = body.dryRun === true

    const supabase = createAdminClient()

    // 1. Dry Run Logic
    if (isDryRun) {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('strava_id', 'is', null)
        .not('strava_refresh_token', 'is', null)

      if (error) throw error

      return NextResponse.json({ 
        message: `Dry Run: A Global Resync would fetch activities for ${count} connected athletes.` 
      })
    }

    // 2. Execute Logic
    // Log the initiation immediately
    await supabase.from('audit_logs').insert({
      admin_id: adminSession.userId,
      admin_name: adminSession.name,
      action: 'Triggered Global Resync Background Job',
      target_type: 'system',
      severity: 'warning'
    })

    // Run the heavy lifting after the response is sent to avoid timeouts
    after(async () => {
        try {
            console.log('[Global Resync] Starting background job...');
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .not('strava_id', 'is', null)
                .not('strava_refresh_token', 'is', null)

            if (error || !profiles) {
                console.error('[Global Resync] Failed to fetch profiles', error);
                return;
            }

            let totalInserted = 0;
            
            for (const profile of profiles) {
                try {
                    const accessToken = await refreshTokenIfNeeded(profile, supabase);
                    const result = await backfillActivities({
                        supabase,
                        userId: profile.id,
                        stravaId: profile.strava_id,
                        accessToken,
                        limit: 30 // Sync last 30 activities per user to prevent massive rate limits
                    })
                    totalInserted += result.inserted;
                } catch (e) {
                    console.error(`[Global Resync] Failed for user ${profile.id}:`, e);
                }
            }
            
            console.log(`[Global Resync] Completed. Total new runs inserted: ${totalInserted}`);
            
            // Log completion
            await supabase.from('audit_logs').insert({
              admin_id: adminSession.userId,
              admin_name: adminSession.name,
              action: `Completed Global Resync. Inserted ${totalInserted} new runs across ${profiles.length} users.`,
              target_type: 'system',
              severity: 'info'
            })
            
        } catch (err) {
            console.error('[Global Resync] Job failed', err);
        }
    })

    return NextResponse.json({ 
      message: 'Global Resync has successfully started in the background. Check audit logs later for completion status.' 
    })

  } catch (error: any) {
    console.error('[Global Resync API Error]', error)
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
