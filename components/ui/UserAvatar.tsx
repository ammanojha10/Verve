'use client'

import { useState } from 'react'

interface UserAvatarProps {
  src?: string | null
  alt: string
  className?: string
  fallbackSrc?: string
}

export function UserAvatar({ 
  src, 
  alt, 
  className = "w-full h-full object-cover", 
  fallbackSrc = "/logo.png" 
}: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}
