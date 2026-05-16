'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { CreateChallengeModal } from '@/components/challenges/CreateChallengeModal'

export function ChallengeHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-foreground/[0.08] pb-8">
        <div>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-2">Community</div>
          <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-none tracking-tight text-foreground">
            Challenges
          </h1>
          <p className="text-muted mt-4 max-w-lg">
            Push your limits. Join community challenges to earn extra XP and unlock exclusive badges.
          </p>
        </div>
        
        {isLoggedIn ? (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>
        ) : (
          <div className="text-xs text-muted/70 p-3 bg-foreground/5 rounded border border-foreground/10">
            Sign in to create challenges
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateChallengeModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false)
            window.location.reload()
          }} 
        />
      )}
    </>
  )
}
