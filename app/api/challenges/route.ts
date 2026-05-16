import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('verve_user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Basic validation
    if (!data.name || !data.type || !data.target || !data.start_date || !data.end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert({
        name: data.name,
        description: data.description,
        type: data.type,
        target: data.target,
        start_date: data.start_date,
        end_date: data.end_date,
        created_by: userId
      })
      .select()
      .single()

    if (error) throw error

    // Automatically join the creator to the challenge
    if (challenge) {
      await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challenge.id,
          user_id: userId
        })
    }

    return NextResponse.json(challenge)
  } catch (error: any) {
    console.error('[challenges] Create error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
