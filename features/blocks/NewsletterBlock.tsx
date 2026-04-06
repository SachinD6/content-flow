'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterBlockProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  successMessage?: string
  style?: 'simple' | 'card' | 'fullWidth'
  showIcon?: boolean
}

const styleClasses = {
  simple: 'py-12',
  card: 'py-16 bg-[#121319] border border-white/[0.08] rounded-2xl',
  fullWidth: 'py-16 bg-gradient-to-r from-[#6154f0]/20 via-[#6154f0]/10 to-[#6154f0]/20',
}

export function NewsletterBlock({
  title = 'Stay in the loop',
  description = 'Get the latest articles and updates delivered to your inbox.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  style = 'simple',
  showIcon = false,
}: NewsletterBlockProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // TODO: Implement newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
    setEmail('')
  }

  if (isSuccess) {
    return (
      <section className={cn(styleClasses[style], 'mx-auto max-w-6xl px-12 lg:px-32')}>
        <div className="flex items-center gap-3 text-[#6154f0]">
          <Check className="h-5 w-5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(styleClasses[style], 'mx-auto max-w-6xl px-12 lg:px-32')}>
      <div className="text-center max-w-md mx-auto">
        {showIcon && (
          <div className="mx-auto mb-6 h-12 w-12 rounded-full bg-[#6154f0]/20 flex items-center justify-center">
            <Mail className="h-6 w-6 text-[#6154f0]" />
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-3">
          {title}
        </h3>

        <p className="text-zinc-400 mb-6">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className="flex-1 px-4 py-3 bg-[#0b0c10] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6154f0]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#6154f0] text-white text-sm font-medium rounded-lg hover:bg-[#5841e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : buttonText}
          </button>
        </form>
      </div>
    </section>
  )
}