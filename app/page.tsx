'use client'

import { WhatsAppSection } from '@/components/social/WhatsAppSection'
import { InstagramPreview } from '@/components/social/InstagramPreview'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAudio } from '@/hooks/use-audio'

export default function LandingPage() {
  const { playHover, playClick } = useAudio()

  return (
    <div className="flex-1 min-h-screen font-sans">
      
      {/* ── HERO SECTION ── */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20 px-8 md:px-16 max-w-[1400px] mx-auto">
        


        {/* Massive Typography */}
        <h1 className="font-heading font-normal tracking-[-0.06em] leading-[0.85] text-[clamp(48px,15vw,220px)] text-center mb-20 md:mb-28">
          Verve<br />
          Run Club<br />
          Network
        </h1>

        {/* The Red Banner */}
        <div className="w-full bg-[#E74431] rounded-lg relative px-8 py-14 md:px-14 md:py-20">
          {/* Corner rivets */}
          <div className="absolute top-4 left-4 w-2.5 h-2.5 bg-foreground rounded-full" />
          <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-foreground rounded-full" />
          <div className="absolute bottom-4 left-4 w-2.5 h-2.5 bg-foreground rounded-full" />
          <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-foreground rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
            {/* 1 - Legacy */}
            <div className="flex items-end gap-4">
              <span className="text-[120px] md:text-[160px] font-heading font-light leading-[0.7] tracking-tighter text-foreground">1</span>
              <span className="text-sm font-medium tracking-tight mb-3 max-w-[140px] text-foreground">Legacy &<br />Consistency</span>
            </div>

            {/* 2 - Accessibility */}
            <div className="flex items-end gap-4 md:justify-center">
              <span className="text-[120px] md:text-[160px] font-heading font-light leading-[0.7] tracking-tighter text-foreground">2</span>
              <span className="text-sm font-medium tracking-tight mb-3 max-w-[140px] text-foreground">Accessible to<br />All Levels</span>
            </div>

            {/* 3 - Community */}
            <div className="flex items-end gap-4 md:justify-end">
              <span className="text-[120px] md:text-[160px] font-heading font-light leading-[0.7] tracking-tighter text-foreground">3</span>
              <span className="text-sm font-medium tracking-tight mb-3 max-w-[140px] text-foreground">Driven by<br />Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION SECTION ── */}
      <section className="px-8 md:px-16 pb-24 md:pb-32 max-w-[1400px] mx-auto mt-8 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* Left - Large statement */}
          <div className="md:col-span-7">
            <h2 className="font-heading font-normal tracking-[-0.04em] leading-[0.95] text-[clamp(36px,5vw,72px)]">
              A community of runners focused on consistency, progress, and local connection.
            </h2>
          </div>

          {/* Right - Details */}
          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-10 pt-2">
            <p className="text-[15px] font-medium leading-relaxed">
              We run for the version of ourselves that will exist in 20 years. Every km is a deposit into your future health.
            </p>
            <p className="text-[15px] font-medium leading-relaxed">
              From sub-20 5K runners to those just starting their journey—Verve is built to be accessible and encouraging for all levels.
            </p>
            <p className="text-[15px] font-medium leading-relaxed">
              We value the streak over the speed. Showing up day after day is what builds a true athlete.
            </p>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mt-16">
          <Link
            href="/join"
            className="group inline-flex items-center gap-2 bg-foreground text-background text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-foreground/80 transition-colors"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            Join the Club <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-transparent text-foreground text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* ── CLUB PILLARS ── */}
      <section className="border-t border-foreground/10 bg-foreground/5">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-24 md:py-32">
          <div className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#E74431] mb-16">What We Offer</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Pillar 1 */}
            <div>
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-[#E74431] mb-8">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-medium tracking-tight mb-4">Weekly Schedule</h3>
              <p className="text-[15px] leading-relaxed text-foreground/60">
                Weekly group runs are held throughout the week, with Sunday sessions as a permanent fixture. Advanced high-intensity runs are available based on member interest.
              </p>
            </div>

            {/* Pillar 2 */}
            <div>
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-[#E74431] mb-8">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-medium tracking-tight mb-4">City Hubs</h3>
              <p className="text-[15px] leading-relaxed text-foreground/60">
                We rotate our starting points between the city&apos;s best parks and urban trails to keep every run fresh.
              </p>
            </div>

            {/* Pillar 3 */}
            <div>
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-[#E74431] mb-8">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-medium tracking-tight mb-4">Community Focused</h3>
              <p className="text-[15px] leading-relaxed text-foreground/60">
                More than just running. Join us for post-run coffee, social events, and community-led workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP SECTION ── */}
      <WhatsAppSection />

      {/* ── INSTAGRAM FEED ── */}
      <InstagramPreview />

      {/* ── FOOTER ── */}
      <footer className="border-t border-foreground/10 bg-background">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Left */}
            <div className="space-y-6">
              <span className="font-heading text-2xl tracking-[2px] font-bold">VERVE</span>
              <p className="text-sm text-foreground/40 max-w-xs">
                Focused on building the most inclusive and consistent running community in the region.
              </p>
            </div>

            {/* Right links */}
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <div className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#E74431]">Platform</div>
                <div className="flex flex-col gap-2 text-sm text-foreground/60">
                  <a href="/leaderboard" className="hover:text-[#E74431] transition-colors">Board</a>
                  <a href="/challenges" className="hover:text-[#E74431] transition-colors">Challenges</a>
                  <a href="/gallery" className="hover:text-[#E74431] transition-colors">Gallery</a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#E74431]">Legal</div>
                <div className="flex flex-col gap-2 text-sm text-foreground/60">
                  <a href="/privacy" className="hover:text-[#E74431] transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-[#E74431] transition-colors">Terms</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-foreground/10 text-center flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-foreground/40 text-xs font-medium">
              Powered by 
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-[#FC4C02]"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>
            </div>
            <div className="text-[10px] tracking-[1px] text-foreground/30 uppercase">
              © 2026 VERVE RUN CLUB. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
