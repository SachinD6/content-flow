import { draftMode } from "next/headers";
import { sanityClient } from "@/lib/sanity/client";
import { ALL_POSTS_QUERY } from "@/lib/sanity/queries";
import { getHomePageData } from "@/lib/sanity/content";
import { createClient } from "@/lib/supabase/server";
import { Header, Footer } from "@/features/layout";
import { BlogPostCard } from "@/features/posts/BlogPostCard";
import { BlogContent } from "@/features/posts/BlogContent";
import type { Post } from "@/types";

export default async function BlogHomePage() {
  const { isEnabled: isDraftMode } = await draftMode();

  // Fetch CMS content
  const cmsData = await getHomePageData();
  const { settings, navigation, homePage, posts } = cmsData;

  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile if logged in
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      userProfile = {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name || undefined,
        avatarUrl: profile.avatar_url || undefined,
      };
    }
  }

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || [])),
  ).sort();

  // Use featured post from CMS, or fall back to first featured post, or first post
  const featuredPost = homePage.featuredPost || posts.find((post) => post.featured) || posts[0];
  const remainingPosts = posts.filter((post) => post._id !== featuredPost?._id);

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <Header
        siteName={settings?.siteName}
        headerNav={navigation?.headerNav ?? undefined}
        guestNav={navigation?.guestNav ?? undefined}
        authNav={navigation?.authNav ?? undefined}
        user={userProfile}
      />

      {isDraftMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20">
          <div className="mx-auto max-w-6xl px-12 lg:px-32 py-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-200 text-sm">
                Preview Mode — Draft content visible
              </span>
              <a
                href="/api/draft/disable"
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                Exit Preview
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-12 lg:px-32 py-12">
        {homePage.showFeaturedPost !== false && featuredPost && (
          <section className="my-16 py-12 border-y border-white/[0.04]">
            <div className="mb-8">
              <span className="text-xs font-semibold text-[#6154f0] uppercase tracking-wider">
                {homePage.heroSection?.featuredLabel ?? 'Featured Story'}
              </span>
            </div>
            <BlogPostCard post={featuredPost} featured />
          </section>
        )}

        <BlogContent
          posts={remainingPosts}
          featuredPost={featuredPost}
          allTags={allTags}
          title={homePage.blogSection?.title ?? 'Latest Stories'}
          subtitle={homePage.blogSection?.subtitle ?? 'Thoughts, tutorials, and insights'}
          emptyMessage={homePage.blogSection?.emptyMessage ?? 'No stories found'}
          emptyDescription={homePage.blogSection?.emptyDescription ?? 'Try adjusting your search'}
          latestArticlesLabel={homePage.blogSection?.latestArticlesLabel ?? 'Latest Articles'}
          discoverLabel={homePage.blogSection?.discoverLabel ?? 'Discover'}
        />
      </main>

      <Footer
        siteName={settings?.siteName}
        footerDescription={settings?.footerDescription}
        copyrightText={settings?.copyrightText}
        legalLinks={settings?.legalLinks}
        footerNav={navigation?.footerNav ?? undefined}
        footerCTAButtons={homePage.footerCTA?.buttons ?? undefined}
        newsletterSection={homePage.newsletterSection ?? undefined}
        user={userProfile}
      />
    </div>
  );
}