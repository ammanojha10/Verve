'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassBadgeProps {
  icon: ReactNode
  label: string
  className?: string
  delay?: number
}

export function GlassBadge({ icon, label, className, delay = 0 }: GlassBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        rotateY: 10,
        boxShadow: "0 20px 40px -10px rgba(192, 57, 43, 0.25)"
      }}
      className={cn(
        "glass flex flex-col items-center justify-center p-6 rounded-2xl w-[120px] h-[140px] gap-3 text-center cursor-default shadow-2-5d",
        className
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div 
        style={{ transform: 'translateZ(30px)' }}
        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
      >
        {icon}
      </div>
      <div 
        style={{ transform: 'translateZ(20px)' }}
        className="text-[10px] tracking-[2px] uppercase font-heading text-foreground"
      >
        {label}
      </div>
      
      {/* Liquid refraction pulse */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none"
      />
    </motion.div>
  )
}
