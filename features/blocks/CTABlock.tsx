import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTAButton {
  label: string
  href: string
  variant?: string
  external?: boolean
}

interface CTABlockProps {
  title: string
  description?: string
  buttons?: CTAButton[]
  background?: 'default' | 'gradient' | 'card' | 'border'
  align?: 'left' | 'center' | 'right'
  lang?: string
}

const backgroundClasses = {
  default: 'bg-transparent',
  gradient: 'bg-gradient-to-r from-[#6154f0]/20 via-[#6154f0]/10 to-transparent',
  card: 'bg-[#121319] border border-white/[0.08]',
  border: 'border-t border-b border-white/[0.08]',
}

const alignClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

const buttonVariants = {
  primary: 'bg-[#6154f0] text-white hover:bg-[#5841e8]',
  secondary: 'bg-white text-[#0b0c10] hover:bg-zinc-200',
  ghost: 'text-zinc-400 hover:text-white',
}

export function CTABlock({
  title,
  description,
  buttons = [],
  background = 'gradient',
  align = 'center',
  lang = 'en',
}: CTABlockProps) {
  const localizedHref = (href: string) => {
    if (lang === 'en') return href
    if (href === '/') return `/${lang}`
    return `/${lang}${href.startsWith('/') ? href : '/' + href}`
  }

  return (
    <section className={cn('py-16 md:py-24', backgroundClasses[background])}>
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        <div className={cn('flex flex-col gap-6', alignClasses[align])}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>

          {description && (
            <p className="text-lg text-zinc-400 max-w-2xl">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {buttons.map((button, index) => (
                <Link
                  key={`${button.href}-${index}`}
                  href={localizedHref(button.href)}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-colors',
                    buttonVariants[button.variant as keyof typeof buttonVariants] || buttonVariants.primary
                  )}
                  target={button.external ? '_blank' : undefined}
                  rel={button.external ? 'noopener noreferrer' : undefined}
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