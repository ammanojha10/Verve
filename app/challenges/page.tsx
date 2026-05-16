import { getSession } from '@/lib/session'
import { createClient } from '@supabase/supabase-js'
import { Challenge } from '@/lib/types'
import { ChallengeHeader } from './ChallengeHeader'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'

// Force dynamic since we depend on cookies/auth and DB state
export const dynamic = 'force-dynamic'

export default async function ChallengesPage() {
  const session = await getSession()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all challenges and their participants
  // We handle potential errors gracefully in case the table doesn't exist yet
  let challenges: Challenge[] = []
  let errorMsg = null

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, challenge_participants(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    challenges = data as Challenge[]
  } catch (e: any) {
    console.error('Failed to fetch challenges:', e)
    // If the table doesn't exist, we show empty state instead of failing completely
    if (e.code !== '42P01') {
      errorMsg = 'Could not load challenges at this time.'
    }
  }

  const activeChallenges = challenges.filter(c => new Date() >= new Date(c.start_date) && new Date() <= new Date(c.end_date))
  const upcomingChallenges = challenges.filter(c => new Date() < new Date(c.start_date))
  const pastChallenges = challenges.filter(c => new Date() > new Date(c.end_date))

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16">
      <ChallengeHeader isLoggedIn={!!session} />

      {errorMsg && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded border border-red-500/20 mb-8">
          {errorMsg}
        </div>
      )}

      {challenges.length === 0 && !errorMsg ? (
        <div className="text-center py-24 border border-dashed border-foreground/10 rounded-lg bg-foreground/[0.02]">
          <h3 className="font-heading text-2xl text-foreground mb-2">No Challenges Yet</h3>
          <p className="text-muted mb-6">Be the first to create a community challenge!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {activeChallenges.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl mb-6 text-foreground">Active Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map(c => (
                  <ChallengeCard key={c.id} challenge={c} currentUserId={session?.userId} />
                ))}
              </div>
            </section>
          )}

          {upcomingChallenges.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl mb-6 text-foreground">Upcoming Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingChallenges.map(c => (
                  <ChallengeCard key={c.id} challenge={c} currentUserId={session?.userId} />
                ))}
              </div>
            </section>
          )}

          {pastChallenges.length > 0 && (
            <section className="opacity-70">
              <h2 className="font-heading text-3xl mb-6 text-foreground">Past Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastChallenges.map(c => (
                  <ChallengeCard key={c.id} challenge={c} currentUserId={session?.userId} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
