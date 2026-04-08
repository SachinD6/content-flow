import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTAButton {
  label: string
  href: string
  variant?: string
  external?: boolean
  target?: '_self' | '_blank'
  requiresAuth?: boolean
}

interface HeroBlockProps {
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  backgroundColor?: string
  backgroundType?: 'gradient' | 'image' | 'video' | 'solid'
  buttons?: CTAButton[]
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
  lang?: string
}

const sizeClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  full: 'min-h-[80vh] py-16',
}

const alignClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

const buttonVariants = {
  primary: 'bg-[#6154f0] text-white hover:bg-[#5841e8]',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
  ghost: 'text-zinc-400 hover:text-white',
  link: 'text-[#6154f0] hover:text-[#6154e8] underline-offset-4 hover:underline',
}

export function HeroBlock({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundColor,
  backgroundType = 'gradient',
  buttons = [],
  align = 'center',
  size = 'lg',
  lang = 'en',
}: HeroBlockProps) {
  const safeButtons = buttons ?? []

  const localizedHref = (href: string) => {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return href
    }
    if (lang === 'en') return href
    if (href === '/') return `/${lang}`
    return `/${lang}${href.startsWith('/') ? href : '/' + href}`
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        sizeClasses[size],
        alignClasses[align]
      )}
    >
      {backgroundType === 'image' && backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c10] via-transparent to-[#0b0c10]" />
        </div>
      )}

      {backgroundType === 'solid' && backgroundColor && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor }}
        />
      )}

      {backgroundType === 'gradient' && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#6154f0]/10 via-transparent to-[#0b0c10]" />
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-12 lg:px-32">
        <div className={cn('flex flex-col gap-6', alignClasses[align])}>
          {subtitle && (
            <span className="text-sm font-medium text-[#6154f0] uppercase tracking-wider">
              {subtitle}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
              {description}
            </p>
          )}

          {safeButtons.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {safeButtons.map((button, index) => (
                <Link
                  key={`${button.href}-${index}`}
                  href={localizedHref(button.href)}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-colors',
                    buttonVariants[button.variant as keyof typeof buttonVariants] || buttonVariants.primary
                  )}
                  target={button.target === '_blank' || button.external ? '_blank' : undefined}
                  rel={button.target === '_blank' || button.external ? 'noopener noreferrer' : undefined}
                >
                  {button.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
