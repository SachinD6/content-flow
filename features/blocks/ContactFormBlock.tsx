'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

interface ContactFormBlockProps {
  title?: string
  description?: string
  fields?: Array<{
    name: string
    label?: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
    placeholder?: string
    required?: boolean
    options?: string[]
  }>
  submitButton?: string
  successMessage?: string
  layout?: 'stacked' | 'twocolumn'
  variant?: 'default' | 'card' | 'minimal'
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
}

export function ContactFormBlock({
  title,
  description,
  fields = [],
  submitButton = 'Send Message',
  successMessage = 'Thank you! Your message has been sent.',
  layout = 'stacked',
  variant = 'default',
  styles,
}: ContactFormBlockProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({})
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
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
    narrow: 'max-w-xl',
    medium: 'max-w-2xl',
    wide: 'max-w-3xl',
    xwide: 'max-w-4xl',
    full: 'max-w-full',
  }[styles?.maxWidth || 'medium'] || 'max-w-2xl'

  const containerStyles = {
    default: '',
    card: 'bg-[#121319] border border-white/10 rounded-2xl p-8',
    minimal: '',
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  if (isSuccess) {
    return (
      <section 
        className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
        style={bgStyle}
      >
        <div className={`mx-auto px-6 ${maxWidthClass}`}>
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-white">{successMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-6 ${maxWidthClass}`}>
        <div className={containerStyles[variant]}>
          {(title || description) && (
            <div className="text-center mb-8">
              {title && <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>}
              {description && <p className="text-lg text-zinc-400">{description}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {layout === 'twocolumn' ? (
              <div className="grid md:grid-cols-2 gap-6">
                {fields?.filter((_, i) => i < 2).map((field) => (
                  <div key={field.name}>
                    {field.label && (
                      <label className="block text-sm font-medium text-white mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#6154f0] focus:outline-none transition-colors"
                        rows={4}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#6154f0] focus:outline-none transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            {layout === 'stacked' ? (
              fields?.map((field) => (
                <div key={field.name}>
                  {field.label && (
                    <label className="block text-sm font-medium text-white mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded-lg text-white focus:border-[#6154f0] focus:outline-none transition-colors"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#6154f0] focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.name}
                        required={field.required}
                        checked={formData[field.name] === 'true'}
                        onChange={(e) => handleChange(field.name, e.target.checked ? 'true' : '')}
                        className="w-5 h-5 rounded border-white/10 text-[#6154f0] focus:ring-[#6154f0]"
                      />
                      <span className="text-zinc-400">{field.placeholder}</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#6154f0] focus:outline-none transition-colors"
                    />
                  )}
                </div>
              ))
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#6154f0] text-white font-medium rounded-lg hover:bg-[#5841e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {submitButton}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}