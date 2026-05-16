'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface AudioContextType {
  isPlaying: boolean
  toggleMusic: () => void
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
})

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Load YouTube IFrame API
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-audio-player', {
        height: '0',
        width: '0',
        videoId: '7-TaFkR6zzs',
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: 267,
          loop: 1,
          playlist: '7-TaFkR6zzs', // required for looping a single video
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(20) // subtle volume
            setIsReady(true)
            
            // Try to play immediately if user preference is 'on'
            const pref = localStorage.getItem('verve_music')
            if (pref === 'on') {
              event.target.playVideo()
              setIsPlaying(true)
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false)
            }
          }
        },
      })
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
      }
    }
  }, [])

  // Auto-play on first interaction if no preference is set
  useEffect(() => {
    const handleInteraction = () => {
      if (isReady && playerRef.current) {
        const musicPref = localStorage.getItem('verve_music')
        if (!musicPref) {
          playerRef.current.playVideo()
          setIsPlaying(true)
          localStorage.setItem('verve_music', 'on')
        }
      }
      document.removeEventListener('click', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    return () => document.removeEventListener('click', handleInteraction)
  }, [isReady])

  const toggleMusic = () => {
    if (!playerRef.current || !isReady) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
      localStorage.setItem('verve_music', 'off')
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
      localStorage.setItem('verve_music', 'on')
    }
  }

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
      <div id="yt-audio-player" style={{ display: 'none' }}></div>
    </AudioContext.Provider>
  )
}

export const useBackgroundMusic = () => useContext(AudioContext)
