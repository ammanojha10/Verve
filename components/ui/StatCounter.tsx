'use client'

import { useEffect, useRef } from 'react'

interface StatCounterProps {
  id: string
  target: number
  suffix?: string
  delay?: number
}

export function StatCounter({ id, target, suffix = '', delay = 0 }: StatCounterProps) {
  const elRef = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted.current) {
          counted.current = true
          setTimeout(() => {
            let start: number | null = null
            const duration = 1800
            const step = (ts: number) => {
              if (!start) start = ts
              const progress = Math.min((ts - start) / duration, 1)
              el.textContent = Math.floor(progress * target).toLocaleString() + suffix
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }, delay)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, delay])

  return <span ref={elRef} id={id}>0{suffix}</span>
}
