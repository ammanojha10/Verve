'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[13px] tracking-[2px] uppercase font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans transition-none brutal-hover",
  {
    variants: {
      variant: {
        default: "bg-[#000000] text-[#F3EDE3] border-[4px] border-[#000000] hover:bg-[#F3EDE3] hover:text-[#000000]",
        destructive: "bg-[#EF3322] text-[#000000] border-[4px] border-[#000000] hover:bg-[#000000] hover:text-[#EF3322]",
        outline: "bg-transparent text-[#000000] border-[4px] border-[#000000] hover:bg-[#000000] hover:text-[#F3EDE3]",
        ghost: "bg-transparent text-[#000000] hover:bg-[#000000] hover:text-[#F3EDE3]",
        link: "text-[#000000] underline-offset-4 hover:underline",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
