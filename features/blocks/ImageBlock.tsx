import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageBlockProps {
  image: string
  alt?: string
  caption?: string
  width?: 'narrow' | 'medium' | 'wide' | 'full'
  rounded?: boolean
  shadow?: boolean
}

const widthClasses = {
  narrow: 'max-w-2xl',
  medium: 'max-w-4xl',
  wide: 'max-w-5xl',
  full: 'max-w-none',
}

export function ImageBlock({
  image,
  alt = '',
  caption,
  width = 'medium',
  rounded = true,
  shadow = true,
}: ImageBlockProps) {
  if (!image) return null

  return (
    <section className="py-8">
      <figure className={cn('mx-auto', widthClasses[width])}>
        <div
          className={cn(
            'relative overflow-hidden',
            rounded && 'rounded-2xl',
            shadow && 'shadow-2xl'
          )}
        >
          <Image
            src={image}
            alt={alt}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>

        {caption && (
          <figcaption className="mt-4 text-center text-sm text-zinc-500">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  )
}