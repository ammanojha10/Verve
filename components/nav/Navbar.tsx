'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAudio } from '@/hooks/use-audio';

const navItems = [
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Challenges', href: '/challenges' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About Us', href: '/about' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { playHover, playClick } = useAudio();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const logged = document.cookie.split(';').some((i) => i.trim().startsWith('verve_name='));
    setIsLoggedIn(logged);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[110] bg-background text-foreground py-6 px-8 md:px-16 flex items-start justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="font-heading text-xl md:text-2xl font-black uppercase tracking-tighter leading-none"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          VERVE
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-16 pt-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[9px] tracking-[0.2em] font-bold uppercase hover:opacity-50 transition-opacity"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href={isLoggedIn ? '/dashboard' : '/join'}
            className="bg-[#F9C02D] text-[#000000] text-[9px] font-bold tracking-[0.1em] uppercase px-5 py-2.5 rounded-full hover:bg-[#E6B029] transition-colors"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            {isLoggedIn ? 'Dashboard' : 'Join Club'}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => { playClick(); setIsOpen(!isOpen); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-background z-[105] flex flex-col items-center justify-center gap-8 transition-transform duration-300',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <button onClick={closeMenu} className="absolute top-6 right-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => { playClick(); closeMenu(); }}
            onMouseEnter={playHover}
            className="text-lg font-bold tracking-[0.2em] uppercase text-foreground"
          >
            {item.name}
          </Link>
        ))}
        <Link
          href={isLoggedIn ? '/dashboard' : '/join'}
          onClick={() => { playClick(); closeMenu(); }}
          onMouseEnter={playHover}
          className="mt-8 bg-[#F9C02D] text-[#000000] text-sm font-bold tracking-[0.1em] uppercase px-8 py-3 rounded-full"
        >
          {isLoggedIn ? 'Dashboard' : 'Join Club'}
        </Link>
      </div>
    </>
  );
}
