'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoBlockProps {
  videoType?: 'youtube' | 'vimeo' | 'url'
  youtubeUrl?: string
  vimeoUrl?: string
  videoUrl?: string
  title?: string
  description?: string
  aspectRatio?: '16:9' | '4:3' | '21:9' | '1:1' | '9:16'
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  showControls?: boolean
  thumbnail?: string
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
    borderRadius?: string
    shadow?: string
  }
}

export function VideoBlock({
  videoType = 'youtube',
  youtubeUrl,
  vimeoUrl,
  videoUrl,
  title,
  description,
  aspectRatio = '16:9',
  autoplay = false,
  loop = false,
  muted = false,
  showControls = true,
  thumbnail,
  styles,
}: VideoBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const getPaddingClass = (padding?: string) => {
    const classes: Record<string, string> = {
      none: '',
      xs: 'py-4',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
      '2xl': 'py-32',
    }
    return classes[padding || 'md'] || 'py-12'
  }

  const maxWidthClass = {
    narrow: 'max-w-3xl',
    medium: 'max-w-4xl',
    wide: 'max-w-5xl',
    xwide: 'max-w-6xl',
    full: 'max-w-full',
  }[styles?.maxWidth || 'wide'] || 'max-w-5xl'

  const borderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-2xl',
  }[styles?.borderRadius || 'xl'] || 'rounded-xl'

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }[styles?.shadow || 'lg'] || 'shadow-lg'

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '21:9': 'aspect-[21/9]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  }[aspectRatio] || 'aspect-video'

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  const renderVideo = () => {
    if (videoType === 'youtube' && youtubeUrl) {
      const videoId = getYouTubeId(youtubeUrl)
      if (!videoId) return null

      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        controls: showControls ? '1' : '0',
        playsinline: '1',
      })

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?${params}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    if (videoType === 'vimeo' && vimeoUrl) {
      const videoId = getVimeoId(vimeoUrl)
      if (!videoId) return null

      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        controls: showControls ? '1' : '0',
      })

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?${params}`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }

    if (videoType === 'url' && videoUrl) {
      return (
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={showControls}
          playsInline
        />
      )
    }

    return null
  }

  const showPlayButton = !autoplay && !isPlaying

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-6 ${maxWidthClass}`}>
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && <h3 className="text-xl font-medium text-white mb-2">{title}</h3>}
            {description && <p className="text-zinc-400">{description}</p>}
          </div>
        )}
        
        <div className={`relative overflow-hidden ${borderRadiusClass} ${shadowClass} bg-[#0a0b0e]`}>
          {showPlayButton && thumbnail && !isPlaying ? (
            <div 
              className={`relative ${aspectRatioClass} cursor-pointer group`}
              onClick={() => setIsPlaying(true)}
            >
              <Image
                src={thumbnail}
                alt={title || 'Video thumbnail'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-[#0b0c10] ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : (
            <div className={`relative ${aspectRatioClass} bg-black`}>
              {renderVideo()}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}