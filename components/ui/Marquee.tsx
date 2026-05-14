import { cn } from "@/lib/utils"

export function Marquee({ className }: { className?: string }) {
  const items = [
    "DISTANCE", "VERVE", "ELEVATION", "STREAK", "BADGES", 
    "CHALLENGES", "LEADERBOARD", "XP", "LEVELS", "KUDOS"
  ]
  // Duplicate for seamless scroll
  const fullItems = [...items, ...items]

  return (
    <div className={cn("bg-primary overflow-hidden py-3.5 border-y border-primary-deep", className)}>
      <div className="flex gap-0 animate-marquee whitespace-nowrap w-max">
        {fullItems.map((item, i) => (
          <span key={i} className="font-heading text-lg tracking-[3px] text-white px-8 opacity-85">
            {item} <span className="text-white/40 px-2">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
