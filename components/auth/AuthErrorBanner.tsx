'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const ERROR_MESSAGES: Record<string, string> = {
  strava_denied: 'Strava access was denied. Please try again to connect your account.',
  token_exchange_failed: 'Failed to communicate with Strava. Please try again later.',
  user_creation_failed: 'We couldn\'t create your profile. Please contact support if this persists.',
  server_error: 'A server error occurred. Please try again later.',
}

export function AuthErrorBanner() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error && ERROR_MESSAGES[error]) {
      setIsVisible(true)
    }
  }, [error])

  if (!isVisible || !error || !ERROR_MESSAGES[error]) return null

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-48px)] max-w-xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-primary text-white px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 border border-white/10">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium flex-1">
          {ERROR_MESSAGES[error]}
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
