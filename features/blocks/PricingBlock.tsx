'use client'

interface PricingBlockProps {
  title?: string
  subtitle?: string
  plans?: Array<{
    name: string
    price: string
    period?: string
    description?: string
    features?: string[]
    highlighted?: boolean
    highlightLabel?: string
    buttonText?: string
    buttonHref?: string
  }>
  columns?: number
  variant?: 'cards' | 'table' | 'minimal'
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
}

export function PricingBlock({
  title,
  subtitle,
  plans = [],
  columns = 3,
  styles,
}: PricingBlockProps) {
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
    narrow: 'max-w-4xl',
    medium: 'max-w-5xl',
    wide: 'max-w-6xl',
    xwide: 'max-w-7xl',
    full: 'max-w-full',
  }[styles?.maxWidth || 'wide'] || 'max-w-6xl'

  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3'

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

        <div className={`grid grid-cols-1 ${gridColsClass} gap-8`}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl ${
                plan.highlighted
                  ? 'bg-[#6154f0] ring-2 ring-[#6154f0] ring-offset-2 ring-offset-[#0b0c10]'
                  : 'bg-[#121319] border border-white/10'
              }`}
            >
              {plan.highlighted && plan.highlightLabel && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#6154f0] text-white text-xs font-semibold rounded-full">
                  {plan.highlightLabel}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-zinc-400">{plan.description}</p>
                )}
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-zinc-400 ml-1">{plan.period}</span>
                )}
              </div>

              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <svg className="w-5 h-5 text-[#6154f0]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {plan.buttonText && (
                <a
                  href={plan.buttonHref || '#'}
                  className={`block w-full py-3 px-6 text-center font-medium rounded-lg transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-[#0b0c10] hover:bg-zinc-200'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}