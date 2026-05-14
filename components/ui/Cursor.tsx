'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement
      const isClickable = !!target.closest('a, button, [role="button"], input')
      setIsHovering(isClickable)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const animate = () => {
      if (cursorRef.current && ringRef.current) {
        // Fast follow for the inner dot
        cursorRef.current.style.left = `${mx}px`
        cursorRef.current.style.top = `${my}px`
        
        // Lerp follow for the outer ring
        rx += (mx - rx) * 0.12
        ry += (my - ry) * 0.12
        ringRef.current.style.left = `${rx}px`
        ringRef.current.style.top = `${ry}px`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="hidden sm:block">
      <div 
        ref={cursorRef}
        className={cn(
          "fixed w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out mix-blend-multiply",
          isHovering ? "w-5 h-5 bg-primary-deep" : "",
          isClicking ? "scale-50" : "scale-100"
        )}
      />
      <div 
        ref={ringRef}
        className={cn(
          "fixed w-9 h-9 border-[1.5px] border-primary rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out opacity-50",
          isHovering ? "w-[52px] h-[52px] opacity-30" : ""
        )}
      />
    </div>
  )
}
