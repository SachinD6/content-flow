'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionBlockProps {
  title?: string
  subtitle?: string
  items?: Array<{
    question: string
    answer: string
    initiallyOpen?: boolean
  }>
  allowMultiple?: boolean
  iconPosition?: 'right' | 'left'
  variant?: 'default' | 'minimal' | 'card' | 'filled'
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
}

export function AccordionBlock({
  title,
  subtitle,
  items = [],
  allowMultiple = true,
  iconPosition = 'right',
  variant = 'default',
  styles,
}: AccordionBlockProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(items.filter(item => item.initiallyOpen).map((_, i) => i))
  )

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => {
        const newSet = new Set(prev)
        if (newSet.has(index)) {
          newSet.delete(index)
        } else {
          newSet.add(index)
        }
        return newSet
      })
    } else {
      setOpenItems(prev => (prev.has(index) ? new Set() : new Set([index])))
    }
  }

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
    narrow: 'max-w-2xl',
    medium: 'max-w-3xl',
    wide: 'max-w-4xl',
    xwide: 'max-w-5xl',
    full: 'max-w-full',
  }[styles?.maxWidth || 'medium'] || 'max-w-3xl'

  const variantStyles = {
    default: 'border border-white/10 bg-[#121319]',
    minimal: 'border-b border-white/5 last:border-b-0',
    card: 'bg-[#121319] rounded-lg',
    filled: 'bg-white/5 rounded-lg',
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-6 ${maxWidthClass}`}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-zinc-400">{subtitle}</p>}
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.has(index)
            return (
              <div
                key={index}
                className={variantStyles[variant]}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    {iconPosition === 'left' && (
                      <ChevronDown
                        className={`h-5 w-5 text-[#6154f0] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                    <span className="font-medium text-white pr-8">{item.question}</span>
                  </div>
                  {iconPosition === 'right' && (
                    <ChevronDown
                      className={`h-5 w-5 text-[#6154f0] transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-zinc-400 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}