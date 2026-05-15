'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo3D } from '@/components/ui/logo-3d';
import { useTheme } from 'next-themes';

const navItems = [
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Challenges', href: '/challenges' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const logged = document.cookie.split(';').some((i) => i.trim().startsWith('verve_name='));
    setIsLoggedIn(logged);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const logoContainerClass = cn(
    'transition-transform group-hover:scale-110 drop-shadow-md',
    resolvedTheme === 'light' ? 'bg-primary/10 rounded-sm p-1' : ''
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b',
        scrolled ? 'bg-background/80 backdrop-blur-md py-3' : 'bg-background py-5',
        'border-foreground/5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className={logoContainerClass}>
            <Logo3D className="w-10 h-10" />
          </div>
          <span className="font-heading text-2xl tracking-[3px] text-foreground">
            VERVE
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[11px] tracking-[2px] uppercase no-underline transition-all duration-200 font-bold',
                  isActive ? 'text-primary' : 'text-foreground/60 hover:text-primary'
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="h-4 w-[1px] bg-foreground/10 mx-2" />
          <ThemeToggle />
          <Link
            href={isLoggedIn ? '/dashboard' : '/join'}
            className={cn(
              'text-[11px] tracking-[2px] uppercase no-underline transition-all duration-200 font-bold px-6 py-2.5 rounded-full',
              isLoggedIn
                ? 'bg-foreground/5 text-foreground hover:bg-foreground/10'
                : 'bg-primary text-white hover:bg-primary-deep shadow-sm'
            )}
          >
            {isLoggedIn ? 'Dashboard' : 'Join Club'}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button className="text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-[64px] bg-background z-50 px-6 py-12 flex flex-col gap-8 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="font-heading text-5xl tracking-[2px] uppercase text-foreground no-underline"
          >
            {item.name}
          </Link>
        ))}
        <Link
          href={isLoggedIn ? '/dashboard' : '/join'}
          onClick={() => setIsOpen(false)}
          className="font-heading text-5xl tracking-[2px] uppercase text-primary no-underline"
        >
          {isLoggedIn ? 'Dashboard' : 'Join Club'}
        </Link>
      </div>
    </header>
  );
}
