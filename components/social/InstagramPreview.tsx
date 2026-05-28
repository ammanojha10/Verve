'use client'

import { RevealSection } from '@/components/ui/RevealSection'
import { Camera } from 'lucide-react'
import { useEffect } from 'react'

// REPLACE THESE URLs with the actual post URLs from @verve.runclub
const INSTAGRAM_POSTS = [
  'https://www.instagram.com/reel/DWlIvoTEUIU/embed',
  'https://www.instagram.com/p/DWVxJ1tEcuc/embed',
  'https://www.instagram.com/p/DWBA6kDEXbB/embed',
  'https://www.instagram.com/reel/DWLeQajEX97/embed',
  'https://www.instagram.com/p/DWI7p4TEWQX/embed',
  'https://www.instagram.com/p/DVTMtZkk3YO/embed',
]

export function InstagramPreview() {
  const instaUrl = "https://www.instagram.com/verve.runclub/"

  useEffect(() => {
    // No script needed for iframes
  }, [])

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-off">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <RevealSection>
          <div className="text-[11px] tracking-[3px] uppercase text-primary mb-4">Social Feed</div>
          <h2 className="font-heading text-[42px] md:text-[56px] leading-none tracking-tight text-foreground">Follow the movement.</h2>
        </RevealSection>
        <RevealSection delay={100}>
          <a 
            href={instaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors pb-1 border-b border-foreground/10"
          >
            <Camera className="h-4 w-4" />
            @verve.runclub
          </a>
        </RevealSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {INSTAGRAM_POSTS.map((url, i) => (
          <RevealSection key={i} delay={i * 100}>
            <div className="w-full flex justify-center bg-white rounded-md overflow-hidden border border-foreground/5 shadow-sm">
              <iframe 
                src={url}
                className="w-full h-[500px]"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
              ></iframe>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  )
}
