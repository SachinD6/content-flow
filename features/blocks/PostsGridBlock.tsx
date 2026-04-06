import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BlogPostCard } from '@/features/posts/BlogPostCard'

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

interface PostsGridBlockProps {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'list' | 'featured' | 'masonry'
  posts?: Post[]
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  showTags?: boolean
  emptyMessage?: string
  viewAllLink?: {
    show?: boolean
    text?: string
    href?: string
  }
  lang?: string
}

const layoutClasses = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  list: 'flex flex-col gap-6',
  featured: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6',
}

export function PostsGridBlock({
  title,
  subtitle,
  layout = 'grid',
  posts = [],
  emptyMessage = 'No posts found',
  viewAllLink,
  lang = 'en',
}: PostsGridBlockProps) {
  const localizedHref = (href: string) => {
    if (lang === 'en') return href
    if (href === '/') return `/${lang}`
    return `/${lang}${href.startsWith('/') ? href : '/' + href}`
  }

  if (posts.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-12 lg:px-32 text-center">
          <p className="text-zinc-500">{emptyMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn(layoutClasses[layout])}>
          {posts.map((post, index) => (
            <div
              key={post._id}
              className={cn(
                layout === 'masonry' && 'break-inside-avoid mb-6',
                layout === 'featured' && index === 0 && 'lg:col-span-2 lg:row-span-2'
              )}
            >
              <BlogPostCard
                post={post}
                featured={layout === 'featured' && index === 0}
              />
            </div>
          ))}
        </div>

        {viewAllLink?.show && (
          <div className="mt-12 text-center">
            <Link
              href={localizedHref(viewAllLink.href || '/posts')}
              className="inline-flex items-center gap-2 text-[#6154f0] hover:text-[#5841e8] font-medium transition-colors"
            >
              {viewAllLink.text || 'View all posts'}
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}