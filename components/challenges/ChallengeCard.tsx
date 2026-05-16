'use client'

import { Challenge, Profile } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Activity, MapPin, Users, Target } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ChallengeCardProps {
  challenge: Challenge
  currentUserId?: string
  onJoinToggle?: (challengeId: string, isJoining: boolean) => Promise<void>
}

export function ChallengeCard({ challenge, currentUserId }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const participants = challenge.challenge_participants || []
  const isParticipating = currentUserId 
    ? participants.some(p => p.user_id === currentUserId)
    : false
    
  const isActive = new Date() >= new Date(challenge.start_date) && new Date() <= new Date(challenge.end_date)
  const isUpcoming = new Date() < new Date(challenge.start_date)
  
  const handleToggle = async () => {
    if (!currentUserId) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id, isJoining: !isParticipating }),
      })
      if (!res.ok) throw new Error('Failed to toggle participation')
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getTargetLabel = () => {
    switch (challenge.type) {
      case 'distance': return `${challenge.target} km`
      case 'runs': return `${challenge.target} runs`
      case 'streak': return `${challenge.target} days`
      case 'pace': return `Sub ${Math.floor(challenge.target)}:${Math.round((challenge.target % 1) * 60).toString().padStart(2, '0')}/km`
      default: return challenge.target
    }
  }

  return (
    <div className="bg-background border border-foreground/[0.08] p-6 rounded-sm hover:border-primary/30 transition-colors flex flex-col group relative overflow-hidden">
      {/* Status Badge */}
      <div className="absolute top-0 right-0 px-3 py-1 text-[9px] uppercase tracking-wider font-bold">
        {isActive && <span className="bg-green-500/10 text-green-500">Active</span>}
        {isUpcoming && <span className="bg-blue-500/10 text-blue-500">Upcoming</span>}
        {!isActive && !isUpcoming && <span className="bg-foreground/10 text-muted">Ended</span>}
      </div>

      <div className="flex items-start justify-between mb-4 mt-2">
        <div>
          <h3 className="font-heading text-2xl text-foreground mb-1">{challenge.name}</h3>
          <p className="text-sm text-muted line-clamp-2">{challenge.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6 text-[11px] tracking-wide uppercase text-muted">
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3 text-primary" />
          <span>Goal: <strong className="text-foreground">{getTargetLabel()}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-primary" />
          <span>{participants.length} Participant{participants.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <Activity className="h-3 w-3 text-primary" />
          <span>
            {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-foreground/5">
        {!currentUserId ? (
          <Button variant="outline" className="w-full text-[11px] h-9" disabled>
            Sign in to Join
          </Button>
        ) : isParticipating ? (
          <Button 
            variant="outline" 
            className="w-full text-[11px] h-9 border-primary/20 text-primary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
            onClick={handleToggle}
            disabled={isLoading || (!isActive && !isUpcoming)}
          >
            {isLoading ? 'Leaving...' : 'Leave Challenge'}
          </Button>
        ) : (
          <Button 
            className="w-full text-[11px] h-9"
            onClick={handleToggle}
            disabled={isLoading || (!isActive && !isUpcoming)}
          >
            {isLoading ? 'Joining...' : 'Join Challenge'}
          </Button>
        )}
      </div>
    </div>
  )
}
