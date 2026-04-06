import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'
import type { PortableTextBlock } from '@portabletext/types'

interface ContentBlockProps {
  content: PortableTextBlock[]
  width?: 'narrow' | 'medium' | 'wide' | 'full'
  align?: 'left' | 'center'
}

const widthClasses = {
  narrow: 'max-w-prose',
  medium: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'max-w-none',
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
}

export function ContentBlock({
  content,
  width = 'narrow',
  align = 'left',
}: ContentBlockProps) {
  if (!content || content.length === 0) return null

  return (
    <section className="py-12">
      <div className={cn(
        'mx-auto px-12 lg:px-32',
        widthClasses[width],
        alignClasses[align]
      )}>
        <div className="prose prose-invert prose-zinc max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-a:text-[#6154f0] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-[#6154f0] prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#121319] prose-pre:border prose-pre:border-white/[0.08]
          prose-blockquote:border-l-[#6154f0] prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
          prose-img:rounded-xl prose-img:shadow-2xl
          prose-ul:text-zinc-300 prose-ol:text-zinc-300
        ">
          <PortableText value={content} />
        </div>
      </div>
    </section>
  )
}