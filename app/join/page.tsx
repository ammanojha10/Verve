'use client'

import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import { WhatsAppSection } from '@/components/social/WhatsAppSection'
import { InstagramPreview } from '@/components/social/InstagramPreview'
import { CheckCircle2, Activity } from 'lucide-react'

export default function JoinPage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 px-6 md:px-12 text-center">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-6">Join the Movement</div>
        </RevealSection>
        <RevealSection delay={100}>
          <h1 className="font-heading text-[clamp(48px,8vw,90px)] leading-[0.92] tracking-tight text-foreground mb-8">
            Become a <span className="text-primary italic">Verve</span> Runner.
          </h1>
        </RevealSection>
        <RevealSection delay={200}>
          <p className="text-lg font-light text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Joining Verve is more than just joining a run club. It&apos;s about community, consistency, and competing for the legacy you want to leave behind.
          </p>
        </RevealSection>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-off border-y border-foreground/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              step: '01', 
              title: 'Join WhatsApp', 
              desc: 'This is our hub for communications, group run alerts, and community chats.' 
            },
            { 
              step: '02', 
              title: 'Connect Strava', 
              desc: 'Link your account to auto-sync your runs, earn XP, and climb the leaderboard.' 
            },
            { 
              step: '03', 
              title: 'Start Running', 
              desc: 'Join the next group run or log a solo session to start your journey to elite tiers.' 
            }
          ].map((item, i) => (
            <RevealSection key={item.step} delay={i * 100} className="relative">
              <div className="font-heading text-[120px] text-primary/5 absolute -top-16 -left-4 select-none">{item.step}</div>
              <div className="relative z-10">
                <h3 className="font-heading text-3xl mb-4 text-foreground flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Components */}
      <WhatsAppSection />
      
      <section className="py-20 md:py-32 px-6 md:px-12 text-center bg-background">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-6">Step 2: Connect</div>
          <h2 className="font-heading text-[42px] md:text-[56px] leading-tight mb-8">Ready to sync?</h2>
        </RevealSection>
        <RevealSection delay={100}>
          <p className="text-foreground/60 mb-12 max-w-lg mx-auto font-light leading-relaxed">
            Once connected, your Strava activities will automatically appear in your Verve dashboard. No manual logging required.
          </p>
        </RevealSection>
        <RevealSection delay={200}>
          <Button size="lg" className="bg-[#FC4C02] text-white hover:bg-[#E34402] border-none px-12" asChild>
            <a href="/api/auth/strava" className="flex items-center gap-3">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>
              Connect with Strava
            </a>
          </Button>
        </RevealSection>

      </section>

      <InstagramPreview />
    </div>
  )
}
