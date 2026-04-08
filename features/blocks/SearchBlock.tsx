'use client'

import { useState } from 'react'
import { Search, X, FileText } from 'lucide-react'
import Link from 'next/link'
import { getLocalizedPath } from '@/lib/i18n/translations'

interface SearchBlockProps {
  title?: string
  placeholder?: string
  buttonText?: string
  searchScope?: 'posts' | 'all'
  resultsLayout?: 'inline' | 'redirect'
  showExcerpt?: boolean
  showAuthor?: boolean
  showDate?: boolean
  limit?: number
  styles?: {
    backgroundType?: string
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    maxWidth?: string
    textAlign?: string
    borderRadius?: string
  }
  posts?: Array<{
    _id: string
    title: string
    slug: string
    excerpt?: string | null
    publishedAt?: string
    author?: { name: string }
    tags?: string[]
  }>
  lang?: string
}

export function SearchBlock({
  title,
  placeholder = 'Search posts...',
  buttonText = 'Search',
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  limit = 10,
  styles,
  posts = [],
  lang = 'en',
}: SearchBlockProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof posts>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    const searchTerm = query.toLowerCase().trim()
    
    const filtered = posts.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(searchTerm)
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm)
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      return titleMatch || excerptMatch || tagMatch
    }).slice(0, limit)
    
    setResults(filtered)
    setHasSearched(true)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  const postHref = (slug: string) => getLocalizedPath(`/posts/${slug}`, lang)

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
      narrow: 'max-w-2xl',
      medium: 'max-w-3xl',
      wide: 'max-w-4xl',
      xwide: 'max-w-5xl',
      full: 'max-w-full',
    }
    return classes[width || 'medium'] || 'max-w-3xl'
  }

  const bgStyle = styles?.backgroundType === 'color' 
    ? { backgroundColor: styles.backgroundColor } 
    : {}

  return (
    <section 
      className={`${getPaddingClass(styles?.paddingTop)} ${getPaddingClass(styles?.paddingBottom)}`}
      style={bgStyle}
    >
      <div className={`mx-auto px-4 sm:px-6 ${getMaxWidthClass(styles?.maxWidth)}`}>
        {title && (
          <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-6 ${styles?.textAlign === 'center' ? 'text-center' : ''}`}>
            {title}
          </h2>
        )}
        
        <form onSubmit={handleSearch} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-10 py-3 sm:py-3.5 bg-[#121319] border border-white/[0.08] rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6154f0]/50 transition-colors text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 sm:py-3.5 bg-[#6154f0] text-white font-medium rounded-lg hover:bg-[#5841e8] transition-colors text-base whitespace-nowrap"
            >
              {buttonText}
            </button>
          </div>
        </form>

        {hasSearched && (
          <div className="mt-8">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-zinc-500 mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} found for &quot;{query}&quot;
                </p>
                <div className="space-y-3">
                  {results.map((post) => (
                    <Link
                      key={post._id}
                      href={postHref(post.slug)}
                      className="block p-4 sm:p-5 bg-[#121319] border border-white/[0.08] rounded-lg hover:border-[#6154f0]/50 transition-colors"
                    >
                      <h3 className="text-base sm:text-lg font-medium text-white mb-1">{post.title}</h3>
                      {showExcerpt && post.excerpt && (
                        <p className="text-sm text-zinc-400 line-clamp-2 mb-2">{post.excerpt}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-zinc-500">
                        {showAuthor && post.author?.name && (
                          <span>{post.author.name}</span>
                        )}
                        {showDate && post.publishedAt && (
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-2">No posts available</p>
                <p className="text-zinc-500 text-sm">Create some posts in Sanity Studio to enable search.</p>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-zinc-400">No results found for &quot;{query}&quot;</p>
                <p className="text-zinc-500 text-sm mt-2">Try different keywords or check spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
