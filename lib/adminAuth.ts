import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function requireAdminRoute() {
  const session = await getSession()
  
  if (!session) {
    redirect('/')
  }
  
  if (session.role !== 'admin' && session.role !== 'super_admin') {
    redirect('/dashboard')
  }
  
  return session
}

export async function requireAdminApi() {
  const session = await getSession()
  
  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  return session
}

export async function logAdminAction(payload: {
  admin_id: string
  admin_name: string
  action: string
  target_type: 'user' | 'run' | 'challenge' | 'system'
  target_id?: string
  metadata?: any
  severity?: 'info' | 'warning' | 'critical'
}) {
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabaseAdmin = createAdminClient()
  
  try {
    await supabaseAdmin.from('audit_logs').insert({
      ...payload,
      severity: payload.severity || 'info'
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}
