'use client'

import { useState } from 'react'
import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

const INITIAL_CHALLENGES = [
  { id: 1, title: 'May Distance Challenge', target: '100km', type: 'Personal', sub: 'Personal · 12 days left', pct: 45 },
  { id: 2, title: 'Beat the Heat 5K', target: 'Sub 25m', type: 'Duel', sub: 'Duel · 5 days left', pct: 0 },
  { id: 3, title: 'Everest Elevation', target: '8,848m', type: 'Team', sub: 'Team · 2 months left · 18 runners', pct: 36 },
]

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form states
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [type, setType] = useState('Personal')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !target) return

    const newChallenge = {
      id: challenges.length + 1,
      title,
      target,
      type,
      sub: `${type} · Just started`,
      pct: 0
    }

    setChallenges([newChallenge, ...challenges])
    setIsModalOpen(false)
    setTitle('')
    setTarget('')
    setType('Personal')
  }

  return (
    <div className="max-w-[780px] mx-auto px-6 md:px-12 py-10 md:py-16">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <RevealSection>
            <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Push your limits</div>
          </RevealSection>
          <RevealSection delay={80}>
            <h1 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground">Challenges</h1>
          </RevealSection>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">Create Challenge</Button>
      </div>

      {challenges.map((ch, i) => (
        <RevealSection key={ch.id} delay={160 + i * 80}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-9 bg-foreground/[0.02] border border-foreground/[0.08] p-5 md:p-8 mb-4 hover:bg-off transition-colors duration-200">
            <div className="flex-1 mb-2 md:mb-0">
              <div className="text-base text-foreground font-medium">{ch.title}</div>
              <div className="text-xs text-foreground/40 mt-0.5">{ch.sub} · Target: {ch.target}</div>
            </div>
            <div className="w-full md:flex-[2] flex items-center gap-4 md:min-w-[200px]">
              <div className="flex-1 h-1.5 md:h-1 bg-foreground/[0.08] rounded-sm overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-sm transition-all duration-1000" style={{ width: `${ch.pct}%` }} />
              </div>
              <div className="font-heading text-[24px] md:text-[28px] text-primary min-w-[50px] text-right">
                {ch.pct}%
              </div>
            </div>
          </div>
        </RevealSection>
      ))}

      {/* CREATE CHALLENGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-foreground/10 p-8 max-w-[500px] w-full relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-heading text-3xl mb-8">New Challenge</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[2px] uppercase text-foreground/60">Challenge Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Summer 100k"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[2px] uppercase text-foreground/60">Target</label>
                <input 
                  type="text" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. 100km, 5:00/km"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[2px] uppercase text-foreground/60">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="Personal">Personal</option>
                  <option value="Duel">Duel</option>
                  <option value="Team">Team</option>
                </select>
              </div>
              <Button type="submit" className="w-full mt-4">Launch Challenge</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
