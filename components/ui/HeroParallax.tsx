'use client'

import { useEffect, useRef } from 'react'

export function HeroParallax() {
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gradientRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 18
      gradientRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={gradientRef}
      className="absolute inset-0 bg-gradient-to-br from-primary-pale via-primary-light to-primary-deep transition-transform duration-100 ease-out"
    />
  )
}
