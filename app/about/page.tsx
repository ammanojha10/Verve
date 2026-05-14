'use client'

import { RevealSection } from '@/components/ui/RevealSection'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 px-6 md:px-12 bg-off">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-6">Our Mission</div>
        </RevealSection>
        <RevealSection delay={100}>
          <h1 className="font-heading text-[clamp(48px,8vw,90px)] leading-[0.92] tracking-tight text-foreground mb-8">
            Verve is for <span className="text-primary text-italic">everyone.</span>
          </h1>
        </RevealSection>
        <RevealSection delay={200}>
          <p className="text-lg md:text-xl font-light text-foreground/70 max-w-2xl leading-relaxed">
            Founded in 2026 at KIIT University, Verve was built to bridge the gap between casual jogging and competitive athletics. We believe that every km counts, and every runner has a story.
          </p>
        </RevealSection>
      </section>

      {/* The Story */}
      <section className="py-16 md:py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div>
          <RevealSection>
            <h2 className="font-heading text-[42px] md:text-[56px] leading-none tracking-tight text-foreground mb-8">The Story</h2>
          </RevealSection>
          <div className="space-y-6 text-[15px] font-light leading-relaxed text-foreground/65">
            <RevealSection delay={100}>
              <p>
                It started with a simple idea: how can we make running more interactive? Most run clubs focus either on elite athletes or social gatherings. Verve sits right in the middle—a tech-enabled community where your Strava data transforms into XP, levels, and badges.
              </p>
            </RevealSection>
            <RevealSection delay={200}>
              <p>
                We wanted to create a "Legacy of Longevity." Something that isn't just about the next race, but about the thousands of small runs in between. By gamifying the experience, we've seen runners go from 5km a month to 50km, motivated by the leaderboard and the community.
              </p>
            </RevealSection>
            <RevealSection delay={300}>
              <p>
                Today, Verve is the fastest-growing running community at KIIT, with over 100 active members logging runs daily.
              </p>
            </RevealSection>
          </div>
        </div>
        <div className="relative aspect-square bg-primary-pale overflow-hidden rounded-sm group">
          <img 
            src="/logo.png" 
            alt="Verve Culture" 
            className="absolute inset-0 w-full h-full object-contain p-20 opacity-20 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-foreground text-white">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary-light mb-12 text-center">Core Values</div>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { 
              title: 'Legacy', 
              desc: 'We run for the version of ourselves that will exist in 20 years. Every km is a deposit into your future health.' 
            },
            { 
              title: 'Accessibility', 
              desc: 'From sub-20 5K runners to those just starting their journey—Verve is built to be accessible and encouraging for all levels.' 
            },
            { 
              title: 'Consistency', 
              desc: 'We value the streak over the speed. Showing up day after day is what builds a true athlete.' 
            }
          ].map((value, i) => (
            <RevealSection key={value.title} delay={i * 100} className="text-center md:text-left">
              <h3 className="font-heading text-3xl mb-4 text-primary-light">{value.title}</h3>
              <p className="text-sm font-light leading-relaxed text-white/60">{value.desc}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center">
        <RevealSection>
          <h2 className="font-heading text-[42px] md:text-[64px] leading-tight mb-8">Ready to be part of the story?</h2>
        </RevealSection>
        <RevealSection delay={100}>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/join">Join the Club</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/leaderboard">See the Board</Link>
            </Button>
          </div>
        </RevealSection>
      </section>
    </div>
  )
}
