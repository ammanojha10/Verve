import { createClient } from '@supabase/supabase-js'
import { RevealSection } from '@/components/ui/RevealSection'

export const revalidate = 0

export default async function LeaderboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: leaders } = await supabase
    .from('profiles')
    .select('id, name, xp, tier, avatar_url, is_hidden')
    .eq('is_hidden', false)
    .order('xp', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-[780px] mx-auto px-6 md:px-12 py-10 md:py-16">
      <RevealSection>
        <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Global Standings</div>
      </RevealSection>
      <RevealSection delay={80}>
        <h1 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground mb-13">Leaderboard</h1>
      </RevealSection>

      <RevealSection delay={160}>
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-[48px_1fr_120px_100px] pb-3 border-b border-foreground/[0.08] text-[10px] tracking-[2px] uppercase text-muted mb-1">
              <span>#</span><span>Runner</span><span>XP</span><span>Tier</span>
            </div>

            {(!leaders || leaders.length === 0) ? (
              <div className="text-center py-16 text-muted border border-dashed border-foreground/[0.12] mt-4">
                No runners yet. The leaderboard is currently empty.
              </div>
            ) : (
              leaders.map((profile, index) => {
                const rank = String(index + 1).padStart(2, '0')
                const isTop = index < 3
                const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'

                return (
                  <div key={profile.id} className="group grid grid-cols-[48px_1fr_120px_100px] items-center py-[18px] border-b border-foreground/[0.05] relative">
                    <div className="absolute -left-12 -right-12 top-0 bottom-0 bg-primary-pale opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    <span className={`font-heading text-[22px] relative z-10 ${isTop ? 'text-primary' : 'text-muted'}`}>{rank}</span>
                    <div className="flex items-center gap-3.5 relative z-10">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${index === 0 ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-primary-pale text-primary-deep'}`}>
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="text-[15px]">{profile.name}</div>
                        <div className="text-[10px] tracking-[1.5px] uppercase text-muted mt-0.5">{profile.tier || 'Jogger'}</div>
                      </div>
                    </div>
                    <span className="text-[15px] font-light relative z-10">{profile.xp?.toLocaleString() || '0'}</span>
                    <span className="text-[10px] tracking-[1.5px] uppercase px-2.5 py-1 border border-primary-pale text-primary bg-primary-pale inline-block relative z-10">
                      {profile.tier || 'Jogger'}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </RevealSection>
    </div>
  )
}
