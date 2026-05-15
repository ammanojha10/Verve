import { cn } from "@/lib/utils"

export function GooeyBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background", className)}>
      <svg className="hidden">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 30 -15" 
            result="goo" 
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <div className="absolute inset-0 w-full h-full opacity-60" style={{ filter: "url(#goo)" }}>
        {/* Red gradient blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#FF453A] to-[#C0392B] rounded-full animate-blob blur-xl" />
        
        {/* Deep Red blob */}
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-gradient-to-tr from-[#922B21] to-[#C0392B] rounded-full animate-blob animation-delay-2000 blur-xl" />
        
        {/* Pale Red/Off-white blob */}
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-gradient-to-bl from-[#F9EBEA] to-[#FF453A] rounded-full animate-blob animation-delay-4000 blur-xl opacity-80" />
      </div>
    </div>
  )
}
