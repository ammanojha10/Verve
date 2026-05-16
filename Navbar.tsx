'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo3D } from '@/components/ui/logo-3d';

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

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Scroll listener + login check
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const logged = document.cookie.split(';').some((i) => i.trim().startsWith('verve_name='));
    setIsLoggedIn(logged);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b',
          scrolled ? 'bg-background/80 backdrop-blur-md py-3' : 'bg-background py-5',
          'border-foreground/5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <Logo3D className="w-10 h-10 transition-transform group-hover:scale-110 drop-shadow-md" />
            <span className="font-heading text-2xl tracking-[3px] text-foreground">VERVE</span>
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
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              className="text-foreground p-2 -mr-2 relative z-[110] touch-manipulation"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
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
                {isOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-black/40 z-[95] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          'md:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-[360px] bg-background z-[105]',
          'flex flex-col px-8 pt-24 pb-12 gap-6',
          'transition-transform duration-300 ease-in-out overflow-y-auto',
          'shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        {/* Nav links */}
        <nav className="flex flex-col gap-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  'font-heading text-[clamp(28px,8vw,36px)] tracking-[2px] uppercase no-underline transition-colors',
                  isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="mt-auto pt-8 border-t border-foreground/10 flex flex-col gap-4">
          <Link
            href={isLoggedIn ? '/dashboard' : '/join'}
            onClick={closeMenu}
            className="inline-block font-heading text-[clamp(28px,8vw,36px)] tracking-[2px] uppercase text-primary no-underline"
          >
            {isLoggedIn ? 'Dashboard' : 'Join Club'}
          </Link>
          {isLoggedIn && (
            <a
              href="/api/auth/logout"
              onClick={closeMenu}
              className="text-[11px] tracking-[2px] uppercase text-muted hover:text-primary transition-colors"
            >
              Log out
            </a>
          )}
        </div>
      </div>
    </>
  );
}
