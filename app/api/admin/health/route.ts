import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const session = await requireAdminApi()
    if (session instanceof NextResponse) return session

    const supabaseAdmin = createAdminClient()
    
    // Check DB connection
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      totalUsers: count,
      stravaApi: 'rate limits unmonitored currently'
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
