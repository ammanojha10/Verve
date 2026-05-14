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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl px-6 py-4 z-[100] glass rounded-2xl shadow-2-5d transition-all duration-300">
      <div className="flex items-center justify-between mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Verve Run Club Logo" className="h-8 md:h-9 w-auto invert dark:invert-0" />
          <span className="font-heading text-[22px] md:text-[26px] tracking-[4px] text-primary leading-none mt-1">VERVE</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[12px] tracking-[1.5px] uppercase text-foreground no-underline transition-all duration-200 font-medium",
                  isActive ? "opacity-100 text-primary" : "opacity-60 hover:opacity-100"
                )}
              >
                {item.name}
              </Link>
            )
          })}
          <Link
            href={isLoggedIn ? "/dashboard" : "/join"}
            className={cn(
              "text-[12px] tracking-[1.5px] uppercase no-underline transition-all duration-200 font-bold px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm",
              pathname === (isLoggedIn ? "/dashboard" : "/join") ? "bg-primary text-white" : ""
            )}
          >
            {isLoggedIn ? "Dashboard" : "Join"}
          </Link>
        </nav>

        <button className="md:hidden text-foreground p-2 -mr-2" onClick={() => setIsOpen(!isOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-0 top-[64px] bg-background z-50 px-6 py-12 flex flex-col gap-8 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {navItems.map((item) => (
           <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="font-heading text-4xl tracking-[2px] uppercase text-foreground no-underline opacity-80 hover:opacity-100 hover:text-primary transition-all"
            >
              {item.name}
            </Link>
        ))}
        <Link
          href={isLoggedIn ? "/dashboard" : "/join"}
          onClick={() => setIsOpen(false)}
          className="font-heading text-4xl tracking-[2px] uppercase text-primary no-underline"
        >
          {isLoggedIn ? "Dashboard" : "Join Club"}
        </Link>
      </div>
    </header>
  )
}
