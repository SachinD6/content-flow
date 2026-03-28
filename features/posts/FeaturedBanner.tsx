'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, Clock, User } from 'lucide-react';
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

      <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Image Section */}
        {post.coverImage ? (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="80px"
              priority
            />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-[#6154f0]/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[#6154f0]/50" />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#6154f0]/20 text-[#766bf3] border-[#6154f0]/30 text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5">
              Featured
            </Badge>
            {formattedDate && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-500">
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
            <h2 className="text-sm sm:text-base font-semibold text-white group-hover/title:text-[#766bf3] transition-colors duration-300 truncate">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt - Hidden on mobile */}
          <p className="text-xs text-zinc-500 truncate hidden sm:block mt-0.5">
            {post.excerpt || 'No excerpt available'}
          </p>
        </div>

        {/* Read Button */}
        <Link
          href={`/dashboard/posts/${post.slug}`}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5",
            "bg-[#6154f0] hover:bg-[#584acf] text-white",
            "rounded-lg text-xs font-medium",
            "transition-all duration-200",
            "group/btn"
          )}
        >
          <span className="hidden sm:inline">Read</span>
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
