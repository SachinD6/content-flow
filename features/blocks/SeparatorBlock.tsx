import { cn } from '@/lib/utils'

interface SeparatorBlockProps {
  style?: 'line' | 'dots' | 'gradient' | 'space'
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'accent' | 'light'
}

const sizeClasses = {
  sm: 'my-6',
  md: 'my-12',
  lg: 'my-24',
}

const colorClasses = {
  default: 'border-white/[0.08]',
  accent: 'border-[#6154f0]/30',
  light: 'border-white/20',
}

export function SeparatorBlock({
  style = 'line',
  size = 'md',
  color = 'default',
}: SeparatorBlockProps) {
  return (
    <section className={cn(sizeClasses[size])}>
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        {style === 'line' && (
          <hr className={cn('border-t', colorClasses[color])} />
        )}

        {style === 'dots' && (
          <div className="flex justify-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full', color === 'accent' ? 'bg-[#6154f0]' : 'bg-zinc-600')} />
            <div className={cn('w-1.5 h-1.5 rounded-full', color === 'accent' ? 'bg-[#6154f0]' : 'bg-zinc-600')} />
            <div className={cn('w-1.5 h-1.5 rounded-full', color === 'accent' ? 'bg-[#6154f0]' : 'bg-zinc-600')} />
          </div>
        )}

        {style === 'gradient' && (
          <div className="h-px bg-gradient-to-r from-transparent via-[#6154f0]/50 to-transparent" />
        )}

        {style === 'space' && (
          <div className="h-0" />
        )}
      </div>
    </section>
  )
}