import { BlogPostCard } from '@/features/posts/BlogPostCard'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  mostViewed?: boolean
  tags?: string[]
  author?: { name: string; avatar?: string }
  coverImage?: string
}

interface FeaturedPostBlockProps {
  label?: string
  post?: Post
  autoSelect?: 'latest' | 'featured' | 'mostViewed' | 'manual'
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  layout?: 'large' | 'medium' | 'split'
  posts?: Post[]
  lang?: string
}

export function FeaturedPostBlock({
  label = 'Featured Story',
  post,
  autoSelect = 'featured',
  layout = 'large',
  posts = [],
  lang = 'en',
}: FeaturedPostBlockProps) {
  const safePosts = posts ?? []
  let featuredPost = post

  if (!featuredPost && safePosts.length > 0) {
    if (autoSelect === 'featured') {
      featuredPost = safePosts.find((p) => p.featured) || safePosts[0]
    } else if (autoSelect === 'latest') {
      featuredPost = safePosts[0]
    } else if (autoSelect === 'mostViewed') {
      featuredPost = safePosts.find((p) => p.mostViewed) || safePosts[0]
    } else {
      featuredPost = safePosts[0]
    }
  }

  if (!featuredPost) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-12 lg:px-32">
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#6154f0] uppercase tracking-wider">
            {label}
          </span>
        </div>

        {layout === 'split' ? (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {featuredPost.title}
              </h2>
              {featuredPost.excerpt && (
                <p className="text-zinc-400 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
              )}
              <BlogPostCard post={featuredPost} horizontal lang={lang} />
            </div>
          </div>
        ) : (
          <BlogPostCard
            post={featuredPost}
            featured={layout === 'large'}
            lang={lang}
          />
        )}
      </div>
    </section>
  )
}
