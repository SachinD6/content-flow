import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header, Footer } from '@/features/layout'
import { PageRenderer } from '@/features/blocks'
import { sanityFetch } from '@/lib/sanity/live'
import { 
  PAGE_BY_TYPE_AND_LANGUAGE_QUERY, 
  SITE_SETTINGS_WITH_LANGUAGES_QUERY, 
  ALL_POSTS_BY_LANGUAGE_QUERY 
} from '@/lib/sanity/queries'
import { isValidLanguage, defaultLanguage } from '@/lib/i18n'
import { t } from '@/lib/i18n/translations'
import type { Metadata } from 'next'

interface LangPageProps {
  params: Promise<{ lang: string }>
}

interface Language {
  _id: string
  id: string
  title: string
  nativeTitle?: string
  isDefault?: boolean
  flag?: string
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  tags?: string[]
  author?: { name: string; avatar?: string }
  coverImage?: string
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    return { title: 'Page Not Found' }
  }
  
  const langCode = lang
  
  const settingsResult = await sanityFetch({ query: SITE_SETTINGS_WITH_LANGUAGES_QUERY })
  const settings = settingsResult.data
  
  return {
    title: settings?.siteName || 'ContentFlow',
    description: settings?.siteDescription || 'A modern publishing platform',
    alternates: {
      canonical: langCode === defaultLanguage ? '/' : `/${langCode}`,
      languages: {
        'en': '/',
        'hi': '/hi',
      }
    }
  }
}

export default async function LangHomePage({ params }: LangPageProps) {
  const { lang } = await params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    notFound()
  }
  
  const langCode = lang
  const { isEnabled: isDraftMode } = await draftMode()
  
  const [settingsResult, homePageResult, postsResult] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_WITH_LANGUAGES_QUERY }),
    sanityFetch({ 
      query: PAGE_BY_TYPE_AND_LANGUAGE_QUERY, 
      params: { pageType: 'home', language: langCode }
    }),
    sanityFetch({ 
      query: ALL_POSTS_BY_LANGUAGE_QUERY, 
      params: { language: langCode }
    }),
  ])

  const settings = settingsResult.data
  const homePage = homePageResult.data
  const posts: Post[] = postsResult.data || []

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, display_name, avatar_url')
      .eq('id', user.id)
      .single()

    if (profile) {
      userProfile = {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name || undefined,
        avatarUrl: profile.avatar_url || undefined,
      }
    }
  }

  const supportedLanguages: Language[] = settings?.supportedLanguages || [
    { _id: 'en-id', id: 'en', title: 'English', nativeTitle: 'English', isDefault: true },
    { _id: 'hi-id', id: 'hi', title: 'Hindi', nativeTitle: 'हिन्दी', isDefault: false },
  ]

  const hasComponents = homePage?.components && homePage.components.length > 0

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <Header
        siteName={settings?.siteName}
        headerNav={settings?.headerNav ?? undefined}
        guestNav={settings?.guestNav ?? undefined}
        authNav={settings?.authNav ?? undefined}
        lang={langCode}
        supportedLanguages={supportedLanguages}
        user={userProfile}
      />

      {isDraftMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20">
          <div className="mx-auto max-w-6xl px-12 lg:px-32 py-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-200 text-sm">
                Preview Mode — Draft content visible
              </span>
              <Link
                href="/api/draft/disable"
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                Exit Preview
              </Link>
            </div>
          </div>
        </div>
      )}

      <main>
        {hasComponents ? (
          <PageRenderer
            components={homePage.components}
            posts={posts}
            lang={langCode}
          />
        ) : (
          <div className="mx-auto max-w-6xl px-12 lg:px-32 py-12">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('welcome', langCode)}
              </h2>
              <p className="text-zinc-400 mb-6">
                {settings?.siteDescription || t('startBuilding', langCode)}
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center px-4 py-2 bg-[#6154f0] text-white rounded-lg hover:bg-[#5841e8] transition-colors"
              >
                {t('openStudio', langCode)}
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer
        siteName={settings?.siteName}
        footerDescription={settings?.footerDescription}
        copyrightText={settings?.copyrightText}
        legalLinks={settings?.legalLinks}
        footerNav={settings?.footerNav ?? undefined}
        user={userProfile}
        lang={langCode}
      />
    </div>
  )
}