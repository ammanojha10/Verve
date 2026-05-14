'use client'

import { RevealSection } from '@/components/ui/RevealSection'
import { Instagram, Heart, MessageCircle } from 'lucide-react'

const INSTA_POSTS = [
  { id: 1, likes: 124, comments: 12, img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80' },
  { id: 2, likes: 89, comments: 5, img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=80' },
  { id: 3, likes: 210, comments: 34, img: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=500&q=80' },
  { id: 4, likes: 156, comments: 18, img: 'https://images.unsplash.com/photo-1538291323976-37dcaafccb12?w=500&q=80' },
  { id: 5, likes: 92, comments: 7, img: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=500&q=80' },
  { id: 6, likes: 178, comments: 22, img: 'https://images.unsplash.com/photo-1513594335403-99d130386779?w=500&q=80' },
]

export function InstagramPreview() {
  const instaUrl = "https://www.instagram.com/verve.runclub/"

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
            <Instagram className="h-4 w-4" />
            @verve.runclub
          </a>
        </RevealSection>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {INSTA_POSTS.map((post, i) => (
          <RevealSection key={post.id} delay={i * 50}>
            <a 
              href={instaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative aspect-square block group overflow-hidden"
            >
              <img 
                src={post.img} 
                alt={`Verve Instagram Post ${post.id}`}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Heart className="h-4 w-4 fill-white" />
                  {post.likes}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MessageCircle className="h-4 w-4 fill-white" />
                  {post.comments}
                </div>
              </div>
            </a>
          </RevealSection>
        ))}
      </div>
    </section>
  )
}
