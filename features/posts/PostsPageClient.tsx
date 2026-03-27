'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePostHog } from 'posthog-js/react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import { sanityClient } from '@/lib/sanity/client';
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries';
import { FeaturedBanner } from '@/features/posts/FeaturedBanner';
import { PostsTable } from '@/features/posts/PostsTable';
import { useDebounce } from '@/hooks/useDebounce';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface PostsPageClientProps {
  showBanner: boolean;
  featuredPost: Post | null;
  initialPosts: Post[];
}

export function PostsPageClient({ showBanner, featuredPost, initialPosts }: PostsPageClientProps) {
  const posthog = usePostHog();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: posts, isLoading, isError, refetch } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    initialData: initialPosts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (posts) {
      posthog.capture('posts_page_viewed', { total_posts: posts.length });
    }
  }, [posts, posthog]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!debouncedSearch) return posts;
    const lowerSearch = debouncedSearch.toLowerCase();
    return posts.filter((post) => post.title.toLowerCase().includes(lowerSearch));
  }, [posts, debouncedSearch]);

  if (isError) {
    toast.error('Failed to load posts');
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#121319] border border-white/5 rounded-[16px]">
        <p className="text-zinc-400 mb-4">Could not load your architectural data.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#6154f0] text-white rounded-[8px] text-sm font-semibold hover:bg-[#584acf] transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showBanner && featuredPost && (
        <FeaturedBanner post={featuredPost} />
      )}

      <div className="rounded-[16px] border border-white/5 bg-[#121319] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full rounded-[8px] border border-white/10 bg-[#0b0c10] pl-10 pr-4 py-2.5 text-[13px] text-zinc-200",
                "placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6154f0]/50 transition-all font-mono"
              )}
            />
          </div>
          <div className="shrink-0 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
            Showing {filteredPosts.length} of {posts?.length || 0} posts
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-white/5 rounded-[8px]">
                <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px] bg-white/5" />
                  <Skeleton className="h-3 w-[200px] bg-white/5" />
                </div>
                <Skeleton className="h-6 w-16 bg-white/5" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12">
             <EmptyState
                icon={FileText}
                title="No posts found"
                description={debouncedSearch ? "Adjust your search parameters." : "Add your first post in Sanity Studio."}
              />
          </div>
        ) : (
          <PostsTable data={filteredPosts} />
        )}
      </div>
    </div>
  );
}
