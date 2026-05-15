'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import { WhatsAppSection } from '@/components/social/WhatsAppSection'
import { InstagramPreview } from '@/components/social/InstagramPreview'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { GooeyBackground } from '@/components/ui/gooey-background'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { Logo3D } from '@/components/ui/logo-3d'

export default function LandingPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="flex-1">
      {/* ── HERO SECTION ── */}
      <section className={cn("relative px-6 md:px-12 py-20 md:py-32 min-h-screen flex items-center overflow-hidden", mounted && resolvedTheme === 'dark' ? "bg-black" : "bg-transparent")}>
        {mounted && resolvedTheme === 'dark' ? (
          <ShaderAnimation className="absolute inset-0 z-0 opacity-70" />
        ) : (
          <GooeyBackground />
        )}
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="mb-12">
            <RevealSection>
              <h1 className={cn("font-heading text-[clamp(60px,12vw,140px)] leading-[0.85] tracking-tight drop-shadow-2xl", mounted && resolvedTheme === 'dark' ? "text-white" : "text-foreground")}>
                VERVE <br />
                <span className="text-primary italic drop-shadow-xl">RUN CLUB.</span>
              </h1>
            </RevealSection>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-16">
            <RevealSection delay={150}>
              <p className={cn("text-xl md:text-2xl font-light leading-relaxed max-w-lg drop-shadow-sm", mounted && resolvedTheme === 'dark' ? "text-white/80" : "text-foreground/80")}>
                A community of runners focused on consistency, progress, and local connection. We meet weekly for group runs across the city.
              </p>
            </RevealSection>
            
            <RevealSection delay={300} className="flex gap-4">
              <Button size="lg" className="rounded-full px-10 py-7 bg-primary text-white hover:bg-primary-deep shadow-lg group" asChild>
                <a href="/join">
                  Join the Club <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 py-7 border-foreground/10 hover:bg-foreground/5 transition-all" asChild>
                <a href="/about">Our Story</a>
              </Button>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-foreground text-background">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-12 text-center">Core Values</div>
        </RevealSection>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <RevealSection delay={100} className="text-center md:text-left">
            <h3 className="font-heading text-3xl mb-4 text-primary">Legacy</h3>
            <p className="text-sm font-light leading-relaxed text-background/60">We run for the version of ourselves that will exist in 20 years. Every km is a deposit into your future health.</p>
          </RevealSection>
          <RevealSection delay={200} className="text-center md:text-left">
            <h3 className="font-heading text-3xl mb-4 text-primary">Accessibility</h3>
            <p className="text-sm font-light leading-relaxed text-background/60">From sub-20 5K runners to those just starting their journey—Verve is built to be accessible and encouraging for all levels.</p>
          </RevealSection>
          <RevealSection delay={300} className="text-center md:text-left">
            <h3 className="font-heading text-3xl mb-4 text-primary">Consistency</h3>
            <p className="text-sm font-light leading-relaxed text-background/60">We value the streak over the speed. Showing up day after day is what builds a true athlete.</p>
          </RevealSection>
        </div>
      </section>

      {/* ── CLUB PILLARS ── */}
      <section className="px-6 md:px-12 py-24 bg-off border-y border-foreground/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <RevealSection delay={100}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-3xl mb-4">Weekly Schedule</h3>
            <p className="text-foreground/60 font-light leading-relaxed">
              Weekly group runs are held throughout the week, with Sunday sessions as a permanent fixture. Advanced high-intensity runs are available based on member interest.
            </p>
          </RevealSection>

          <RevealSection delay={200}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-3xl mb-4">City Hubs</h3>
            <p className="text-foreground/60 font-light leading-relaxed">
              We rotate our starting points between the city&apos;s best parks and urban trails to keep every run fresh.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-8">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-3xl mb-4">Community Focused</h3>
            <p className="text-foreground/60 font-light leading-relaxed">
              More than just running. Join us for post-run coffee, social events, and community-led workshops.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── SOCIAL & ACTION ── */}
      <WhatsAppSection />
      <InstagramPreview />

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 py-20 bg-background border-t border-foreground/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo3D className="w-8 h-8" />
              <span className="font-heading text-2xl tracking-[2px]">VERVE</span>
            </div>
            <p className="text-sm text-foreground/40 max-w-xs font-light">
              Focused on building the most inclusive and consistent running community in the region.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="text-[10px] tracking-[2px] uppercase font-bold text-primary">Platform</div>
              <div className="flex flex-col gap-2 text-sm text-foreground/60">
                <a href="/leaderboard" className="hover:text-primary transition-colors">Board</a>
                <a href="/challenges" className="hover:text-primary transition-colors">Challenges</a>
                <a href="/gallery" className="hover:text-primary transition-colors">Gallery</a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] tracking-[2px] uppercase font-bold text-primary">Legal</div>
              <div className="flex flex-col gap-2 text-sm text-foreground/60">
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-foreground/5 text-center text-[10px] tracking-[1px] text-foreground/30 uppercase">
          © 2026 VERVE RUN CLUB. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}
