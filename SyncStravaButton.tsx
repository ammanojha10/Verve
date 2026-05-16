'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export function SyncStravaButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ synced: number; xp: number } | null>(null)

  async function handleSync() {
    setStatus('loading')
    setResult(null)
    try {
      const res = await fetch('/api/strava/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setStatus('done')
      // Reload after a short delay so stats refresh
      setTimeout(() => window.location.reload(), 1500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col items-start md:items-end gap-1">
      <button
        onClick={handleSync}
        disabled={status === 'loading'}
        className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-bold px-4 py-2 border border-foreground/10 hover:border-primary hover:text-primary transition-all rounded-full disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
        {status === 'loading' ? 'Syncing…' : 'Sync Strava'}
      </button>
      {status === 'done' && result && (
        <span className="text-[10px] text-primary tracking-wide">
          {result.synced === 0 ? 'Already up to date' : `+${result.synced} run${result.synced !== 1 ? 's' : ''} synced`}
        </span>
      )}
      {status === 'error' && (
        <span className="text-[10px] text-red-400 tracking-wide">Sync failed — try again</span>
      )}
    </div>
  )
}
