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
import { defaultLanguage } from '@/lib/i18n'
import { buildAlternateLanguageEntries, buildTranslationLinks, getPostPath } from '@/lib/i18n/content-routing'
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

const PortableTextRenderer = dynamicImport(
  () => import('@/features/posts/PortableTextRenderer'),
  { loading: () => <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> }
)

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params

  const post = await writeSanityClient.fetch(
    POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY,
    { slug, language: defaultLanguage }
  ) as ExtendedPost | null

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const canonicalSlug = post.canonicalSlug || post.slug || slug

  return {
    title: `${post.title} | ContentFlow`,
    description: post.excerpt || undefined,
    alternates: {
      canonical: getPostPath(canonicalSlug, defaultLanguage),
      languages: buildAlternateLanguageEntries(post.availableTranslations, 'post'),
    },
  }
}

export default async function PublicPostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const { isEnabled: isDraftMode } = await draftMode()

  const cmsClient = isDraftMode ? previewSanityClient : writeSanityClient
  const [post, settings] = await Promise.all([
    cmsClient.fetch(POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY, { slug, language: defaultLanguage }),
    cmsClient.fetch(SITE_SETTINGS_WITH_LANGUAGES_QUERY),
  ])

  if (!post) {
    notFound()
  }

  const canonicalSlug = post.canonicalSlug || post.slug || slug
  const canonicalPath = getPostPath(canonicalSlug, defaultLanguage)
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
        lang={defaultLanguage}
        supportedLanguages={settings?.supportedLanguages ?? undefined}
        translationLinks={translationLinks}
        contentTypeLabel="post"
        user={userProfile}
      />

      {isDraftMode && (
        <div className="border-b border-amber-500/20 bg-amber-500/10">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚠️</span>
                <span className="text-sm font-medium text-amber-200">Preview Mode — Draft content visible</span>
              </div>
              <Link
                href="/api/draft/disable"
                className="text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
              >
                Exit Preview →
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="space-y-6 sm:space-y-8">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag: string) => (
              <Link key={tag} href={`/?tag=${tag}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:bg-[#6154f0]/20 hover:text-[#6154f0]"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
            {post.featured && (
              <Badge className="rounded-full border border-transparent bg-[#6154f0]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6154f0]">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name || 'Author avatar'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#6154f0] text-sm font-bold text-white">
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
                    year: 'numeric',
                  })}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] shadow-2xl">
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

          <div className="border-t border-white/5 pt-8">
            <PortableTextRenderer value={post.body as PortableTextBlock[]} />
          </div>
        </article>

        <div className="mt-16 border-t border-white/5 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
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
        lang={defaultLanguage}
      />
    </div>
  )
}
