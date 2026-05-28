import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireAdminApi()
    if (session instanceof NextResponse) return session

    const supabase = createAdminClient()
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ challenges })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminApi()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const { title, type, target_value, unit, start_date, end_date } = body

    if (!title || !type || !target_value || !unit || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert({
        title,
        type,
        target_value,
        unit,
        start_date,
        end_date
      })
      .select()
      .single()

    if (error) throw error

    // Log to audit table
    await supabase.from('audit_logs').insert({
      admin_id: session.userId,
      admin_name: session.name,
      action: `Created challenge ${title}`,
      target_type: 'challenge',
      target_id: challenge.id,
      severity: 'info',
      metadata: { challenge }
    })

    return NextResponse.json({ success: true, challenge })
  } catch (error: any) {
    console.error('Failed to create challenge:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
