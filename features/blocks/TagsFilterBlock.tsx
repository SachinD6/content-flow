'use client'

import { useState } from 'react'
import { BlogPostCard } from '@/features/posts/BlogPostCard'

interface TagsFilterBlockProps {
  title?: string
  showAllTag?: boolean
  allTagLabel?: string
  tagsSource?: 'all' | 'manual'
  selectedTags?: string[]
  layout?: 'sidebar' | 'top' | 'grid'
  postsLayout?: 'grid' | 'list' | 'masonry'
  columns?: number
  postsPerTag?: number
  showPostCount?: boolean
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
  }
  posts?: Array<{
    _id: string
    title: string
    slug: string
    excerpt?: string | null
    publishedAt?: string
    featured?: boolean
    tags?: string[]
    author?: { name: string; avatar?: string }
    coverImage?: string
  }>
  lang?: string
}

export function TagsFilterBlock({
  title = 'Browse by Topic',
  showAllTag = true,
  allTagLabel = 'All Posts',
  tagsSource = 'all',
  selectedTags = [],
  layout = 'sidebar',
  columns = 3,
  postsPerTag = 6,
  showPostCount = true,
  // These props are reserved for future use
  // showExcerpt, showAuthor, showDate
  styles,
  posts = [],
  lang = 'en',
}: TagsFilterBlockProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Get all unique tags from posts
  const allTags = tagsSource === 'manual' && selectedTags.length > 0
    ? selectedTags
    : Array.from(new Set(posts.flatMap(post => post.tags || []))).sort()

  // Count posts per tag
  const tagCounts: Record<string, number> = {}
  allTags.forEach(tag => {
    tagCounts[tag] = posts.filter(post => post.tags?.includes(tag)).length
  })

  // Filter posts by active tag
  const filteredPosts = activeTag
    ? posts.filter(post => post.tags?.includes(activeTag))
    : posts

  // Limit posts
  const displayPosts = filteredPosts.slice(0, postsPerTag)

  const getPaddingClass = (padding?: string) => {
    const classes: Record<string, string> = {
      none: '',
      xs: 'py-4',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
      '2xl': 'py-32',
    }
    return classes[padding || 'md'] || 'py-12'
  }

  const getMaxWidthClass = (width?: string) => {
    const classes: Record<string, string> = {
      narrow: 'max-w-4xl',
      medium: 'max-w-5xl',
      wide: 'max-w-6xl',
      xwide: 'max-w-7xl',
      full: 'max-w-full',
    }
    return classes[width || 'wide'] || 'max-w-6xl'
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-2 lg:grid-cols-3'

  const renderTags = () => (
    <div className={layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-1'}>
      {showAllTag && (
        <button
          onClick={() => setActiveTag(null)}
          className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTag === null
              ? 'bg-[#6154f0] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{allTagLabel}</span>
          {showPostCount && (
            <span className="ml-2 text-xs opacity-70">{posts.length}</span>
          )}
        </button>
      )}
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => setActiveTag(tag)}
          className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTag === tag
              ? 'bg-[#6154f0] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{tag}</span>
          {showPostCount && (
            <span className="ml-2 text-xs opacity-70">{tagCounts[tag] || 0}</span>
          )}
        </button>
      ))}
    </div>
  )

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-6 ${getMaxWidthClass(styles?.maxWidth)}`}>
        {title && (
          <h2 className="text-2xl font-bold text-white mb-8">{title}</h2>
        )}

        {layout === 'sidebar' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Topics</h3>
                {renderTags()}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className={`grid ${gridCols} gap-6`}>
                {displayPosts.map((post) => (
                  <BlogPostCard
                    key={post._id}
                    post={post}
                    lang={lang}
                  />
                ))}
              </div>
              {filteredPosts.length > postsPerTag && (
                <div className="mt-8 text-center">
                  <button className="text-[#6154f0] hover:text-[#7a6ef0] text-sm font-medium">
                    Load More ({filteredPosts.length - postsPerTag} more)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {layout === 'top' && (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {showAllTag && (
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTag === null
                      ? 'bg-[#6154f0] text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {allTagLabel}
                </button>
              )}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTag === tag
                      ? 'bg-[#6154f0] text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tag} {showPostCount && `(${tagCounts[tag] || 0})`}
                </button>
              ))}
            </div>
            <div className={`grid ${gridCols} gap-6`}>
              {displayPosts.map((post) => (
                <BlogPostCard
                  key={post._id}
                  post={post}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}

        {layout === 'grid' && (
          <div className="space-y-8">
            {renderTags()}
            <div className={`grid ${gridCols} gap-6`}>
              {displayPosts.map((post) => (
                <BlogPostCard
                  key={post._id}
                  post={post}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
