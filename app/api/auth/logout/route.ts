import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('verve_user_id')
  cookieStore.delete('verve_strava_id')
  cookieStore.delete('verve_name')
  cookieStore.delete('verve_avatar')

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`)
}
