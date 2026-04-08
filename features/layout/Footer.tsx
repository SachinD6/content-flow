import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { t } from '@/lib/i18n/translations'

interface NavItem {
  label: string
  href: string
  external?: boolean
  target?: '_self' | '_blank'
  requiresAuth?: boolean
  children?: NavItem[] | null
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface LegalLinks {
  privacy: { label: string; href: string; external?: boolean; target?: '_self' | '_blank' }
  terms: { label: string; href: string; external?: boolean; target?: '_self' | '_blank' }
  cookies?: { label: string; href: string; external?: boolean; target?: '_self' | '_blank' }
}

interface FooterProps {
  siteName?: string | null
  footerDescription?: string | null
  copyrightText?: string | null
  legalLinks?: LegalLinks | null
  footerNav?: NavGroup[] | null
  socialLinks?: Array<{ platform: string; url: string; external?: boolean; target?: '_self' | '_blank' }> | null
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

function isExternalHref(path: string, item?: NavItem): boolean {
  return Boolean(
    item?.external ||
      item?.target === '_blank' ||
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('mailto:') ||
      path.startsWith('tel:') ||
      path.startsWith('#')
  )
}

function localizePath(path: string, lang?: string, item?: NavItem): string {
  if (!lang || lang === defaultLanguage || isExternalHref(path, item)) return path
  if (path === '/') return `/${lang}`
  if (path.startsWith(`/${lang}/`) || path === `/${lang}`) return path
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`
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

function FooterLink({
  item,
  lang,
  className,
}: {
  item: NavItem
  lang?: string
  className: string
}) {
  const target = item.target === '_blank' || item.external ? '_blank' : undefined
  return (
    <Link
      href={localizePath(item.href, lang, item)}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {item.label}
    </Link>
  )
}

function LegalLink({
  item,
  fallbackHref,
  fallbackLabel,
  lang,
}: {
  item?: { label: string; href: string; external?: boolean; target?: '_self' | '_blank' }
  fallbackHref: string
  fallbackLabel: string
  lang?: string
}) {
  const href = item?.href ?? fallbackHref
  const target = item?.target === '_blank' || item?.external ? '_blank' : undefined

  return (
    <Link
      href={localizePath(href, lang, item)}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className="text-sm text-zinc-500 transition-colors hover:text-white"
    >
      {item?.label ?? fallbackLabel}
    </Link>
  )
}

export function Footer({
  siteName,
  footerDescription,
  copyrightText,
  legalLinks,
  footerNav,
  socialLinks,
  footerCTAButtons,
  newsletterSection,
  user,
  lang,
}: FooterProps) {
  const navGroups = footerNav ?? getLocalizedNavItem(lang)
  const showNewsletter = newsletterSection?.enabled !== false
  const filteredSocialLinks = socialLinks?.filter((link) => link.url) ?? []

  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-[#0b0c10]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {showNewsletter && (
          <section className="mb-16 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
            <div className="max-w-xl">
              <h2 className="mb-3 text-xl font-bold text-white">
                {newsletterSection?.heading ?? t('stayInLoop', lang || 'en')}
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                {newsletterSection?.description ?? t('newsletterDescription', lang || 'en')}
              </p>
              <form className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="footer-newsletter-email">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder={newsletterSection?.placeholder ?? t('enterEmail', lang || 'en')}
                  className="min-h-11 flex-1 rounded-xl border border-white/[0.08] bg-[#121319] px-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#6154f0]/50 focus:outline-none"
                />
                <button className="min-h-11 rounded-xl bg-white px-5 text-sm font-semibold text-[#0b0c10] transition-colors hover:bg-zinc-200">
                  {newsletterSection?.buttonText ?? t('subscribe', lang || 'en')}
                </button>
              </form>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6154f0]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{siteName ?? 'ContentFlow'}</span>
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-zinc-400">
              {footerDescription ?? 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.'}
            </p>

            {filteredSocialLinks.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-3">
                {filteredSocialLinks.map((link) => (
                  <Link
                    key={`${link.platform}-${link.url}`}
                    href={localizePath(link.url, lang, {
                      label: link.platform,
                      href: link.url,
                      external: link.external,
                      target: link.target,
                    })}
                    target={link.target === '_blank' || link.external ? '_blank' : undefined}
                    rel={link.target === '_blank' || link.external ? 'noopener noreferrer' : undefined}
                    className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {link.platform}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {(footerCTAButtons ?? [
                { label: t('getStarted', lang || 'en'), href: '/signup', variant: 'primary' },
                { label: t('learnMore', lang || 'en'), href: '/posts', variant: 'secondary' },
              ])
                .filter((button) => !button.requiresAuth || user)
                .map((button, index) => (
                  <Link
                    key={`${button.href}-${index}`}
                    href={localizePath(button.href, lang)}
                    className={`inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
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

          {navGroups.map((group, groupIndex) => (
            <nav key={`${group.title}-${groupIndex}`} aria-label={group.title}>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
                {group.title}
              </h2>
              <ul className="space-y-4">
                {group.items
                  .filter((item) => !item.requiresAuth || user)
                  .map((item, itemIndex) => (
                    <li key={`${item.href}-${itemIndex}`}>
                      <FooterLink
                        item={item}
                        lang={lang}
                        className="text-sm text-zinc-500 transition-colors hover:text-white"
                      />
                      {item.children && item.children.length > 0 && (
                        <ul className="mt-3 space-y-3 border-l border-white/[0.08] pl-4">
                          {item.children.map((child, childIndex) => (
                            <li key={`${child.href}-${childIndex}`}>
                              <FooterLink
                                item={child}
                                lang={lang}
                                className="text-sm text-zinc-600 transition-colors hover:text-white"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-sm text-zinc-500">
            {copyrightText ?? '© 2026 ContentFlow. All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <LegalLink
              item={legalLinks?.privacy}
              fallbackHref="/privacy"
              fallbackLabel={t('privacyPolicy', lang || 'en')}
              lang={lang}
            />
            <LegalLink
              item={legalLinks?.terms}
              fallbackHref="/terms"
              fallbackLabel={t('termsOfService', lang || 'en')}
              lang={lang}
            />
            <LegalLink
              item={legalLinks?.cookies}
              fallbackHref="/cookies"
              fallbackLabel={t('cookies', lang || 'en')}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
