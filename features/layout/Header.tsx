'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { UserMenu } from '@/features/auth/UserMenu'

interface NavItem {
  label: string
  href: string
  requiresAuth?: boolean
  authOnly?: boolean
  guestOnly?: boolean
}

interface HeaderProps {
  siteName?: string | null
  headerNav?: NavItem[] | null
  guestNav?: NavItem[] | null
  authNav?: NavItem[] | null
  user?: {
    id: string
    email: string
    displayName?: string
    avatarUrl?: string
  } | null
}

export function Header({ siteName, headerNav, guestNav, authNav, user }: HeaderProps) {
  const defaultHeaderNav: NavItem[] = [
    { label: 'Articles', href: '/posts' },
  ]
  const defaultGuestNav: NavItem[] = [
    { label: 'Sign In', href: '/login' },
    { label: 'Get Started', href: '/signup' },
  ]

  const navItems = headerNav ?? defaultHeaderNav
  const guestItems = guestNav ?? defaultGuestNav

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6154f0]">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold text-white">
              {siteName ?? 'ContentFlow'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => {
              if (item.requiresAuth && !user) return null
              if (item.authOnly && !user) return null
              if (item.guestOnly && user) return null

              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )
            })}

            {user ? (
              <UserMenu user={user} authNav={authNav} />
            ) : (
              <>
                {guestItems.map((item, index) => {
                  const isPrimary = item.href.includes('signup') || item.href.includes('get')
                  return (
                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      className={`text-sm ${isPrimary ? 'font-medium text-white bg-[#6154f0] px-4 py-2 rounded-full hover:bg-[#5841e8] transition-colors' : 'text-zinc-400 hover:text-white transition-colors'}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}