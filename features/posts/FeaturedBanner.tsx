'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface FeaturedBannerProps {
  post: Post;
}

export function FeaturedBanner({ post }: FeaturedBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "relative flex items-center gap-6 rounded-[16px] border border-[#6154f0]/30 bg-[#121319] p-4 shadow-xl shadow-[#6154f0]/10 overflow-hidden group transition-all duration-300",
      "hover:border-[#6154f0]/50"
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#6154f0]/10 to-transparent pointer-events-none" />
      
      {post.coverImage && (
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-[8px] border border-white/10 hidden sm:block">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 z-10 space-y-2">
        <Badge variant="secondary" className="bg-[#6154f0]/20 text-[#766bf3] hover:bg-[#6154f0]/30 text-[10px] font-bold tracking-widest uppercase border-transparent">
          Featured
        </Badge>
        <div className="space-y-1">
          <Link href={`/dashboard/posts/${post.slug}`} className="text-lg font-bold text-white hover:text-[#766bf3] transition-colors truncate block">
            {post.title}
          </Link>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
