'use client'

interface GridBlockProps {
  columns?: number
  columnsMobile?: number
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  equalHeight?: boolean
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
  children?: React.ReactNode
}

export function GridBlock({
  columns = 2,
  gap = 'md',
  alignItems = 'stretch',
  equalHeight = true,
  styles,
}: GridBlockProps) {
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

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }[gap] || 'gap-6'

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[alignItems] || 'items-stretch'

  const gridColsClass = columns === 1 
    ? 'grid-cols-1'
    : columns === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : columns === 3
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : columns === 4
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    : columns === 5
    ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-6 ${maxWidthClass}`}>
        <div className={`grid ${gridColsClass} ${gapClass} ${alignClass} ${equalHeight ? '[&>*]:h-full' : ''}`}>
          {/* Grid children come from parent */}
        </div>
      </div>
    </section>
  )
}