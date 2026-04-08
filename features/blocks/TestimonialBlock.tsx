import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Testimonial {
  quote: string
  author: string
  role?: string
  avatar?: string
  rating?: number
}

interface TestimonialBlockProps {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'carousel' | 'featured' | 'stacked'
  testimonials?: Testimonial[]
}

const layoutClasses = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  carousel: 'flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide',
  featured: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  stacked: 'flex flex-col gap-6',
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            'h-4 w-4',
            star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial
  featured?: boolean
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-[#121319] border border-white/[0.08]',
        featured && 'lg:p-8'
      )}
    >
      <StarRating rating={testimonial.rating} />

      <blockquote className={cn('text-white mb-4', featured ? 'text-lg' : 'text-base')}>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3">
        {testimonial.avatar && (
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={testimonial.avatar}
              alt={testimonial.author || 'Testimonial author'}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div>
          <div className="font-medium text-white">{testimonial.author}</div>
          {testimonial.role && (
            <div className="text-sm text-zinc-500">{testimonial.role}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TestimonialBlock({
  title,
  subtitle,
  layout = 'grid',
  testimonials = [],
}: TestimonialBlockProps) {
  const safeTestimonials = testimonials ?? []

  if (safeTestimonials.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn(layoutClasses[layout])}>
          {safeTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              featured={layout === 'featured' && index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
