import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  SITE_SETTINGS_WITH_LANGUAGES_QUERY,
  ALL_PUBLISHED_POSTS_BY_LANGUAGE_QUERY,
} from '@/lib/sanity/queries'
import { createClient } from '@/lib/supabase/server'
import { Header, Footer } from '@/features/layout'
import { isValidLanguage, defaultLanguage } from '@/lib/i18n'
import { t, getLocalizedPath } from '@/lib/i18n/translations'
import { BlogPostCard } from '@/features/posts/BlogPostCard'
import { previewSanityClient, writeSanityClient } from '@/lib/sanity/client'

export const dynamic = 'force-dynamic'

interface PostsPageProps {
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

export async function generateMetadata({ params }: PostsPageProps): Promise<Metadata> {
  const { lang } = await params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    return { title: 'Page Not Found' }
  }
  
  const langCode = lang
  
  return {
    title: `Posts | ContentFlow`,
    description: `Browse all posts${langCode === 'hi' ? ' - सभी पोस्ट देखें' : ''}`,
    alternates: {
      canonical: langCode === defaultLanguage ? '/posts' : `/${langCode}/posts`,
      languages: {
        'en': '/posts',
        'hi': '/hi/posts',
      }
    }
  }
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { lang } = await params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    notFound()
  }
  
  const langCode = lang
  const { isEnabled: isDraftMode } = await draftMode()

  const cmsClient = isDraftMode ? previewSanityClient : writeSanityClient
  const [settings, postsResult] = await Promise.all([
    cmsClient.fetch(SITE_SETTINGS_WITH_LANGUAGES_QUERY),
    cmsClient.fetch(ALL_PUBLISHED_POSTS_BY_LANGUAGE_QUERY, { language: langCode }),
  ])
  const posts: Post[] = postsResult || []

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

const langHref = (path: string) => getLocalizedPath(path, langCode)

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <Header
        siteName={settings?.siteName}
        siteNameHindi={settings?.siteNameHindi}
        logo={settings?.logo}
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
                {t('previewMode', langCode)}
              </span>
              <Link
                href="/api/draft/disable"
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                {t('exitPreview', langCode)}
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-12 lg:px-32 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href={langHref('/')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>{t('backToHome', langCode)}</span>
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('allPosts', langCode)}
          </h1>
          <p className="text-zinc-400 text-lg">
            {t('browseLatest', langCode)}
          </p>
        </div>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <BlogPostCard 
                key={post._id} 
                post={post} 
                isFirst={index === 0}
                lang={langCode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#121319] flex items-center justify-center">
              <span className="text-2xl text-zinc-600">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {t('noPostsFound', langCode)}
            </h2>
            <p className="text-zinc-400 mb-6">
              {t('noPostsInLanguage', langCode)}
            </p>
            <Link
              href={langHref('/')}
              className="inline-flex items-center px-4 py-2 bg-[#6154f0] text-white rounded-lg hover:bg-[#5841e8] transition-colors"
            >
              {t('backToHome', langCode)}
            </Link>
          </div>
        )}
      </main>

      <Footer
        siteName={settings?.siteName}
        siteNameHindi={settings?.siteNameHindi}
        logo={settings?.logo}
        footerDescription={settings?.footerDescription}
        footerDescriptionHindi={settings?.footerDescriptionHindi}
        copyrightText={settings?.copyrightText}
        copyrightTextHindi={settings?.copyrightTextHindi}
        legalLinks={settings?.legalLinks}
        footerNav={settings?.footerNav ?? undefined}
        socialLinks={settings?.socialLinks ?? undefined}
        user={userProfile}
        lang={langCode}
      />
    </div>
  )
}
