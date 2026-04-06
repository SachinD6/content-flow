import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { t } from '@/lib/i18n/translations'

interface NavItem {
  label: string
  href: string
  requiresAuth?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface LegalLinks {
  privacy: { label: string; href: string }
  terms: { label: string; href: string }
  cookies: { label: string; href: string }
}

interface FooterProps {
  siteName?: string | null
  footerDescription?: string | null
  copyrightText?: string | null
  legalLinks?: LegalLinks | null
  footerNav?: NavGroup[] | null
  footerCTAButtons?: Array<{
    label: string
    href: string
    variant: string
    requiresAuth?: boolean
  }> | null
  newsletterSection?: {
    heading?: string | null
    description?: string | null
    placeholder?: string | null
    buttonText?: string | null
    enabled?: boolean | null
  } | null
  user?: {
    id: string
    email: string
    displayName?: string
    avatarUrl?: string
  } | null
  lang?: string
}

const defaultLanguage = 'en'

function localizePath(path: string, lang?: string): string {
  if (!lang || lang === defaultLanguage) return path
  return `/${lang}${path}`
}

function getLocalizedNavItem(lang?: string): NavGroup[] {
  return [
    {
      title: t('platform', lang || 'en'),
      items: [
        { label: t('articles', lang || 'en'), href: '/posts' },
        { label: t('dashboard', lang || 'en'), href: '/dashboard', requiresAuth: true },
        { label: t('writeStory', lang || 'en'), href: '/dashboard/posts', requiresAuth: true },
      ],
    },
    {
      title: t('account', lang || 'en'),
      items: [
        { label: t('settings', lang || 'en'), href: '/dashboard/settings', requiresAuth: true },
        { label: t('billing', lang || 'en'), href: '/dashboard/billing', requiresAuth: true },
        { label: t('helpCenter', lang || 'en'), href: '/help' },
      ],
    },
  ]
}

export function Footer({
  siteName,
  footerDescription,
  copyrightText,
  legalLinks,
  footerNav,
  footerCTAButtons,
  newsletterSection,
  user,
  lang,
}: FooterProps) {
  const navGroups = footerNav ?? getLocalizedNavItem(lang)
  const showNewsletter = newsletterSection?.enabled !== false

  return (
    <footer className="border-t border-white/[0.06] mt-24 bg-[#0b0c10]">
      <div className="mx-auto max-w-6xl px-12 lg:px-32 py-16">
        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="mb-16 pb-12 border-b border-white/[0.06]">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-white mb-3">
                {newsletterSection?.heading ?? t('stayInLoop', lang || 'en')}
              </h3>
              <p className="text-zinc-500 text-sm mb-5">
                {newsletterSection?.description ?? t('newsletterDescription', lang || 'en')}
              </p>
              <div className="flex gap-3 mb-6">
                <input
                  type="email"
                  placeholder={newsletterSection?.placeholder ?? t('enterEmail', lang || 'en')}
                  className="flex-1 px-4 py-2.5 bg-[#121319] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6154f0]/50 transition-colors"
                />
                <button className="px-5 py-2.5 bg-white text-[#0b0c10] text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
                  {newsletterSection?.buttonText ?? t('subscribe', lang || 'en')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6154f0]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                {siteName ?? 'ContentFlow'}
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mb-6">
              {footerDescription ?? 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.'}
            </p>
            <div className="flex gap-4">
              {(footerCTAButtons ?? [
                { label: t('getStarted', lang || 'en'), href: '/signup', variant: 'primary' },
                { label: t('learnMore', lang || 'en'), href: '/posts', variant: 'secondary' },
              ])
                .filter((btn) => {
                  if (btn.requiresAuth && !user) return false
                  return true
                })
                .map((button, index) => (
                  <Link
                    key={`${button.href}-${index}`}
                    href={localizePath(button.href, lang)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      button.variant === 'primary'
                        ? 'bg-white text-[#0b0c10] hover:bg-zinc-200'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {button.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Footer Navigation Groups */}
          {navGroups.map((group, groupIndex) => (
            <div key={`${group.title}-${groupIndex}`}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.items.map((item, itemIndex) => {
                  if (item.requiresAuth && !user) return null

                  return (
                    <li key={`${item.href}-${itemIndex}`}>
                      <Link
                        href={localizePath(item.href, lang)}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            {copyrightText ?? '© 2026 ContentFlow. All rights reserved.'}
          </p>
          <div className="flex items-center gap-8">
            <Link
              href={localizePath(legalLinks?.privacy?.href ?? '/privacy', lang)}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {legalLinks?.privacy?.label ?? t('privacyPolicy', lang || 'en')}
            </Link>
            <Link
              href={localizePath(legalLinks?.terms?.href ?? '/terms', lang)}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {legalLinks?.terms?.label ?? t('termsOfService', lang || 'en')}
            </Link>
            <Link
              href={localizePath(legalLinks?.cookies?.href ?? '/cookies', lang)}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {legalLinks?.cookies?.label ?? t('cookies', lang || 'en')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}