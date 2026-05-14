'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Board', href: '/leaderboard' },
  { name: 'Features', href: '/#features' },
  { name: 'Challenges', href: '/challenges' },
  { name: 'Join', href: '/#join' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-12 py-[22px] z-[100] mix-blend-multiply">
      <Link href="/" className="font-heading text-[28px] tracking-[4px] text-primary no-underline">
        VERVE
      </Link>
      <nav className="flex gap-9">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[13px] tracking-[1.5px] uppercase text-foreground no-underline transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
              )}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
