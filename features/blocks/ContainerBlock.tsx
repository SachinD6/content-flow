'use client'

interface ContainerBlockProps {
  maxWidth?: 'narrow' | 'medium' | 'wide' | 'xwide' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  centerContent?: boolean
  backgroundType?: 'none' | 'color' | 'gradient' | 'image'
  backgroundColor?: string
  backgroundGradient?: string
  backgroundImage?: string
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function ContainerBlock({
  maxWidth = 'wide',
  padding = 'none',
  centerContent = true,
  backgroundType = 'none',
  backgroundColor,
  backgroundGradient,
  borderRadius = 'none',
  shadow = 'none',
}: ContainerBlockProps) {
  const maxWidthClass = {
    narrow: 'max-w-3xl',
    medium: 'max-w-4xl',
    wide: 'max-w-5xl',
    xwide: 'max-w-6xl',
    full: 'max-w-full',
  }[maxWidth]

  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
    xl: 'p-16',
  }[padding]

  const borderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-2xl',
  }[borderRadius]

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }[shadow]

  const bgStyle: React.CSSProperties = {}
  if (backgroundType === 'color' && backgroundColor) {
    bgStyle.backgroundColor = backgroundColor
  }
  if (backgroundType === 'gradient' && backgroundGradient) {
    bgStyle.background = backgroundGradient
  }

  return (
    <div 
      className={`${maxWidthClass} mx-auto ${paddingClass} ${borderRadiusClass} ${shadowClass} ${centerContent ? 'text-center' : ''}`}
      style={bgStyle}
    >
      {/* Container is a wrapper - content comes from parent */}
    </div>
  )
}