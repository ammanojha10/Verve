import { cookies } from 'next/headers'

export interface SessionUser {
  userId: string
  stravaId: string
  name: string
  avatar: string
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('verve_user_id')?.value
  const stravaId = cookieStore.get('verve_strava_id')?.value

  if (!userId || !stravaId) return null

  return {
    userId,
    stravaId,
    name: cookieStore.get('verve_name')?.value || 'Runner',
    avatar: cookieStore.get('verve_avatar')?.value || '',
  }
}
