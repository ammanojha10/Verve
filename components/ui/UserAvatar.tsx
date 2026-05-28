'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    <Image 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
      width={40}
      height={40}
    />
  )
}
