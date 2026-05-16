'use client'

import { useCallback, useRef, useEffect } from 'react'

export function useAudio() {
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const clickAudioRef = useRef<HTMLAudioElement | null>(null)
  const themeAudioRef = useRef<HTMLAudioElement | null>(null)

  const lastHoverTime = useRef(0)
  const lastClickTime = useRef(0)

  // Preload audio on mount (client side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      hoverAudioRef.current = new Audio('/sounds/button_sound.mp3')
      hoverAudioRef.current.volume = 0.15
      hoverAudioRef.current.playbackRate = 2.0 // Higher pitch/shorter for hover
      hoverAudioRef.current.preload = 'auto'

      clickAudioRef.current = new Audio('/sounds/button_sound.mp3')
      clickAudioRef.current.volume = 0.3
      clickAudioRef.current.playbackRate = 1.0 // Normal for click
      clickAudioRef.current.preload = 'auto'

      themeAudioRef.current = new Audio('/sounds/lightdarktoggle.mp3')
      themeAudioRef.current.volume = 0.4
      themeAudioRef.current.playbackRate = 1.0 
      themeAudioRef.current.preload = 'auto'
    }
  }, [])

  const playHover = useCallback(() => {
    try {
      const now = Date.now()
      // Throttle hover sounds to prevent overlapping audio spam
      if (now - lastHoverTime.current < 80) return 
      lastHoverTime.current = now

      if (hoverAudioRef.current) {
        hoverAudioRef.current.currentTime = 0
        hoverAudioRef.current.play().catch(() => {})
      }
    } catch (e) {
      // Ignore audio errors (e.g., strict autoplay policies)
    }
  }, [])

  const playClick = useCallback(() => {
    try {
      const now = Date.now()
      if (now - lastClickTime.current < 100) return
      lastClickTime.current = now

      if (clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0
        clickAudioRef.current.play().catch(() => {})
      }
    } catch (e) {
      // Ignore audio errors
    }
  }, [])
  
  const playThemeToggle = useCallback(() => {
    try {
      if (themeAudioRef.current) {
        themeAudioRef.current.currentTime = 0
        themeAudioRef.current.play().catch(() => {})
      }
    } catch (e) {
      // Ignore audio errors
    }
  }, [])

  return { playHover, playClick, playThemeToggle }
}
