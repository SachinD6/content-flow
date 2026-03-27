import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient } from '@/lib/sanity/client';
import { FEATURED_POST_QUERY, ALL_POSTS_QUERY } from '@/lib/sanity/queries';
import { PostsPageClient } from '@/features/posts/PostsPageClient';
import { PostHog } from 'posthog-node';
import type { Post } from '@/types';
import { Badge } from '@/components/ui/badge';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout protection redirects
  }

  // Evaluate Server-Side Feature Flag securely
  let showBanner = false;
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    try {
      const posthogServer = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      });
      const isEnabled = await posthogServer.isFeatureEnabled('show-featured-banner', user.id);
      showBanner = isEnabled === true;
      await posthogServer.shutdown();
    } catch {
      showBanner = false;
    }
  }

  // Pre-fetch specific architectural data serverside dynamically
  // This avoids CORS errors in the browser by fetching data on the backend
  const [featuredPost, allPosts] = await Promise.all([
    sanityClient.fetch<Post>(FEATURED_POST_QUERY),
    sanityClient.fetch<Post[]>(ALL_POSTS_QUERY)
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
          </div>
        }
        description="Manage your technical documentation and editorial content across all production clusters."
      >
        <a 
          href="/dashboard/posts"
          className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#121319] hover:bg-white/5 rounded-[8px] text-[12px] font-bold text-zinc-300 transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
          Sync
        </a>
        <a 
          href="http://localhost:3333/intent/create/template=post;type=post/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-2 bg-[#6154f0] hover:bg-[#584acf] rounded-[8px] text-[12px] font-bold text-white transition-all shadow-lg shadow-[#6154f0]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Post
        </a>
      </PageHeader>
      
      <div className="mt-8">
        <PostsPageClient 
          showBanner={showBanner} 
          featuredPost={featuredPost}
          initialPosts={allPosts} 
        />
      </div>
    </>
  );
}
