'use client'

import { RevealSection } from '@/components/ui/RevealSection'
import { Badge } from '@/components/ui/Badge'
import { TiltCard } from '@/components/ui/TiltCard'
import { Calendar, MapPin, Users } from 'lucide-react'

const RUN_ARCHIVE = [
  {
    id: 1,
    title: "The Sunrise Sprint",
    date: "June 12, 2024",
    location: "KIIT Campus 6",
    participants: 42,
    image: "/runs/run1.jpg", // Placeholder or reference
    status: "Past",
    type: "Club Run"
  },
  {
    id: 2,
    title: "Night Owl Relay",
    date: "July 05, 2024",
    location: "BBSR Smart City Path",
    participants: 28,
    image: "/runs/run2.jpg",
    status: "Past",
    type: "Relay"
  },
  {
    id: 3,
    title: "Monsoon Marathon",
    date: "August 15, 2024",
    location: "Patia Station Loop",
    participants: 56,
    image: "/runs/run3.jpg",
    status: "Upcoming",
    type: "Long Run"
  },
  {
    id: 4,
    title: "Independence Dash",
    date: "August 15, 2024",
    location: "Campus 3 Athletic Track",
    participants: 120,
    image: "/runs/run4.jpg",
    status: "Upcoming",
    type: "Sprint"
  }
]

export default function GalleryPage() {
  return (
    <div className="flex-1 px-6 md:px-12 py-12 md:py-20">
      <RevealSection>
        <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">The Archive</div>
      </RevealSection>
      <RevealSection delay={100}>
        <h1 className="font-heading text-[clamp(42px,5vw,72px)] leading-none tracking-tight text-foreground mb-12 border-b border-foreground/[0.08] pb-6">Gallery</h1>
      </RevealSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RUN_ARCHIVE.map((run, i) => (
          <RevealSection key={run.id} delay={i * 80}>
            <TiltCard className="glass overflow-hidden border-white/20 h-full">
              {/* Image Placeholder */}
              <div className="aspect-[16/9] bg-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center font-heading text-4xl text-primary/10 select-none">
                  VERVE RUN
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant={run.status === 'Upcoming' ? 'default' : 'outline'}>
                    {run.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-[10px] tracking-[2px] uppercase text-primary mb-2 font-bold">{run.type}</div>
                <h3 className="font-heading text-2xl mb-4 group-hover:text-primary transition-colors">{run.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{run.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{run.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Users className="h-3.5 w-3.5" />
                    <span>{run.participants} Runners</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </RevealSection>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-sm text-muted italic">Have photos from a Verve run? Tag us on Instagram @verve.runclub to be featured.</p>
      </div>
    </div>
  )
}
