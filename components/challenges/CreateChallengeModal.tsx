'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Plus } from 'lucide-react'

export function CreateChallengeModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void
  onSuccess: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      type: formData.get('type'),
      target: Number(formData.get('target')),
      start_date: new Date(formData.get('start_date') as string).toISOString(),
      end_date: new Date(formData.get('end_date') as string).toISOString(),
    }

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create challenge')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-foreground/[0.08] w-full max-w-md rounded-md shadow-2xl overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between p-4 border-b border-foreground/[0.05]">
          <h2 className="font-heading text-2xl text-foreground">Create Challenge</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">Challenge Name</label>
            <input 
              required
              name="name"
              className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors"
              placeholder="e.g., Summer 100K Challenge"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">Description</label>
            <textarea 
              name="description"
              className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors min-h-[80px]"
              placeholder="What's the goal?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">Type</label>
              <select 
                name="type"
                className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors"
              >
                <option value="distance" className="bg-background">Distance (km)</option>
                <option value="runs" className="bg-background">Total Runs</option>
                <option value="streak" className="bg-background">Daily Streak</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">Target</label>
              <input 
                required
                type="number"
                name="target"
                min="1"
                step="any"
                className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors"
                placeholder="e.g., 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">Start Date</label>
              <input 
                required
                type="date"
                name="start_date"
                className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors text-foreground"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-1">End Date</label>
              <input 
                required
                type="date"
                name="end_date"
                className="w-full bg-transparent border border-foreground/10 p-2 text-sm focus:border-primary outline-none transition-colors text-foreground"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
