import { draftMode } from 'next/headers';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { sanityClient } from '@/lib/sanity/client';
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries';
import { BlogPostCard } from '@/features/posts/BlogPostCard';
import { BlogContent } from '@/features/posts/BlogContent';
import type { Post } from '@/types';

export default async function BlogHomePage() {
  const { isEnabled: isDraftMode } = await draftMode();
  
  const posts = await sanityClient.fetch<Post[]>(ALL_POSTS_QUERY);
  
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || []))).sort();
  
  const featuredPost = posts.find(post => post.featured) || posts[0];
  const remainingPosts = posts.filter(post => post._id !== featuredPost?._id);

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-12 lg:px-32">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6154f0]">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-lg font-bold text-white">ContentFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Articles</Link>
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
              <Link 
                href="/login" 
                className="text-sm font-medium text-white bg-[#6154f0] px-4 py-2 rounded-full hover:bg-[#5841e8] transition-colors"
              >
                Write
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {isDraftMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20">
          <div className="mx-auto max-w-6xl px-12 lg:px-32 py-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-200 text-sm">Preview Mode — Draft content visible</span>
              <a href="/api/draft/disable" className="text-sm text-amber-400 hover:text-amber-300">
                Exit Preview
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-12 lg:px-32 py-12">
        {featuredPost && (
          <section className="my-16 py-12 border-y border-white/[0.04]">
            <div className="mb-8">
              <span className="text-xs font-semibold text-[#6154f0] uppercase tracking-wider">Featured Story</span>
            </div>
            <BlogPostCard post={featuredPost} featured />
          </section>
        )}

        <BlogContent 
          posts={remainingPosts} 
          featuredPost={featuredPost}
          allTags={allTags}
        />
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/[0.04] mt-20">
        <div className="mx-auto max-w-6xl px-12 lg:px-32 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6154f0]">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">ContentFlow</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">Articles</Link>
              <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-zinc-600">© 2026 ContentFlow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
