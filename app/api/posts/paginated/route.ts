import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

interface PaginatedPostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '6', 10)))
    const language = searchParams.get('language') || 'en'
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || null
    const authorId = searchParams.get('author') || null
    const postSource = searchParams.get('postSource') || 'all'

    // Build the filter conditions
    const filters: string[] = [
      "_type == 'post'",
      'defined(publishedAt)',
      'showOnHome != false',
    ]

    // Language filter
    filters.push(`(language == null || language->id == $language)`)

    // Post source filters
    if (postSource === 'featured') {
      filters.push('featured == true')
    }
    if (postSource === 'tags' && tags && tags.length > 0) {
      filters.push(`count(tags[@ in $tags]) > 0`)
    }
    if (postSource === 'author' && authorId) {
      filters.push(`author._ref == $authorId`)
    }

    const filterString = filters.join(' && ')

    // Count query
    const countQuery = groq`count(*[${filterString}])`

    // Posts query with pagination
    const postsQuery = groq`
      *[${filterString}] | order(publishedAt desc) [${(page - 1) * limit}...${page * limit}] {
        _id,
        title,
        'slug': slug.current,
        excerpt,
        publishedAt,
        featured,
        readingTime,
        tags,
        author->{ name, 'avatar': image.asset->url },
        'coverImage': coverImage.asset->url,
        language->{ _id, id, title, nativeTitle }
      }
    `

    // Execute queries
    const params: Record<string, unknown> = {
      language,
      tags: tags || [],
      authorId,
    }

    const [total, posts] = await Promise.all([
      sanityClient.fetch<number>(countQuery, params),
      sanityClient.fetch<Post[]>(postsQuery, params),
    ])

    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    const response: PaginatedPostsResponse = {
      posts,
      total,
      page,
      totalPages,
      hasMore,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching paginated posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}