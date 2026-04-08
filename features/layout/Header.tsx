'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, Sparkles, X } from 'lucide-react'
import { UserMenu } from '@/features/auth/UserMenu'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

interface NavItem {
  label: string
  labelHindi?: string | null
  href: string
  external?: boolean
  target?: '_self' | '_blank'
  icon?: string | null
  requiresAuth?: boolean
  authOnly?: boolean
  guestOnly?: boolean
  children?: NavItem[] | null
}

interface HeaderProps {
  siteName?: string | null
  siteNameHindi?: string | null
  logo?: string | null
  headerNav?: NavItem[] | null
  guestNav?: NavItem[] | null
  authNav?: NavItem[] | null
  lang?: string
  supportedLanguages?: { id: string; title: string; nativeTitle?: string }[]
  translationLinks?: Partial<Record<'en' | 'hi', string>>
  contentTypeLabel?: 'page' | 'post'
  user?: {
    id: string
    email: string
    displayName?: string
    avatarUrl?: string
  } | null
}

function canShowItem(item: NavItem, user: HeaderProps['user']) {
  if (item.requiresAuth && !user) return false
  if (item.authOnly && !user) return false
  if (item.guestOnly && user) return false
  return true
}

function isExternalHref(href: string, item?: NavItem) {
  return Boolean(
    item?.external ||
      item?.target === '_blank' ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
  )
}

function isNonLocalizedAppRoute(href: string) {
  return (
    href === '/login' ||
    href === '/signup' ||
    href === '/dashboard' ||
    href.startsWith('/dashboard/') ||
    href.startsWith('/auth/')
  )
}

function localizeHref(href: string, lang: string, item?: NavItem) {
  if (isExternalHref(href, item) || lang === 'en' || isNonLocalizedAppRoute(href)) return href
  if (href === '/') return `/${lang}`
  if (href.startsWith(`/${lang}/`) || href === `/${lang}`) return href
  return `/${lang}${href.startsWith('/') ? href : `/${href}`}`
}

function getLocalizedLabel(item: NavItem, lang: string) {
  if (lang === 'hi' && item.labelHindi) return item.labelHindi
  return item.label
}

function NavLink({
  item,
  lang,
  className,
}: {
  item: NavItem
  lang: string
  className?: string
}) {
  const href = localizeHref(item.href || '#', lang, item)
  const target = item.target === '_blank' || item.external ? '_blank' : undefined

  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {getLocalizedLabel(item, lang)}
    </Link>
  )
}

export function Header({
  siteName,
  siteNameHindi,
  logo,
  headerNav,
  guestNav,
  authNav,
  lang = 'en',
  supportedLanguages,
  translationLinks,
  contentTypeLabel,
  user,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const localizedSiteName = lang === 'hi' ? siteNameHindi || siteName || 'ContentFlow' : siteName || 'ContentFlow'
  const defaultHeaderNav: NavItem[] = [{ label: 'Articles', labelHindi: 'लेख', href: '/posts' }]
  const defaultGuestNav: NavItem[] = [
    { label: 'Sign In', labelHindi: 'साइन इन', href: '/login' },
    { label: 'Get Started', labelHindi: 'शुरू करें', href: '/signup' },
  ]

  const navItems = (headerNav ?? defaultHeaderNav).filter((item) => canShowItem(item, user))
  const guestItems = (guestNav ?? defaultGuestNav).filter((item) => canShowItem(item, user))

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b0c10]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={localizeHref('/', lang)}
            className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6154f0]"
          >
            {logo ? (
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image
                  src={logo}
                  alt={localizedSiteName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6154f0]">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
            )}
            <span className="text-lg font-bold text-white">{localizedSiteName}</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
            {navItems.map((item, index) => {
              const visibleChildren = item.children?.filter((child) => canShowItem(child, user)) ?? []

              if (visibleChildren.length > 0) {
                return (
                  <div key={`${item.label}-${index}`} className="group relative">
                    <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
                      {getLocalizedLabel(item, lang)}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="invisible absolute left-0 top-full min-w-52 translate-y-2 rounded-2xl border border-white/[0.08] bg-[#121319] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {visibleChildren.map((child, childIndex) => (
                        <NavLink
                          key={`${child.href}-${childIndex}`}
                          item={child}
                          lang={lang}
                          className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                        />
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <NavLink
                  key={`${item.href}-${index}`}
                  item={item}
                  lang={lang}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                />
              )
            })}

            <LanguageSwitcher
              supportedLanguages={supportedLanguages}
              currentLang={lang as 'en' | 'hi'}
              translationLinks={translationLinks}
              contentTypeLabel={contentTypeLabel}
            />

            {user ? (
              <UserMenu user={user} authNav={authNav} lang={lang} />
            ) : (
              guestItems.map((item, index) => {
                const isPrimary = item.href.includes('signup') || item.href.includes('get')
                return (
                  <NavLink
                    key={`${item.href}-${index}`}
                    item={item}
                    lang={lang}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isPrimary
                        ? 'bg-[#6154f0] text-white hover:bg-[#5841e8]'
                        : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  />
                )
              })
            )}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-white md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/[0.06] py-4 md:hidden">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {navItems.map((item, index) => {
                const visibleChildren = item.children?.filter((child) => canShowItem(child, user)) ?? []

                return (
                  <div key={`${item.label}-${index}`}>
                    <NavLink
                      item={item}
                      lang={lang}
                      className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.06]"
                    />
                    {visibleChildren.map((child, childIndex) => (
                      <NavLink
                        key={`${child.href}-${childIndex}`}
                        item={child}
                        lang={lang}
                        className="ml-4 block rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                      />
                    ))}
                  </div>
                )
              })}

              <div className="px-3 py-3">
                <LanguageSwitcher
                  supportedLanguages={supportedLanguages}
                  currentLang={lang as 'en' | 'hi'}
                  translationLinks={translationLinks}
                  contentTypeLabel={contentTypeLabel}
                />
              </div>

              {!user &&
                guestItems.map((item, index) => (
                  <NavLink
                    key={`${item.href}-${index}`}
                    item={item}
                    lang={lang}
                    className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.06]"
                  />
                ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
