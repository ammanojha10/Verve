'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type SyncState = 'idle' | 'loading' | 'success' | 'error'

interface SyncResult {
  inserted?: number
  xpGained?: number
  error?: string
}

export function SyncButton({ onSyncComplete }: { onSyncComplete?: () => void }) {
  const [state, setState] = useState<SyncState>('idle')
  const [result, setResult] = useState<SyncResult | null>(null)

  async function handleSync() {
    if (state === 'loading') return
    setState('loading')
    setResult(null)

    try {
      const res = await fetch('/api/strava/sync', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setState('error')
        setResult({ error: data.error || 'Sync failed' })
        setTimeout(() => setState('idle'), 4000)
        return
      }

      setState('success')
      setResult({ inserted: data.inserted, xpGained: data.xpGained })
      onSyncComplete?.()
      // Auto-refresh page data after short delay so stats update
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch {
      setState('error')
      setResult({ error: 'Network error. Please try again.' })
      setTimeout(() => setState('idle'), 4000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={state === 'loading'}
        className={cn(
          'flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-bold px-5 py-2.5 rounded-full transition-all duration-200',
          state === 'idle' && 'bg-foreground/5 text-foreground hover:bg-primary hover:text-white border border-foreground/10',
          state === 'loading' && 'bg-foreground/5 text-muted cursor-not-allowed border border-foreground/10',
          state === 'success' && 'bg-green-500/10 text-green-600 border border-green-500/20',
          state === 'error' && 'bg-primary/10 text-primary border border-primary/20',
        )}
      >
        {state === 'loading' && (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        )}
        {state === 'success' && (
          <CheckCircle className="h-3.5 w-3.5" />
        )}
        {state === 'error' && (
          <XCircle className="h-3.5 w-3.5" />
        )}
        {state === 'idle' && (
          <RefreshCw className="h-3.5 w-3.5" />
        )}

        {state === 'idle' && 'Sync Strava'}
        {state === 'loading' && 'Syncing…'}
        {state === 'success' && 'Synced!'}
        {state === 'error' && 'Retry'}
      </button>

      {/* Feedback message */}
      {state === 'success' && result && (
        <p className="text-[10px] text-green-600 tracking-wide animate-fade-up">
          +{result.inserted} run{result.inserted !== 1 ? 's' : ''} · +{result.xpGained} XP earned
        </p>
      )}
      {state === 'error' && result?.error && (
        <p className="text-[10px] text-primary tracking-wide animate-fade-up">
          {result.error}
        </p>
      )}
    </div>
  )
}
