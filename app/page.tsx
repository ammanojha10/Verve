'use client'

import { useRef, Suspense } from 'react'
import { motion } from 'motion/react'
import { LiquidShaderHero } from '@/components/hero/LiquidShaderHero'
import { DitheringShader } from '@/components/ui/dithering-shader'
import { TiltCard } from '@/components/ui/TiltCard'
import { GlassBadge } from '@/components/ui/GlassBadge'
import { LiquidXPBar } from '@/components/ui/LiquidXPBar'
import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import { WhatsAppSection } from '@/components/social/WhatsAppSection'
import { InstagramPreview } from '@/components/social/InstagramPreview'
import { AuthErrorBanner } from '@/components/auth/AuthErrorBanner'
import { Trophy, Zap, Users, Globe, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* ── ERROR BANNER ── */}
      <Suspense fallback={null}>
        <AuthErrorBanner />
      </Suspense>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <LiquidShaderHero />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <RevealSection>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] tracking-[4px] uppercase text-primary mb-8 font-bold px-4 py-2 glass inline-block rounded-full shadow-sm"
            >
              The Next Evolution of Running
            </motion.div>
          </RevealSection>
          
          <RevealSection delay={150}>
            <h1 className="font-heading text-[clamp(64px,15vw,180px)] leading-[0.8] tracking-tight text-foreground mb-12 mix-blend-multiply dark:mix-blend-normal">
              RUN THE <br />
              <span className="liquid-text italic">VERVE.</span>
            </h1>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button size="lg" className="rounded-full px-12 py-8 text-lg bg-primary text-white shadow-2-5d group" asChild>
                <a href="/join">
                  Join Movement <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-12 py-8 text-lg glass text-foreground border-foreground/10 hover:bg-foreground/5 transition-all">
                <a href="/leaderboard">Explore Board</a>
              </Button>
            </div>
          </RevealSection>
        </div>

        {/* Decorative Dithering Sphere */}
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] opacity-20 pointer-events-none">
          <DitheringShader shape="sphere" colorFront="#C0392B" pxSize={4} speed={0.5} />
        </div>
      </section>

      {/* ── 2.5D STATS STACK ── */}
      <section className="relative py-20 md:py-40 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <RevealSection>
                <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4 font-bold">Live Ecosystem</div>
                <h2 className="font-heading text-[64px] md:text-[90px] leading-[0.9] tracking-tight">Gamified <br />Performance.</h2>
                <p className="text-lg text-foreground/60 max-w-md font-light leading-relaxed mt-8">
                  Verve isn&apos;t just a club; it&apos;s a digital-physical hybrid. Every step you take is tracked, analyzed, and rewarded through our 2.5D tier system.
                </p>
              </RevealSection>
              
              <div className="grid grid-cols-2 gap-6">
                <GlassBadge icon={<Zap />} label="XP SYNC" delay={100} />
                <GlassBadge icon={<Trophy />} label="ELITE TIERS" delay={200} />
                <GlassBadge icon={<Users />} label="SQUADS" delay={300} />
                <GlassBadge icon={<Globe />} label="GLOBAL" delay={400} />
              </div>
            </div>

            <div className="relative">
              <TiltCard className="p-12 aspect-square flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                   <DitheringShader shape="plane" colorFront="#C0392B" pxSize={8} />
                </div>
                
                <div className="relative z-10">
                  <div className="text-[10px] tracking-[4px] uppercase text-primary font-bold mb-2">Active Challenge</div>
                  <h3 className="font-heading text-5xl mb-8">The Red Dash</h3>
                  <LiquidXPBar progress={74} label="Personal Progress" className="mb-8" />
                  <div className="flex gap-4">
                    <div className="glass p-4 rounded-xl flex-1 text-center">
                      <div className="text-2xl font-heading text-primary">12.4K</div>
                      <div className="text-[8px] tracking-[1px] uppercase text-muted">Steps Today</div>
                    </div>
                    <div className="glass p-4 rounded-xl flex-1 text-center">
                      <div className="text-2xl font-heading text-primary">820</div>
                      <div className="text-[8px] tracking-[1px] uppercase text-muted">XP Earned</div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-foreground/10 flex items-center justify-between">
                   <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-foreground/10 flex items-center justify-center text-[10px] font-bold">
                         {String.fromCharCode(64 + i)}
                       </div>
                     ))}
                   </div>
                   <div className="text-[10px] tracking-[1px] uppercase text-muted font-medium">+142 others running</div>
                </div>
              </TiltCard>
              
              {/* Floating 2.5D element */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-2xl shadow-2-5d z-30"
              >
                 <Trophy className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL WALL ── */}
      <section className="relative z-20">
        <WhatsAppSection />
        <InstagramPreview />
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-20 px-6 md:px-12 py-20 flex flex-col items-center justify-center gap-12 bg-off/50 backdrop-blur-sm border-t border-foreground/5">
        <div className="flex flex-col items-center gap-6">
          <img src="/logo.png" alt="Verve" className="h-12 w-auto invert" />
          <div className="font-heading text-4xl tracking-[8px] text-primary">VERVE</div>
        </div>
        
        <div className="flex gap-8 text-[11px] tracking-[2px] uppercase font-bold">
          <a href="/about" className="hover:text-primary transition-colors">About</a>
          <a href="/gallery" className="hover:text-primary transition-colors">Gallery</a>
          <a href="/join" className="hover:text-primary transition-colors">Join</a>
          <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
        </div>
        
        <div className="text-[10px] text-muted tracking-widest uppercase">
          © 2026 VERVE RUN CLUB. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </main>
  )
}
