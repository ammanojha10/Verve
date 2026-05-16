import { cookies } from 'next/headers'

export interface SessionUser {
  userId: string
  stravaId: string
  name: string
  avatar: string
  role?: 'user' | 'moderator' | 'admin' | 'super_admin'
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('verve_user_id')?.value
  const stravaId = cookieStore.get('verve_strava_id')?.value

  if (!userId || !stravaId) return null

  // Fetch the current role from DB (vital for admin security)
  const { createServerClient } = await import('@/lib/supabase/server')
  const supabase = await createServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return {
    userId,
    stravaId,
    name: cookieStore.get('verve_name')?.value || 'Runner',
    avatar: cookieStore.get('verve_avatar')?.value || '',
    role: profile?.role || 'user',
  }
}
