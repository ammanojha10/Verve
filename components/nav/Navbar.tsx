'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { name: 'Board', href: '/leaderboard' },
  { name: 'Features', href: '/#features' },
  { name: 'Challenges', href: '/challenges' },
  { name: 'Join', href: '/#join' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 px-6 md:px-12 py-4 md:py-[22px] z-[100] md:mix-blend-multiply bg-background/95 backdrop-blur-md border-b border-foreground/[0.05] md:border-none md:bg-transparent md:backdrop-blur-none">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Verve Run Club Logo" className="h-8 md:h-10 w-auto invert dark:invert-0" />
          <span className="font-heading text-[24px] md:text-[28px] tracking-[4px] text-primary">VERVE</span>
        </Link>
        <nav className="hidden md:flex gap-9">
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
        <button className="md:hidden text-foreground p-2 -mr-2" onClick={() => setIsOpen(!isOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden pt-6 pb-2 flex flex-col gap-5">
          {navItems.map((item) => (
             <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-[13px] tracking-[1.5px] uppercase text-foreground no-underline opacity-80"
              >
                {item.name}
              </Link>
          ))}
        </div>
      )}
    </header>
  )
}
