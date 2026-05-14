'use client'

import { Button } from '@/components/ui/Button'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { RevealSection } from '@/components/ui/RevealSection'

export function WhatsAppSection() {
  const whatsappLink = "https://chat.whatsapp.com/HaZS9FNRkvp6vwc2pfwvMg?mode=gi_t"

  return (
    <section className="bg-primary text-white py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background text decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[180px] text-white/[0.05] tracking-tight whitespace-nowrap select-none pointer-events-none">
        WHATSAPP
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <RevealSection>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-[11px] tracking-[3px] uppercase text-white/80">Step 1: Join the Hub</span>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <h2 className="font-heading text-[42px] md:text-[56px] leading-tight mb-6">Join the Community</h2>
          </RevealSection>
          <RevealSection delay={200}>
            <p className="text-white/70 text-lg font-light mb-8 max-w-lg">
              Our WhatsApp group is the heart of Verve. Get real-time updates on group runs, challenge announcements, and connect with fellow runners instantly.
            </p>
          </RevealSection>
          <RevealSection delay={300}>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 group" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </RevealSection>
        </div>
        
        <div className="w-full md:w-auto flex justify-center">
          <RevealSection delay={400}>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm max-w-[320px]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-heading text-xl">V</div>
                <div>
                  <div className="font-medium">Verve Run Club Hub</div>
                  <div className="text-xs text-white/50">142 members · 18 online</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-lg text-xs text-white/70">
                  <strong>Arjun:</strong> Next group run at 6 AM tomorrow! 🏃‍♂️
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-xs text-white/70">
                  <strong>Sneha:</strong> Just hit my 100km goal for June! 🎖️
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-xs text-white/70">
                  <strong>Priya:</strong> Anyone up for a sunset dash today?
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}
