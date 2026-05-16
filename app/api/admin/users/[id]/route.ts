import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTier } from '@/lib/xp'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminSession = await requireAdminApi()

    const supabase = createAdminClient()

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (userError) throw userError
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Fetch their recent runs
    const { data: runs, error: runsError } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', id)
      .order('start_time', { ascending: false })
      .limit(20)

    if (runsError) throw runsError

    return NextResponse.json({ user, runs })
  } catch (error: any) {
    console.error('Failed to fetch user details:', error)
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminSession = await requireAdminApi()

    const body = await request.json()
    const { xp_delta, xp_reason, role, is_hidden } = body

    const supabase = createAdminClient()

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('name, xp, tier, role, is_hidden')
      .eq('id', id)
      .single()

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updates: any = {}
    const auditActions: string[] = []

    // 1. Handle XP Changes
    if (xp_delta !== undefined && typeof xp_delta === 'number' && xp_delta !== 0) {
      const newXp = Math.max(0, profile.xp + xp_delta) // Prevent negative XP
      const newTier = getTier(newXp)
      
      updates.xp = newXp
      updates.tier = newTier
      
      auditActions.push(`${xp_delta > 0 ? 'Added' : 'Deducted'} ${Math.abs(xp_delta)} XP. Reason: ${xp_reason || 'Manual adjustment'}`)
    }

    // 2. Handle Role Changes
    if (role !== undefined && role !== profile.role) {
      // Only super_admin can promote to super_admin or demote a super_admin
      if ((role === 'super_admin' || profile.role === 'super_admin') && adminSession.role !== 'super_admin') {
        return NextResponse.json({ error: 'Only super_admins can manage super_admin roles' }, { status: 403 })
      }
      updates.role = role
      auditActions.push(`Changed role from ${profile.role || 'user'} to ${role}`)
    }

    // 3. Handle Visibility Changes (Moderation)
    if (is_hidden !== undefined && is_hidden !== profile.is_hidden) {
      updates.is_hidden = is_hidden
      auditActions.push(`${is_hidden ? 'Hid' : 'Unhid'} user from leaderboards`)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No changes provided' })
    }

    // Apply updates
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)

    if (updateError) throw updateError

    // Log to audit table
    await supabase.from('audit_logs').insert({
      admin_id: adminSession.userId,
      admin_name: adminSession.name,
      action: `Modified user ${profile.name}`,
      target_type: 'user',
      target_id: id,
      severity: is_hidden ? 'warning' : 'info',
      metadata: { actions: auditActions }
    })

    return NextResponse.json({ success: true, updates })

  } catch (error: any) {
    console.error('Failed to update user:', error)
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
