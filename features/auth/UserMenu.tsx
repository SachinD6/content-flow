'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, LogOut, PenLine, Settings, Users } from 'lucide-react'

import { InviteUserModal } from '@/features/collaborations/InviteUserModal'

interface Collaborator {
  id: string
  collaborator_email: string
  permission: 'read' | 'write'
  status: 'pending' | 'active' | 'revoked'
  created_at: string
}

interface NavItem {
  label: string
  labelHindi?: string | null
  href: string
  external?: boolean
  requiresAuth?: boolean
}

interface UserMenuProps {
  user: {
    id: string
    email: string
    displayName?: string
    avatarUrl?: string
  }
  authNav?: NavItem[] | null
  lang?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  write: PenLine,
  dashboard: LayoutDashboard,
  settings: Settings,
  signout: LogOut,
  invite: Users,
  default: PenLine,
}

const defaultAuthNav: NavItem[] = [
  { label: 'Write a story', labelHindi: 'कहानी लिखें', href: '/dashboard/posts/new' },
  { label: 'Dashboard', labelHindi: 'डैशबोर्ड', href: '/dashboard' },
  { label: 'Invite Collaborators', labelHindi: 'सहयोगियों को आमंत्रित करें', href: '#invite' },
  { label: 'Settings', labelHindi: 'सेटिंग्स', href: '/dashboard/settings' },
  { label: 'Sign out', labelHindi: 'साइन आउट', href: '#signout' },
]

function getLocalizedLabel(item: NavItem, lang?: string) {
  if (lang === 'hi' && item.labelHindi) return item.labelHindi
  return item.label
}

function localizeHref(href: string, lang?: string, item?: NavItem) {
  if (
    !lang ||
    lang === 'en' ||
    item?.external ||
    href === '/login' ||
    href === '/signup' ||
    href === '/dashboard' ||
    href.startsWith('/dashboard/') ||
    href.startsWith('/auth/') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  ) {
    return href
  }

  if (href === '/') return `/${lang}`
  if (href.startsWith(`/${lang}/`) || href === `/${lang}`) return href
  return `/${lang}${href.startsWith('/') ? href : `/${href}`}`
}

export function UserMenu({ user, authNav, lang = 'en' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  const navItems = authNav ?? defaultAuthNav

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/api/collaborations')
      if (response.ok) {
        const data = await response.json()
        setCollaborators(data.owned || [])
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error)
    }
  }

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (response.ok) {
      window.location.href = '/'
    }
  }

  const handleItemClick = (item: NavItem) => {
    setIsOpen(false)
    if (item.href === '#invite') {
      setIsInviteModalOpen(true)
      fetchCollaborators()
    }
  }

  const displayName = user.displayName || user.email.split('@')[0]
  const initials = displayName.charAt(0).toUpperCase()
  const linkItems = navItems.filter((item) => item.href !== '#invite' && item.href !== '#signout')
  const actionItems = navItems.filter((item) => item.href === '#invite' || item.href === '#signout')

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center gap-2 focus:outline-none"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-[#6154f0] transition-colors hover:border-white/30">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                {initials}
              </div>
            )}
          </div>
          <span className="hidden text-sm text-zinc-300 lg:block">{displayName}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#121319] py-2 shadow-xl shadow-black/50">
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>

            <div className="py-1">
              {linkItems.map((item, index) => {
                const localizedLabel = getLocalizedLabel(item, lang)
                const iconKey = item.label.toLowerCase().split(' ')[0]
                const IconComponent = iconMap[iconKey] || iconMap.default

                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={localizeHref(item.href, lang, item)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                    onClick={() => handleItemClick(item)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {localizedLabel}
                  </Link>
                )
              })}
            </div>

            <div className="border-t border-white/[0.06] py-1">
              {actionItems.map((item, index) => {
                const localizedLabel = getLocalizedLabel(item, lang)

                if (item.href === '#signout') {
                  return (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      {localizedLabel}
                    </button>
                  )
                }

                if (item.href === '#invite') {
                  return (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={() => handleItemClick(item)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <Users className="h-4 w-4" />
                      {localizedLabel}
                    </button>
                  )
                }

                return null
              })}
            </div>
          </div>
        )}
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        collaborators={collaborators}
        onCollaboratorsChange={fetchCollaborators}
      />
    </>
  )
}
