import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient } from '@/lib/sanity/client';
import { FEATURED_POST_QUERY } from '@/lib/sanity/queries';
import { PostsPageClient } from '@/features/posts/PostsPageClient';
import { PostHog } from 'posthog-node';
import type { Post } from '@/types';

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
      // Await evaluation against specific user context globally
      const isEnabled = await posthogServer.isFeatureEnabled('show-featured-banner', user.id);
      showBanner = isEnabled === true;
      await posthogServer.shutdown(); // Free pipeline
    } catch {
      showBanner = false;
    }
  }

  // Pre-fetch specific architectural data serverside dynamically
  const featuredPost = await sanityClient.fetch<Post>(FEATURED_POST_QUERY);

  return (
    <>
      <PageHeader
        title="Blog Posts"
        description="Manage your technical documentation and editorial content across all production clusters."
      />
      
      <div className="mt-8">
        <PostsPageClient 
          showBanner={showBanner} 
          featuredPost={featuredPost} 
        />
      </div>
    </>
  );
}
