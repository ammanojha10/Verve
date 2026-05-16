import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const session = await requireAdminApi()
    if (session instanceof NextResponse) return session

    const supabaseAdmin = createAdminClient()
    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ logs })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
