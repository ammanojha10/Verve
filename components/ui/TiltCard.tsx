'use client'

import { useState, useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  glareOpacity?: number
}

export function TiltCard({ children, className, glareOpacity = 0.15 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl transition-shadow duration-300",
        className
      )}
    >
      <div 
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
      </div>

      {/* Glare effect */}
      <motion.div
        style={{
          background: `radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,${glareOpacity}) 0%, transparent 80%)`,
          transform: "translateZ(51px)",
        }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </motion.div>
  )
}
