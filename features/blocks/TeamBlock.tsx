'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Linkedin, Github, Globe, Mail } from 'lucide-react'

interface TeamBlockProps {
  title?: string
  subtitle?: string
  members?: Array<{
    name: string
    role?: string
    image?: string
    bio?: string
    socialLinks?: Array<{
      platform: 'twitter' | 'linkedin' | 'github' | 'website' | 'email'
      href: string
      external?: boolean
      target?: '_self' | '_blank'
    }>
  }>
  columns?: number
  showBio?: boolean
  showSocial?: boolean
  variant?: 'cards' | 'minimal' | 'circle'
  lang?: string
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
}

export function TeamBlock({
  title,
  subtitle,
  members = [],
  columns = 4,
  showBio = true,
  showSocial = true,
  variant = 'cards',
  lang = 'en',
  styles,
}: TeamBlockProps) {
  const safeMembers = members ?? []

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
    5: 'md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-4'

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      twitter: <Twitter className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
      github: <Github className="w-4 h-4" />,
      website: <Globe className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
    }
    return icons[platform] || <Globe className="w-4 h-4" />
  }

  const isExternalHref = (href: string, target?: '_self' | '_blank', external?: boolean) =>
    Boolean(
      external ||
        target === '_blank' ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
    )

  const localizeHref = (href: string, target?: '_self' | '_blank', external?: boolean) => {
    if (!href) return '#'
    if (lang === 'en' || isExternalHref(href, target, external)) return href
    if (href === '/') return `/${lang}`
    if (href === `/${lang}` || href.startsWith(`/${lang}/`)) return href
    return `/${lang}${href.startsWith('/') ? href : `/${href}`}`
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  const containerStyles = {
    cards: 'bg-[#121319] border border-white/10 rounded-xl p-6',
    minimal: 'p-4',
    circle: 'text-center p-4',
  }

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
          {safeMembers.map((member, index) => (
            <div key={index} className={containerStyles[variant]}>
              <div className={variant === 'circle' ? 'flex flex-col items-center' : ''}>
                <div className={`relative mb-4 ${variant === 'circle' ? 'w-24 h-24' : 'w-20 h-20'}`}>
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name || 'Team member'}
                      fill
                      className={`object-cover ${variant === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                    />
                  ) : (
                    <div className={`w-full h-full bg-[#6154f0] flex items-center justify-center text-white font-bold text-xl ${variant === 'circle' ? 'rounded-full' : 'rounded-lg'}`}>
                      {member.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-1">{member.name}</h3>
                {member.role && (
                  <p className="text-sm text-[#6154f0] mb-2">{member.role}</p>
                )}
                
                {showBio && member.bio && (
                  <p className="text-sm text-zinc-400 mb-4">{member.bio}</p>
                )}
                
                {showSocial && member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="flex gap-3">
                    {member.socialLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={localizeHref(link.href, link.target, link.external)}
                        target={isExternalHref(link.href, link.target, link.external) ? '_blank' : link.target}
                        rel={isExternalHref(link.href, link.target, link.external) ? 'noopener noreferrer' : undefined}
                        className="text-zinc-500 hover:text-[#6154f0] transition-colors"
                      >
                        {getSocialIcon(link.platform)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
