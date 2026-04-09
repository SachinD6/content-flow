'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface FeaturedBannerProps {
  post: Post;
}

export function FeaturedBanner({ post }: FeaturedBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <div className={cn(
      "relative rounded-2xl border border-[#6154f0]/30 bg-gradient-to-br from-[#121319] via-[#121319] to-[#6154f0]/5 p-0 shadow-2xl shadow-[#6154f0]/10 overflow-hidden group",
      "hover:border-[#6154f0]/50 hover:shadow-[#6154f0]/20 transition-all duration-500"
    )}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6154f0]/5 via-transparent to-[#766bf3]/5 opacity-50" />
      
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6154f0] to-transparent" />

      <div className="relative flex flex-col items-start gap-3 p-3 sm:p-4 md:flex-row md:items-center md:gap-4">
        {/* Image Section */}
        {post.coverImage ? (
          <div className="relative h-16 w-full overflow-hidden rounded-lg sm:h-20 md:h-20 md:w-20 md:shrink-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 767px) 100vw, 80px"
              priority
            />
          </div>
        ) : (
          <div className="flex h-16 w-full items-center justify-center rounded-lg bg-[#6154f0]/10 sm:h-20 md:h-20 md:w-20 md:shrink-0">
            <Sparkles className="h-6 w-6 text-[#6154f0]/50" />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-[#6154f0]/20 text-[#766bf3] border-[#6154f0]/30 text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5">
              Featured
            </Badge>
            {formattedDate && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock className="h-3 w-3" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <Link 
            href={`/dashboard/posts/${post.slug}`} 
            className="group/title block"
          >
            <h2 className="line-clamp-2 text-sm font-semibold text-white transition-colors duration-300 group-hover/title:text-[#766bf3] sm:text-base">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt - Hidden on mobile */}
          <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block line-clamp-2">
            {post.excerpt || 'No excerpt available'}
          </p>
        </div>

        {/* Read Button */}
        <Link
          href={`/dashboard/posts/${post.slug}`}
          className={cn(
            "inline-flex items-center gap-1.5 self-stretch px-3 py-2 md:self-auto",
            "bg-[#6154f0] hover:bg-[#584acf] text-white",
            "justify-center rounded-lg text-xs font-medium md:shrink-0",
            "transition-all duration-200",
            "group/btn"
          )}
        >
          <span>Read</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-20 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6154f0]/30 to-transparent" />
    </div>
  );
}
