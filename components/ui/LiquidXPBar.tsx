'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface LiquidXPBarProps {
  progress: number // 0 to 100
  label?: string
  className?: string
}

export function LiquidXPBar({ progress, label, className }: LiquidXPBarProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] tracking-[2px] uppercase text-muted font-medium">{label}</span>
          <span className="text-xs font-heading text-primary">{progress}%</span>
        </div>
      )}
      <div className="h-4 bg-foreground/5 rounded-full overflow-hidden relative border border-foreground/[0.03]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-primary relative"
        >
          {/* Liquid Wave Animation */}
          <div className="absolute top-0 right-0 h-full w-20 overflow-hidden">
             <motion.div 
               animate={{ 
                 x: [0, 40, 0],
                 scaleY: [1, 1.2, 1]
               }}
               transition={{ 
                 duration: 3, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="h-full w-full bg-white/20 blur-md rounded-full -mr-10"
             />
          </div>
        </motion.div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] pointer-events-none rounded-full" />
      </div>
    </div>
  )
}
