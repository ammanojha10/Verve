'use client'

import { useCallback, useRef } from 'react'

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playHover = useCallback(() => {
    try {
      const ctx = initAudio()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {
      // Ignore audio errors (e.g. strict autoplay policies)
    }
  }, [])

  const playClick = useCallback(() => {
    try {
      const ctx = initAudio()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch (e) {
      // Ignore audio errors
    }
  }, [])

  return { playHover, playClick }
}
