'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface LiquidXPBarProps {
  progress: number // 0 to 100
  label?: string
  className?: string
  color?: string
}

export function LiquidXPBar({ progress, label, className, color = "#C0392B" }: LiquidXPBarProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-end">
          <span className="text-[10px] tracking-[2px] uppercase text-muted font-bold">{label}</span>
          <span className="font-heading text-xl text-primary">{progress}%</span>
        </div>
      )}
      
      <div className="relative h-4 w-full bg-off rounded-full overflow-hidden border border-foreground/[0.05]">
        {/* The Liquid Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          style={{ backgroundColor: color }}
          className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end overflow-hidden"
        >
          {/* Gooey/Wave Effect overlay */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ 
                x: [0, -100, 0],
                rotate: [0, 5, 0] 
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </div>
          
          {/* Liquid head bubble */}
          <div className="w-4 h-full bg-white/30 blur-[2px] mr-[-2px] rounded-full" />
        </motion.div>
      </div>

      {/* Level Indicators */}
      <div className="flex justify-between px-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="w-[1px] h-1 bg-foreground/10" />
        ))}
      </div>
    </div>
  )
}
