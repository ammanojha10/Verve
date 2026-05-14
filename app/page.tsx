import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Marquee } from '@/components/ui/Marquee'
import { StatCounter } from '@/components/ui/StatCounter'
import { RevealSection } from '@/components/ui/RevealSection'
import { HeroParallax } from '@/components/ui/HeroParallax'

export default function LandingPage() {
  return (
    <div className="flex-1 -mt-[86px]">

      {/* ── HERO ── */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        {/* Left */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-20 md:py-32 relative z-10">
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            KIIT Run Club · Est. 2026 · BBSR
          </div>
          <h1 className="font-heading text-[clamp(72px,8vw,130px)] leading-[0.92] tracking-tight text-foreground opacity-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Run.<br />
            <span className="text-primary">Earn.</span><br />
            Dominate.
          </h1>
          <p className="text-[15px] font-light leading-relaxed text-foreground/55 max-w-[360px] mt-7 opacity-0 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            Track every km with Strava, earn XP, climb the leaderboard, and chase badges with your crew.
          </p>
          <div className="mt-6 text-sm text-foreground/70 border-l-2 border-primary pl-4 opacity-0 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <p className="font-medium">Free Running Community 100+ Active Runners</p>
            <p>Open to All</p>
            <p className="italic mt-1">Verve for all. All for Verve.</p>
          </div>
          <div className="flex gap-4 mt-11 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <Button asChild>
              <a href="/api/auth/strava">Connect Strava</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>

        {/* Right — Gradient panel */}
        <div className="relative overflow-hidden hidden md:block">
          <HeroParallax />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[220px] text-white/[0.08] tracking-[-8px] whitespace-nowrap select-none pointer-events-none">
            KM
          </div>
          <div className="absolute bottom-[60px] left-10 flex flex-col gap-5 opacity-0 animate-fade-up" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col">
              <span className="font-heading text-5xl text-white leading-none">
                <StatCounter id="counter-members" target={142} suffix="+" delay={1000} />
              </span>
              <span className="text-[11px] tracking-[2px] uppercase text-white/60 mt-0.5">Active members</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-5xl text-white leading-none">
                <StatCounter id="counter-km" target={3840} suffix=" km" delay={1200} />
              </span>
              <span className="text-[11px] tracking-[2px] uppercase text-white/60 mt-0.5">KM logged this month</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-5xl text-white leading-none">
                <StatCounter id="counter-badges" target={291} delay={1400} />
              </span>
              <span className="text-[11px] tracking-[2px] uppercase text-white/60 mt-0.5">Badges awarded</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── LEADERBOARD ── */}
      <section className="py-16 md:py-24 px-6 md:px-12" id="leaderboard">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Monthly standings</div>
        </RevealSection>
        <RevealSection delay={80}>
          <h2 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground mb-8 md:mb-13">Leaderboard</h2>
        </RevealSection>
        <RevealSection delay={160}>
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[600px] max-w-[780px]">
            {/* Header */}
            <div className="grid grid-cols-[48px_1fr_120px_120px_100px] pb-3 border-b border-foreground/[0.08] text-[10px] tracking-[2px] uppercase text-muted mb-1">
              <span>#</span><span>Runner</span><span>KM</span><span>Best pace</span><span>Badge</span>
            </div>
            {/* Rows */}
            {[
              { rank: '01', initials: 'AR', name: 'Arjun R.', tier: 'Strider · Lv 9', km: '87.4 km', pace: '4:42 /km', badge: '🔥 On fire', top: true, gold: true },
              { rank: '02', initials: 'PS', name: 'Priya S.', tier: 'Pacer · Lv 7', km: '74.1 km', pace: '5:08 /km', badge: '⭐ PR week', top: true, gold: false },
              { rank: '03', initials: 'MK', name: 'Milan K.', tier: 'Pacer · Lv 6', km: '61.8 km', pace: '5:21 /km', badge: '⛰️ Hill king', top: true, gold: false },
              { rank: '04', initials: 'SN', name: 'Sneha N.', tier: 'Jogger · Lv 3', km: '44.5 km', pace: '5:55 /km', badge: '📅 Streak', top: false, gold: false },
              { rank: '05', initials: 'RM', name: 'Rohan M.', tier: 'Jogger · Lv 2', km: '28.3 km', pace: '6:30 /km', badge: '🌅 Early bird', top: false, gold: false },
            ].map((r) => (
              <div key={r.rank} className="group grid grid-cols-[48px_1fr_120px_120px_100px] items-center py-[18px] border-b border-foreground/[0.05] relative">
                <div className="absolute -left-12 -right-12 top-0 bottom-0 bg-primary-pale opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                <span className={`font-heading text-[22px] relative z-10 ${r.top ? 'text-primary' : 'text-muted'}`}>{r.rank}</span>
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${r.gold ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-primary-pale text-primary-deep'}`}>
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-[15px]">{r.name}</div>
                    <div className="text-[10px] tracking-[1.5px] uppercase text-muted mt-0.5">{r.tier}</div>
                  </div>
                </div>
                <span className="text-[15px] font-light relative z-10">{r.km}</span>
                <span className="text-[15px] font-light relative z-10">{r.pace}</span>
                <span className="text-[10px] tracking-[1.5px] uppercase px-2.5 py-1 border border-primary-pale text-primary bg-primary-pale inline-block relative z-10">{r.badge}</span>
              </div>
            ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-off" id="features">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">What you get</div>
        </RevealSection>
        <RevealSection delay={80}>
          <h2 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground mb-0">Built for<br />runners.</h2>
        </RevealSection>
        <RevealSection delay={160}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/[0.08] border border-foreground/[0.08] mt-13">
            {[
              { icon: '⚡', title: 'XP & Levels', desc: 'Earn XP every km. Unlock tiers from Jogger to Ultrarunner. Group runs give 2× bonus.' },
              { icon: '🏅', title: 'Secret Badges', desc: 'Hidden until earned. Rain Runner, Night Owl, Sub-25 5K — discover what\'s waiting.' },
              { icon: '⚔️', title: 'Head-to-Head', desc: 'Challenge any member to a weekly distance duel. Winner earns bragging rights and a badge.' },
              { icon: '📡', title: 'Strava Sync', desc: 'Connect once. Every run auto-syncs via webhook — no manual logging, ever.' },
              { icon: '👑', title: 'Segment Crown', desc: 'Hold the club record on a local stretch. Wear a crown badge until someone beats you.' },
              { icon: '📊', title: 'Monthly Wrapped', desc: 'Spotify-style stats card every month. Total km, top badge, favourite run time. Share-ready.' },
            ].map((f) => (
              <div key={f.title} className="bg-background p-11 hover:bg-off transition-colors duration-200">
                <span className="text-[28px] mb-5 block">{f.icon}</span>
                <div className="font-heading text-[28px] tracking-wide text-foreground mb-3 leading-none">{f.title}</div>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── CHALLENGES ── */}
      <section className="bg-foreground py-16 md:py-20 px-6 md:px-12" id="challenges">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary-light mb-4">Active now</div>
        </RevealSection>
        <RevealSection delay={80}>
          <h2 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-white mb-13">Challenges</h2>
        </RevealSection>

        {[
          { name: 'Club 500km — June', sub: 'Team · 18 days left · 34 runners', pct: 64 },
          { name: 'Mumbai → Pune Virtual Run', sub: 'Club journey · 148km remaining', pct: 81 },
          { name: 'Rise & Run streak', sub: 'Personal · Run before 7am, 7 days', pct: 57 },
        ].map((ch, i) => (
          <RevealSection key={ch.name} delay={160 + i * 80}>
            <div className="flex items-center gap-9 bg-white/[0.04] border border-white/[0.08] p-8 mb-4 hover:bg-white/[0.07] transition-colors duration-200">
              <div className="flex-1">
                <div className="text-base text-white">{ch.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{ch.sub}</div>
              </div>
              <div className="flex-[2] h-1 bg-white/[0.08] rounded-sm overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-sm" style={{ width: `${ch.pct}%` }} />
              </div>
              <div className="font-heading text-[28px] text-primary-light min-w-[60px] text-right">{ch.pct}%</div>
            </div>
          </RevealSection>
        ))}
      </section>

      {/* ── JOIN ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[auto] md:min-h-[420px]" id="join">
        <div className="bg-gradient-to-br from-primary to-primary-deep p-10 md:p-20 flex flex-col justify-center">
          <h2 className="font-heading text-[52px] md:text-[64px] text-white leading-[0.95] tracking-tight mb-6">Ready<br />to run?</h2>
          <p className="text-sm font-light text-white/65 leading-relaxed max-w-[300px]">
            Connect your Strava and start earning XP from your very next run. Free to join.
          </p>
        </div>
        <div className="bg-off p-10 md:p-20 flex flex-col justify-center gap-4">
          <input className="bg-background border border-foreground/[0.12] px-[18px] py-3.5 text-sm text-foreground outline-none focus:border-primary transition-colors duration-200 placeholder:text-muted" type="text" placeholder="Your name" />
          <input className="bg-background border border-foreground/[0.12] px-[18px] py-3.5 text-sm text-foreground outline-none focus:border-primary transition-colors duration-200 placeholder:text-muted" type="email" placeholder="Email address" />
          <Button className="mt-2" asChild>
            <a href="/api/auth/strava">Connect with Strava →</a>
          </Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-foreground/[0.08]">
        <div className="flex items-center gap-6">
          <img src="/logo.png" alt="Verve Run Club" className="h-8 w-auto invert dark:invert-0" />
          <a href="https://www.instagram.com/verve.runclub/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary transition-colors">
            Instagram
          </a>
        </div>
        <div className="text-xs text-muted tracking-wide text-center md:text-right">© 2026 Verve Run Club · KIIT, Odisha · BBSR</div>
      </footer>
    </div>
  )
}
