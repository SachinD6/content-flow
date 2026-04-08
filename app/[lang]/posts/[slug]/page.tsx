import { notFound, permanentRedirect } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import { ArrowLeft, Clock } from 'lucide-react'
import { Metadata } from 'next'

import { POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, SITE_SETTINGS_WITH_LANGUAGES_QUERY } from '@/lib/sanity/queries'
import { createClient } from '@/lib/supabase/server'
import { Header, Footer } from '@/features/layout'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { isValidLanguage } from '@/lib/i18n'
import { buildAlternateLanguageEntries, buildTranslationLinks, getLocalizedPath, getPostPath } from '@/lib/i18n/content-routing'
import { previewSanityClient, writeSanityClient } from '@/lib/sanity/client'
import type { PortableTextBlock } from '@portabletext/types'

export const dynamic = 'force-dynamic'

interface ExtendedPost {
  _id: string
  title: string
  slug: string
  canonicalSlug?: string
  language?: string
  excerpt?: string
  body?: PortableTextBlock[]
  publishedAt?: string
  featured?: boolean
  tags?: string[]
  author?: { name: string; avatar?: string; bio?: string }
  coverImage?: string
  readingTime?: number
  availableTranslations?: Array<{
    _id: string
    language: string
    slug?: string
    canonicalSlug?: string
  }>
}

interface PostPageParams {
  lang: string
  slug: string
}

const PortableTextRenderer = dynamicImport(
  () => import('@/features/posts/PortableTextRenderer'),
  { loading: () => <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div> }
)

export async function generateMetadata(props: { params: Promise<PostPageParams> }): Promise<Metadata> {
  const { lang, slug } = await props.params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    return { title: 'Page Not Found' }
  }
  
  const langCode = lang
  
  const post = await writeSanityClient.fetch(
    POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY,
    { slug, language: langCode }
  ) as ExtendedPost | null

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const canonicalSlug = post.canonicalSlug || post.slug || slug

  return {
    title: `${post.title} | ContentFlow`,
    description: post.excerpt || undefined,
    alternates: {
      canonical: getPostPath(canonicalSlug, langCode),
      languages: buildAlternateLanguageEntries(post.availableTranslations, 'post'),
    }
  }
}

export default async function LangPostPage(props: { params: Promise<PostPageParams> }) {
  const { lang, slug } = await props.params
  
  // Return 404 for invalid language codes
  if (!isValidLanguage(lang)) {
    notFound()
  }
  
  const langCode = lang
  const { isEnabled: isDraftMode } = await draftMode()
  
  const cmsClient = isDraftMode ? previewSanityClient : writeSanityClient
  const [post, settings] = await Promise.all([
    cmsClient.fetch(POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, { slug, language: langCode }),
    cmsClient.fetch(SITE_SETTINGS_WITH_LANGUAGES_QUERY),
  ])

  if (!post) {
    notFound()
  }

  const canonicalSlug = post.canonicalSlug || post.slug || slug
  const canonicalPath = getPostPath(canonicalSlug, langCode)
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

  const wordCount = post.body ? JSON.stringify(post.body).split(/\s+/).length : 0
  const readingTime = Math.ceil(wordCount / 200)

  const supportedLanguages = settings?.supportedLanguages || [
    { _id: 'en-id', id: 'en', title: 'English', nativeTitle: 'English' },
    { _id: 'hi-id', id: 'hi', title: 'Hindi', nativeTitle: 'हिन्दी' },
  ]

  const translationLinks = buildTranslationLinks(post.availableTranslations, 'post')

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
        translationLinks={translationLinks}
        contentTypeLabel="post"
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

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Link
            href={getLocalizedPath('/', langCode)}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="space-y-6 sm:space-y-8">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag: string) => (
              <Link key={tag} href={getLocalizedPath(`/?tag=${tag}`, langCode)}>
                <Badge
                  variant="secondary"
                  className="bg-white/5 hover:bg-[#6154f0]/20 text-zinc-400 hover:text-[#6154f0] text-[10px] uppercase font-bold tracking-widest border border-white/10 rounded-full px-3 py-1 transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
            {post.featured && (
              <Badge className="bg-[#6154f0]/20 text-[#6154f0] text-[10px] uppercase font-bold tracking-widest border border-transparent rounded-full px-3 py-1">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name || 'Author avatar'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#6154f0] flex items-center justify-center text-sm font-bold text-white">
                    {(post.author?.name || 'A').charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{post.author?.name || 'Unknown Author'}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span>{new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[16px] shadow-2xl">
              <Image
                src={post.coverImage}
                alt={post.title || 'Post cover image'}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          <div className="pt-8 border-t border-white/5">
            <PortableTextRenderer value={post.body as PortableTextBlock[]} />
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-white/5">
          <Link
            href={getLocalizedPath('/', langCode)}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Read more articles
          </Link>
        </div>
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
