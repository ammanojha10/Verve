import { createClient } from '@supabase/supabase-js'
import { RevealSection } from '@/components/ui/RevealSection'
import { Trophy } from 'lucide-react'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, user_badges(badges(*))')
    .eq('id', params.id)
    .single()

  if (!profile) {
    return (
      <div className="px-12 py-24 text-center">
        <h1 className="font-heading text-4xl text-primary mb-4">Profile Not Found</h1>
        <p className="text-muted">This runner doesn&apos;t exist.</p>
      </div>
    )
  }

  const earnedBadges = profile.user_badges?.map((ub: any) => ub.badges).filter(Boolean) || []
  const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'

  return (
    <div className="max-w-4xl mx-auto px-12 py-16">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-background shadow-xl ring-2 ring-primary/20 object-cover" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary-pale text-primary-deep flex items-center justify-center text-4xl font-medium border-4 border-background shadow-xl ring-2 ring-primary/20">
            {initials}
          </div>
        )}
        <div className="text-center md:text-left flex-1">
          <h1 className="font-heading text-[clamp(36px,5vw,56px)] leading-none tracking-tight text-foreground mb-3">
            {profile.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 bg-primary text-white font-medium">{profile.tier || 'Jogger'}</span>
            <span className="text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 border border-foreground/[0.12] text-foreground font-light">{profile.xp?.toLocaleString() || '0'} XP</span>
            <span className="text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 border border-primary-pale text-primary bg-primary-pale">{profile.streak_weeks} Wk Streak</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <RevealSection>
        <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Badges Earned
        </div>
        <h2 className="font-heading text-[clamp(28px,3vw,42px)] leading-none tracking-tight text-foreground mb-8 border-b border-foreground/[0.08] pb-4">Collection</h2>
      </RevealSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-foreground/[0.08] border border-foreground/[0.08]">
        {earnedBadges.length > 0 ? earnedBadges.map((badge: any) => (
          <div key={badge.id} className="bg-background p-8 text-center hover:bg-off transition-colors">
            <div className="text-4xl mb-3">{badge.icon || '🏅'}</div>
            <h3 className="font-heading text-lg mb-1">{badge.name}</h3>
            <p className="text-xs text-muted">{badge.description}</p>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center text-muted">
            No badges earned yet. Complete challenges to earn badges!
          </div>
        )}
      </div>
    </div>
  )
}
