'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const navItems = [
  { name: 'Board', href: '/leaderboard' },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Challenges', href: '/challenges' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check for verve_user_id cookie
    const hasUserId = document.cookie.includes('verve_user_id')
    setIsLoggedIn(hasUserId)
  }, [pathname])

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-[100] transition-all duration-500">
      <div className={cn(
        "glass rounded-full px-6 md:px-10 py-3 md:py-4 flex items-center justify-between border-white/40",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]"
      )}>
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <img src="/logo.png" alt="Verve Run Club Logo" className="h-7 md:h-8 w-auto invert dark:invert-0 group-hover:rotate-[10deg] transition-transform" />
          <span className="font-heading text-xl md:text-2xl tracking-[3px] text-primary leading-none mt-1">VERVE</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[11px] tracking-[1.5px] uppercase text-foreground no-underline transition-all duration-300 font-bold",
                  isActive ? "text-primary" : "opacity-50 hover:opacity-100 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            )
          })}
          <div className="h-4 w-[1px] bg-foreground/10 mx-2" />
          <Link
            href={isLoggedIn ? "/dashboard" : "/join"}
            className={cn(
              "text-[11px] tracking-[1.5px] uppercase no-underline transition-all duration-300 font-black text-primary hover:scale-105 active:scale-95",
              pathname === (isLoggedIn ? "/dashboard" : "/join") ? "underline underline-offset-4" : ""
            )}
          >
            {isLoggedIn ? "Dashboard" : "Join"}
          </Link>
        </nav>

        <button className="md:hidden text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 12h16M4 6h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-x-0 top-20 bg-background/95 backdrop-blur-xl border border-foreground/[0.05] rounded-3xl mx-6 p-8 flex flex-col gap-6 shadow-2xl transition-all duration-500 origin-top",
        isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
      )}>
        {navItems.map((item) => (
           <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="font-heading text-3xl tracking-[1px] uppercase text-foreground no-underline"
            >
              {item.name}
            </Link>
        ))}
        <Link
          href={isLoggedIn ? "/dashboard" : "/join"}
          onClick={() => setIsOpen(false)}
          className="font-heading text-3xl tracking-[1px] uppercase text-primary no-underline"
        >
          {isLoggedIn ? "Dashboard" : "Join Club"}
        </Link>
      </div>
    </header>
  )
}
