'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { languages, type LanguageId } from '@/lib/i18n/config'

interface LanguageSwitcherProps {
  supportedLanguages?: { id: string; title: string; nativeTitle?: string }[]
}

export function LanguageSwitcher({ supportedLanguages }: LanguageSwitcherProps) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = (params?.lang as string) || 'en'
  
  const availableLanguages = supportedLanguages 
    ? languages.filter(l => supportedLanguages.some(sl => sl.id === l.id))
    : languages

  const currentLanguageData = availableLanguages.find(l => l.id === currentLang) || availableLanguages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (langId: LanguageId) => {
    setIsOpen(false)
    
    if (langId === currentLang) return

    // eslint-disable-next-line -- Setting cookie in event handler is intentional
    document.cookie = `preferred-language=${langId}; path=/; max-age=${60 * 60 * 24 * 365}`
    
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    
    let newPath: string
    
    if (languages.some(l => l.id === firstSegment)) {
      segments[0] = langId
      newPath = '/' + segments.join('/')
    } else {
      if (langId === 'en') {
        newPath = pathname
      } else {
        newPath = '/' + langId + pathname
      }
    }
    
    if (newPath === '/') {
      if (langId !== 'en') {
        newPath = '/' + langId
      }
    }
    
    router.push(newPath)
  }

  if (availableLanguages.length <= 1) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguageData.nativeTitle}</span>
        <span className="sm:hidden">{currentLanguageData.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#121319] border border-white/[0.08] rounded-lg shadow-lg overflow-hidden z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => switchLanguage(lang.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                lang.id === currentLang
                  ? 'bg-[#6154f0]/20 text-[#6154f0]'
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeTitle}</span>
              {lang.id === currentLang && (
                <span className="ml-auto text-[#6154f0]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}