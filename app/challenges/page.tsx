import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ChallengesPage() {
  const challenges = [
    { id: 1, title: 'May Distance Challenge', target: '100km', type: 'Personal', sub: 'Personal · 12 days left', pct: 45 },
    { id: 2, title: 'Beat the Heat 5K', target: 'Sub 25m', type: 'Duel', sub: 'Duel · 5 days left', pct: 0 },
    { id: 3, title: 'Everest Elevation', target: '8,848m', type: 'Team', sub: 'Team · 2 months left · 18 runners', pct: 36 },
  ]

  return (
    <div className="max-w-[780px] mx-auto px-12 py-16">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <RevealSection>
            <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Push your limits</div>
          </RevealSection>
          <RevealSection delay={80}>
            <h1 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground">Challenges</h1>
          </RevealSection>
        </div>
        <Button>Create Challenge</Button>
      </div>

      {challenges.map((ch, i) => (
        <RevealSection key={ch.id} delay={160 + i * 80}>
          <div className="flex items-center gap-9 bg-foreground/[0.02] border border-foreground/[0.08] p-8 mb-4 hover:bg-off transition-colors duration-200">
            <div className="flex-1">
              <div className="text-base text-foreground font-medium">{ch.title}</div>
              <div className="text-xs text-muted mt-0.5">{ch.sub} · Target: {ch.target}</div>
            </div>
            <div className="flex-[2] h-1 bg-foreground/[0.08] rounded-sm overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-sm transition-all duration-1000" style={{ width: `${ch.pct}%` }} />
            </div>
            <div className="font-heading text-[28px] text-primary min-w-[60px] text-right">{ch.pct}%</div>
          </div>
        </RevealSection>
      ))}
    </div>
  )
}
