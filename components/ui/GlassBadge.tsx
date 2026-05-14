'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Award } from 'lucide-react'

interface GlassBadgeProps {
  icon?: React.ReactNode
  label: string
  className?: string
  delay?: number
}

export function GlassBadge({ icon, label, className, delay = 0 }: GlassBadgeProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={cn(
        "glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2 min-w-[100px] depth-25d",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
        {icon || <Award className="h-6 w-6" />}
        
        {/* Shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-50" />
      </div>
      
      <div className="text-[10px] tracking-[2px] uppercase font-bold text-foreground/60">{label}</div>
    </motion.div>
  )
}
