import { cn } from '@/lib/utils'
import {
  Users,
  FileText,
  Rocket,
  Zap,
  Shield,
  Globe,
  Code,
  Layers,
  Settings,
  Database,
  Cloud,
  Lock,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  'file-text': FileText,
  rocket: Rocket,
  zap: Zap,
  shield: Shield,
  globe: Globe,
  code: Code,
  layers: Layers,
  settings: Settings,
  database: Database,
  cloud: Cloud,
  lock: Lock,
}

interface Stat {
  value: string
  label: string
  description?: string
  icon?: string
}

interface StatsBlockProps {
  title?: string
  layout?: 'grid' | 'stacked' | 'inline'
  stats?: Stat[]
  background?: 'none' | 'muted' | 'accent'
}

const layoutClasses = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  stacked: 'flex flex-col gap-4',
  inline: 'flex flex-wrap justify-center gap-8',
}

const backgroundClasses = {
  none: 'bg-transparent',
  muted: 'bg-white/[0.02]',
  accent: 'bg-gradient-to-r from-[#6154f0]/10 to-transparent',
}

export function StatsBlock({
  title,
  layout = 'grid',
  stats = [],
  background = 'none',
}: StatsBlockProps) {
  if (stats.length === 0) return null

  return (
    <section className={cn('py-16', backgroundClasses[background])}>
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {title}
          </h2>
        )}

        <div className={cn(layoutClasses[layout])}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon ? iconMap[stat.icon] : null

            return (
              <div
                key={index}
                className={cn(
                  'text-center p-6 rounded-xl',
                  background === 'muted' && 'bg-white/[0.03]',
                  layout === 'inline' && 'min-w-[150px]'
                )}
              >
                {IconComponent && (
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#6154f0]/20 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-[#6154f0]" />
                  </div>
                )}

                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>

                <div className="text-sm font-medium text-zinc-400 mb-1">
                  {stat.label}
                </div>

                {stat.description && (
                  <div className="text-xs text-zinc-500">
                    {stat.description}
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