'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Post } from '@/types';

interface BlogPostCardProps {
  post: Post;
  featured?: boolean;
  horizontal?: boolean;
  isFirst?: boolean;
}

function calculateReadingTime(content?: string): number {
  if (!content) return 3;
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function AuthorAvatar({ name, avatar }: { name: string; avatar?: string | null }) {
  return (
    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-[#6154f0] flex-shrink-0">
      {avatar ? (
        <Image 
          src={avatar} 
          alt={name}
          fill 
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function BlogPostCard({ post, featured = false, horizontal = false, isFirst = false }: BlogPostCardProps) {
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      })
    : null;

  const readingTime = calculateReadingTime(post.excerpt ?? undefined);
  const tags = post.tags ?? [];

  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="flex flex-row gap-5 md:gap-8">
          {/* Image - Left side */}
          <div className="relative w-32 h-32 md:w-56 md:h-40 bg-[#121319] rounded-lg overflow-hidden flex-shrink-0">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="224px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#121319] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <span className="text-lg text-zinc-700">✦</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Content - Right side */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            {tags.length > 0 && (
              <span className="text-xs font-medium text-[#6154f0] uppercase tracking-wider mb-2">
                {tags[0]}
              </span>
            )}
            
            <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-zinc-300 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2 hidden md:block">
              {post.excerpt || 'No excerpt available'}
            </p>
            
            <div className="flex items-center gap-2 flex-wrap">
              <AuthorAvatar name={post.author?.name || 'A'} avatar={post.author?.avatar} />
              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                <span className="text-zinc-300 font-medium">{post.author?.name || 'Unknown'}</span>
                <span className="text-zinc-600">·</span>
                <span>{formattedDate}</span>
                <span className="text-zinc-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Medium-style horizontal article card
  return (
    <Link 
      href={`/posts/${post.slug}`}
      className="group block"
    >
      <article className="flex gap-5 md:gap-6 py-8 border-b border-white/[0.04] last:border-b-0">
        {/* Content - Takes available space */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Author & Meta */}
          <div className="flex items-center gap-2 mb-2">
            <AuthorAvatar name={post.author?.name || 'A'} avatar={post.author?.avatar} />
            <span className="text-sm font-medium text-zinc-300">{post.author?.name || 'Unknown'}</span>
            {formattedDate && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-sm text-zinc-500">{formattedDate}</span>
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 className={`font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors leading-snug ${
            isFirst ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
          }`}>
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-zinc-500 text-sm leading-relaxed mb-3 line-clamp-2">
            {post.excerpt || 'No excerpt available'}
          </p>
          
          {/* Bottom Meta */}
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            {tags.length > 0 && (
              <span className="bg-[#121319] px-2 py-0.5 rounded text-xs">
                {tags[0]}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </span>
          </div>
        </div>
        
        {/* Thumbnail */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-[#121319] rounded-lg overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full bg-[#121319] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-base text-zinc-700">✦</span>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
