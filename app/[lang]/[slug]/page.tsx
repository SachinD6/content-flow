import { notFound, permanentRedirect } from 'next/navigation'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { sanityFetch } from '@/lib/sanity/live'
import { PAGE_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, SITE_SETTINGS_WITH_LANGUAGES_QUERY, ALL_POSTS_BY_LANGUAGE_QUERY } from '@/lib/sanity/queries'
import { createClient } from '@/lib/supabase/server'
import { Header, Footer } from '@/features/layout'
import { PageRenderer } from '@/features/blocks'
import { PortableText } from '@portabletext/react'
import { isValidLanguage } from '@/lib/i18n'
import { buildAlternateLanguageEntries, buildTranslationLinks, getPagePath } from '@/lib/i18n/content-routing'
import type { PortableTextBlock } from '@portabletext/types'

export const dynamic = 'force-dynamic'

interface SlugPageParams {
  lang: string
  slug: string
}

interface Page {
  _id: string
  title: string
  slug?: string
  canonicalSlug?: string
  language?: string
  description?: string
  components?: { _type: string; _key: string; [key: string]: unknown }[]
  content?: PortableTextBlock[]
  availableTranslations?: Array<{
    _id: string
    language: string
    slug?: string
    canonicalSlug?: string
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
  }
  publishedAt?: string
}

export async function generateMetadata(props: { params: Promise<SlugPageParams> }): Promise<Metadata> {
  const { lang, slug } = await props.params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    return { title: 'Page Not Found' }
  }
  
  const langCode = lang
  
  const pageResult = await sanityFetch({ 
    query: PAGE_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, 
    params: { slug, language: langCode }
  })
  const page = pageResult.data as Page | null

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const canonicalSlug = page.canonicalSlug || page.slug || slug

  return {
    title: page.seo?.metaTitle || page.title || 'ContentFlow',
    description: page.seo?.metaDescription || page.description || undefined,
    alternates: {
      canonical: getPagePath(canonicalSlug, langCode),
      languages: buildAlternateLanguageEntries(page.availableTranslations, 'page'),
    }
  }
}

export default async function LangGenericPage(props: { params: Promise<SlugPageParams> }) {
  const { lang, slug } = await props.params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    notFound()
  }
  
  const langCode = lang
  const { isEnabled: isDraftMode } = await draftMode()
  
  const [pageResult, settingsResult, postsResult] = await Promise.all([
    sanityFetch({ query: PAGE_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, params: { slug, language: langCode } }),
    sanityFetch({ query: SITE_SETTINGS_WITH_LANGUAGES_QUERY }),
    sanityFetch({ query: ALL_POSTS_BY_LANGUAGE_QUERY, params: { language: langCode } }),
  ])

  const page = pageResult.data as Page | null
  const settings = settingsResult.data
  const posts = postsResult.data || []

  if (!page) {
    notFound()
  }

  const canonicalSlug = page.canonicalSlug || page.slug || slug
  const canonicalPath = getPagePath(canonicalSlug, langCode)
  if (slug !== canonicalSlug) {
    permanentRedirect(canonicalPath)
  }

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

  const supportedLanguages = settings?.supportedLanguages || [
    { _id: 'en-id', id: 'en', title: 'English', nativeTitle: 'English' },
    { _id: 'hi-id', id: 'hi', title: 'Hindi', nativeTitle: 'हिन्दी' },
  ]

  const hasComponents = page.components && page.components.length > 0
  const translationLinks = buildTranslationLinks(page.availableTranslations, 'page')

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <Header
        siteName={settings?.siteName}
        headerNav={settings?.headerNav ?? undefined}
        guestNav={settings?.guestNav ?? undefined}
        authNav={settings?.authNav ?? undefined}
        lang={langCode}
        supportedLanguages={supportedLanguages}
        translationLinks={translationLinks}
        contentTypeLabel="page"
        user={userProfile}
      />

      {isDraftMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚠️</span>
                <span className="text-amber-200 text-sm font-medium">Preview Mode — Draft content visible</span>
              </div>
              <Link
                href="/api/draft/disable"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Exit Preview →
              </Link>
            </div>
          </div>
        </div>
      )}

      <main>
        {hasComponents ? (
          <PageRenderer
            components={page.components}
            posts={posts}
            lang={langCode}
          />
        ) : (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="mb-8">
              <Link
                href={getPagePath(undefined, langCode)}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              {page.title}
            </h1>

            {page.description && (
              <p className="text-lg text-zinc-400 mb-8">
                {page.description}
              </p>
            )}

            {page.content && page.content.length > 0 && (
              <div className="prose prose-invert prose-zinc max-w-none">
                <PortableText value={page.content as PortableTextBlock[]} />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer
        siteName={settings?.siteName}
        copyrightText={settings?.copyrightText}
        footerDescription={settings?.footerDescription}
        legalLinks={settings?.legalLinks}
        footerNav={settings?.footerNav ?? undefined}
        socialLinks={settings?.socialLinks ?? undefined}
        user={userProfile}
        lang={langCode}
      />
    </div>
  )
}
