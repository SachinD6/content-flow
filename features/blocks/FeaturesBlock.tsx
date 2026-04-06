import Link from 'next/link'
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
import { cn } from '@/lib/utils'

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

interface Feature {
  title: string
  description?: string
  icon?: string
  link?: {
    text?: string
    href?: string
  }
}

interface FeaturesBlockProps {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'grid2' | 'list'
  features?: Feature[]
  lang?: string
}

const layoutClasses = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  list: 'flex flex-col gap-6',
}

export function FeaturesBlock({
  title,
  subtitle,
  layout = 'grid',
  features = [],
  lang = 'en',
}: FeaturesBlockProps) {
  const localizedHref = (href: string) => {
    if (lang === 'en') return href
    if (href === '/') return `/${lang}`
    return `/${lang}${href.startsWith('/') ? href : '/' + href}`
  }

  if (features.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn(layoutClasses[layout])}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] : null

            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#121319] border border-white/[0.08] hover:border-[#6154f0]/30 transition-colors"
              >
                {IconComponent && (
                  <div className="mb-4 h-12 w-12 rounded-xl bg-[#6154f0]/20 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-[#6154f0]" />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                {feature.description && (
                  <p className="text-zinc-400 text-sm mb-4">
                    {feature.description}
                  </p>
                )}

                {feature.link && (
                  <Link
                    href={localizedHref(feature.link.href || '#')}
                    className="text-sm text-[#6154f0] hover:text-[#5841e8] font-medium inline-flex items-center gap-1"
                  >
                    {feature.link.text || 'Learn more'}
                    <span>→</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}