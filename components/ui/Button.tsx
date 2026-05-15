'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useAudio } from "@/hooks/use-audio"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[13px] tracking-[1.5px] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-primary text-white font-medium hover:bg-primary-deep hover:-translate-y-0.5",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline: "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary hover:-translate-y-0.5",
        ghost: "hover:bg-off text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-8 py-3.5",
        sm: "h-9 px-4 text-xs",
        lg: "px-10 py-4 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onMouseEnter, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { playHover, playClick } = useAudio()
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onMouseEnter={(e) => {
          playHover()
          onMouseEnter?.(e as any)
        }}
        onClick={(e) => {
          playClick()
          onClick?.(e as any)
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
