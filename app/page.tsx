'use client'

import { useRef, Suspense } from 'react'
import { LiquidShaderHero } from '@/components/hero/LiquidShaderHero'
import { TiltCard } from '@/components/ui/TiltCard'
import { LiquidXPBar } from '@/components/ui/LiquidXPBar'
import { DitheringShader } from '@/components/ui/dithering-shader'
import { GlassBadge } from '@/components/ui/GlassBadge'
import { RevealSection } from '@/components/ui/RevealSection'
import { WhatsAppSection } from '@/components/social/WhatsAppSection'
import { InstagramPreview } from '@/components/social/InstagramPreview'
import { AuthErrorBanner } from '@/components/auth/AuthErrorBanner'
import { Activity, Zap, Trophy, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative bg-background">
      <Suspense fallback={null}>
        <AuthErrorBanner />
      </Suspense>

      {/* ── HERO ── */}
      <LiquidShaderHero />

      {/* ── CORE STATS (Stacked Depth) ── */}
      <section className="relative -mt-32 z-20 px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <TiltCard className="glass p-8 border-white/20">
            <RevealSection>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity className="h-6 w-6" /></div>
                <div className="text-[10px] tracking-[2px] uppercase font-bold text-muted">Global Activity</div>
              </div>
              <h3 className="font-heading text-5xl mb-6">12,482 KM</h3>
              <LiquidXPBar progress={78} label="Club Weekly Goal" />
            </RevealSection>
          </TiltCard>

          <TiltCard className="glass p-8 border-white/20">
            <RevealSection delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Zap className="h-6 w-6" /></div>
                <div className="text-[10px] tracking-[2px] uppercase font-bold text-muted">Active Runners</div>
              </div>
              <h3 className="font-heading text-5xl mb-6">1,204</h3>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-off overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">+1.2k</div>
              </div>
            </RevealSection>
          </TiltCard>

          <div className="relative h-full min-h-[200px] rounded-2xl overflow-hidden depth-25d">
            <DitheringShader 
              shape="sphere"
              colorBack="#FDFCFB"
              colorFront="#C0392B"
              pxSize={2}
              speed={2}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/10 backdrop-blur-[2px]">
              <div className="font-heading text-4xl text-foreground">NEXT RUN</div>
              <div className="text-[10px] tracking-[3px] uppercase font-bold text-primary mt-2">6:00 AM @ CUBBON</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES (Kinetic Grid) ── */}
      <section className="py-24 px-6 md:px-12 bg-off relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-0 right-0 font-heading text-[300px] text-primary/[0.03] leading-none select-none pointer-events-none translate-x-1/2">
          ELITE
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <RevealSection>
              <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">The Mechanics</div>
              <h2 className="font-heading text-[ clamp(42px,8vw,90px) ] leading-[0.9] tracking-tight">
                BUILT FOR THE <span className="italic">1%</span>.
              </h2>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Trophy />, title: "Tiers", desc: "Climb from Jogger to Elite Tiers based on performance." },
              { icon: <Activity />, title: "Live Board", desc: "Real-time leaderboard updates from Strava sync." },
              { icon: <Zap />, title: "XP System", desc: "Earn experience points for every kilometer logged." },
              { icon: <Users />, title: "Social Hub", desc: "Connect with the fastest community in the city." }
            ].map((feature, i) => (
              <RevealSection key={i} delay={i * 50}>
                <div className="bg-background p-8 border border-foreground/[0.05] hover:border-primary/20 transition-colors h-full flex flex-col group">
                  <div className="text-primary mb-6 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                  <h4 className="font-heading text-2xl mb-4 uppercase tracking-wider">{feature.title}</h4>
                  <p className="text-sm font-light text-foreground/50 leading-relaxed">{feature.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMIFIED PROGRESSION ── */}
      <section className="py-24 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <RevealSection>
              <div className="text-[11px] tracking-[3px] uppercase text-primary mb-6">Gamification</div>
              <h2 className="font-heading text-7xl mb-8">Earning Your <span className="text-primary">Legacy</span>.</h2>
              <p className="text-lg font-light text-foreground/60 mb-10 leading-relaxed max-w-xl">
                Every run is an investment in your rank. Our advanced XP algorithm weighs distance, pace, and consistency to determine your standing in the club.
              </p>
              
              <div className="space-y-8">
                <LiquidXPBar progress={45} label="Legacy Progress" />
                <LiquidXPBar progress={92} label="Consistency Modifier" color="#000" />
              </div>
            </RevealSection>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-6 relative">
            {/* Floating Badges */}
            <GlassBadge label="Early Bird" delay={0} className="w-full" />
            <GlassBadge label="Century" delay={0.5} className="mt-12 w-full" />
            <GlassBadge label="Tempo King" delay={0.2} className="-mt-8 w-full" />
            <GlassBadge label="Urban Dash" delay={0.7} className="w-full" />
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* ── SOCIAL & COMMUNITY ── */}
      <WhatsAppSection />
      <InstagramPreview />

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-foreground/[0.08]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Verve" className="h-6 w-auto invert dark:invert-0" />
          <span className="font-heading text-lg tracking-[2px] text-primary">VERVE RUN CLUB</span>
        </div>
        <p className="text-[10px] tracking-[2px] uppercase text-muted">© 2024 Verve. Built for the kinetic era.</p>
      </footer>
    </main>
  )
}
