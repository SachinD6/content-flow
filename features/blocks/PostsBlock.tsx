'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Loader2, Clock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLocalizedPath } from '@/lib/i18n/translations'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  tags?: string[]
  readingTime?: number
  author?: {
    name: string
    avatar?: string
  }
  coverImage?: string
  language?: {
    id: string
    title: string
  }
}

interface PaginatedPostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

interface PostsBlockProps {
  title?: string
  description?: string
  postSource?: 'all' | 'tags' | 'author' | 'featured'
  tags?: string[]
  author?: string
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'featured'
  columnsMobile?: number
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  showTags?: boolean
  showReadingTime?: boolean
  imageAspectRatio?: string
  enablePagination?: boolean
  paginationMode?: 'numbered' | 'infinite' | 'loadMore'
  postsPerPage?: number
  maxPosts?: number
  styles?: {
    backgroundType?: 'none' | 'color' | 'gradient'
    backgroundColor?: string
    backgroundGradient?: string
    paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  }
  lang?: string
}

const pageSizeClasses: Record<string, string> = {
  none: 'py-0',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

const aspectRatioClasses: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
  '2/3': 'aspect-[2/3]',
}

export function PostsBlock({
  title,
  description,
  postSource = 'all',
  tags,
  author,
  layout = 'grid-3',
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showTags = false,
  showReadingTime = true,
  imageAspectRatio = '16/9',
  enablePagination = true,
  paginationMode = 'numbered',
  postsPerPage = 6,
  styles,
  lang = 'en',
}: PostsBlockProps) {
  const [page, setPage] = useState(1)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Build query params helper
  const buildQueryParams = useCallback((pageNum: number) => {
    const params = new URLSearchParams()
    params.set('page', pageNum.toString())
    params.set('limit', postsPerPage.toString())
    params.set('language', lang)
    params.set('postSource', postSource)
    if (tags && tags.length > 0) params.set('tags', tags.join(','))
    if (author) params.set('author', author)
    return params.toString()
  }, [postsPerPage, lang, postSource, tags, author])

  // Infinite query for infinite scroll
  const infiniteQuery = useInfiniteQuery<PaginatedPostsResponse>({
    queryKey: ['infinite-posts', postSource, tags, author, postsPerPage, lang],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/posts/paginated?${buildQueryParams(pageParam as number)}`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: paginationMode === 'infinite',
  })

  // Regular query for numbered pagination
  const numberedQuery = useQuery<PaginatedPostsResponse>({
    queryKey: ['paginated-posts', page, postSource, tags, author, postsPerPage, lang],
    queryFn: async () => {
      const res = await fetch(`/api/posts/paginated?${buildQueryParams(page)}`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
    enabled: paginationMode !== 'infinite',
  })

  // Get the right data based on pagination mode
  const isLoading = paginationMode === 'infinite' ? infiniteQuery.isLoading : numberedQuery.isLoading
  const isError = paginationMode === 'infinite' ? infiniteQuery.isError : numberedQuery.isError
  const refetch = paginationMode === 'infinite' ? infiniteQuery.refetch : numberedQuery.refetch

  // Accumulate posts for infinite scroll
  const infinitePosts = infiniteQuery.data?.pages.flatMap(p => p.posts) || []
  const total = paginationMode === 'infinite' 
    ? (infiniteQuery.data?.pages[0]?.total || 0)
    : (numberedQuery.data?.total || 0)
  const hasMore = paginationMode === 'infinite'
    ? infiniteQuery.hasNextPage
    : (numberedQuery.data?.hasMore || false)
  const posts = paginationMode === 'infinite' ? infinitePosts : (numberedQuery.data?.posts || [])
  const totalPages = numberedQuery.data?.totalPages || 1

  const langHref = (path: string) => getLocalizedPath(path, lang)

  // Get grid classes
  const getGridClasses = useCallback(() => {
    const base = 'grid gap-6'
    switch (layout) {
      case 'grid-2':
        return `${base} grid-cols-1 md:grid-cols-2`
      case 'grid-3':
        return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
      case 'grid-4':
        return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
      case 'list':
        return `${base} grid-cols-1`
      case 'featured':
        return `${base} grid-cols-1 lg:grid-cols-2`
      default:
        return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
    }
  }, [layout])

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Background style
  const getBackgroundStyle = () => {
    if (!styles) return {}
    if (styles.backgroundType === 'gradient') {
      return { background: styles.backgroundGradient }
    }
    if (styles.backgroundType === 'color') {
      return { backgroundColor: styles.backgroundColor }
    }
    return {}
  }

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render post card
  const renderPostCard = (post: Post, isFeatured = false) => {
    const isList = layout === 'list'
    const aspectClass = aspectRatioClasses[imageAspectRatio] || 'aspect-video'

    return (
      <article
        key={post._id}
        className={cn(
          'group relative bg-[#121319] rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300',
          isList && 'flex gap-4',
          isFeatured && 'row-span-2'
        )}
      >
        {post.coverImage && (
          <Link
            href={langHref(`/posts/${post.slug}`)}
            className={cn(
              'block overflow-hidden',
              isList ? 'w-48 flex-shrink-0' : aspectClass,
              isFeatured && 'aspect-[4/3]'
            )}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        )}

        <div className={cn('flex flex-col', isList ? 'flex-1 p-4' : 'p-4')}>
          {showTags && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium bg-[#6154f0]/20 text-[#a78bfa] rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
            <Link href={langHref(`/posts/${post.slug}`)}>
              {post.title}
            </Link>
          </h3>

          {showExcerpt && post.excerpt && (
            <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <div className="mt-auto flex items-center gap-4 text-xs text-zinc-500">
            {showAuthor && post.author?.name && (
              <div className="flex items-center gap-1.5">
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}

            {showDate && post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            )}

            {showReadingTime && post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {post.readingTime} {lang === 'hi' ? 'मिनट' : 'min'}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <section
      className={cn(
        pageSizeClasses[styles?.paddingTop || 'md'],
        pageSizeClasses[styles?.paddingBottom || 'md']
      )}
      style={getBackgroundStyle()}
    >
      <div className={cn('mx-auto px-4 sm:px-6', maxWidthClasses[styles?.maxWidth || 'lg'])}>
        {/* Header */}
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-zinc-400 text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && page === 1 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#6154f0]" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-400">
              {lang === 'hi' ? 'पोस्ट लोड करने में त्रुटि हुई' : 'Error loading posts'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-[#6154f0] text-white rounded-lg hover:bg-[#5841e8] transition-colors"
            >
              {lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !isError && posts.length > 0 && (
          <div className={getGridClasses()}>
            {posts.map((post, index) => {
              const isFeatured = layout === 'featured' && index === 0
              return renderPostCard(post, isFeatured)
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">
              {lang === 'hi' ? 'कोई पोस्ट नहीं मिली' : 'No posts found'}
            </p>
          </div>
        )}

        {/* Infinite Scroll Loading Indicator */}
        {paginationMode === 'infinite' && hasMore && (
          <div ref={loadMoreRef} className="flex items-center justify-center py-8">
            {isLoading && <Loader2 className="w-6 h-6 animate-spin text-[#6154f0]" />}
          </div>
        )}

        {/* Load More Button */}
        {paginationMode === 'loadMore' && enablePagination && hasMore && (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-[#6154f0] text-white font-medium rounded-lg hover:bg-[#5841e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                </>
              ) : (
                lang === 'hi' ? 'और लोड करें' : 'Load More'
              )}
            </button>
          </div>
        )}

        {/* Numbered Pagination */}
        {paginationMode === 'numbered' && enablePagination && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="p-2 rounded-lg bg-[#121319] border border-white/[0.08] text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={cn(
                      'w-10 h-10 rounded-lg font-medium transition-colors',
                      page === pageNum
                        ? 'bg-[#6154f0] text-white'
                        : 'bg-[#121319] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || isLoading}
              className="p-2 rounded-lg bg-[#121319] border border-white/[0.08] text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Total Posts Count */}
        {enablePagination && total > 0 && (
          <p className="text-center text-sm text-zinc-500 mt-4">
            {lang === 'hi'
              ? `${total} पोस्ट में से ${posts.length} दिखा रहे हैं`
              : `Showing ${posts.length} of ${total} posts`}
          </p>
        )}
      </div>
    </section>
  )
}