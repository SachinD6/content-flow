import { draftMode } from 'next/headers';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient, previewSanityClient } from '@/lib/sanity/client';
import { FEATURED_POST_QUERY, ALL_POSTS_QUERY } from '@/lib/sanity/queries';
import { PostsPageClient } from '@/features/posts/PostsPageClient';
import { SyncButton } from '@/features/posts/SyncButton';
import { PostHog } from 'posthog-node';
import type { Post } from '@/types';
import { Badge } from '@/components/ui/badge';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout protection redirects
  }

  // Check if draft mode is enabled
  const { isEnabled: isDraftMode } = await draftMode();

  // Show featured banner if there's a featured post (out of the box experience)
  // Feature flag can be used to hide it for A/B testing if needed
  let showBanner = true; // Default to showing featured posts

  // Use preview client if draft mode is enabled, otherwise use regular client
  const client = isDraftMode ? previewSanityClient : sanityClient;

  // Pre-fetch specific architectural data serverside dynamically
  // This avoids CORS errors in the browser by fetching data on the backend
  const [featuredPost, allPosts] = await Promise.all([
    client.fetch<Post>(FEATURED_POST_QUERY),
    client.fetch<Post[]>(ALL_POSTS_QUERY)
  ]);

  return (
    <>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            Blog Posts
            <Badge className="bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 uppercase tracking-widest text-[9px]">
              via Sanity GROQ
            </Badge>
            {isDraftMode && (
              <Badge className="bg-amber-500/10 border border-amber-500/20 text-amber-400">
                Draft Mode
              </Badge>
            )}
          </div>
        }
        description="Manage your technical documentation and editorial content across all production clusters."
      >
        <SyncButton />
        <Link
          href="/dashboard/posts/new"
          className="flex items-center gap-2 px-6 py-2 bg-[#6154f0] hover:bg-[#584acf] rounded-[8px] text-[12px] font-bold text-white transition-all shadow-lg shadow-[#6154f0]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Post
        </Link>
      </PageHeader>
      
      <div className="mt-8">
        <PostsPageClient 
          showBanner={showBanner} 
          featuredPost={featuredPost}
          initialPosts={allPosts}
          isDraftMode={isDraftMode}
        />
      </div>
    </>
  );
}
