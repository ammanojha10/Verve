import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/adminAuth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdminApi()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    let dbQuery = supabase
      .from('profiles')
      .select('id, name, strava_id, xp, tier, role, is_hidden, created_at', { count: 'exact' })

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,strava_id.eq.${Number(query) || 0}`)
    }

    const { data: users, count, error } = await dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      users,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    const status = error.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}
