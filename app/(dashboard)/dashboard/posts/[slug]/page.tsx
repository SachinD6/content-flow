import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';

import { sanityClient, previewSanityClient } from '@/lib/sanity/client';
import { POST_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { PostViewTracker } from '@/features/posts/PostViewTracker';
import type { Post } from '@/types';
import type { PortableTextBlock } from '@portabletext/types';

interface ExtendedPost extends Post {
  body: PortableTextBlock[];
}

const PortableTextRenderer = dynamic(
  () => import('@/features/posts/PortableTextRenderer'),
  { loading: () => <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div> }
);

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? previewSanityClient : sanityClient;
  const post = await client.fetch<Post>(POST_BY_SLUG_QUERY, { slug });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | ContentFlow`,
    description: post.excerpt,
  };
}

export default async function SinglePostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? previewSanityClient : sanityClient;
  const post = await client.fetch<ExtendedPost | null>(POST_BY_SLUG_QUERY, { slug });

  if (!post) {
    notFound();
  }

  return (
    <>
      <PostViewTracker slug={post.slug} title={post.title} />

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700 fade-in pb-16 sm:pb-24 px-4 sm:px-0">
        {/* Preview Mode Banner */}
        {isDraftMode && (
          <div className="rounded-[12px] sm:rounded-[16px] border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-amber-400 text-base sm:text-lg">⚠️</span>
                <span className="text-amber-200 font-medium text-sm sm:text-base">
                  Preview Mode — You are viewing draft content
                </span>
              </div>
              <a
                href="/api/draft/disable"
                className="px-3 sm:px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-[8px] text-xs sm:text-sm font-semibold transition-colors text-center"
              >
                Exit Preview
              </a>
            </div>
          </div>
        )}

        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-zinc-500 py-2 border-b border-white/5">
          <Link href="/dashboard/posts" className="flex items-center gap-2 hover:text-white transition-colors uppercase">
            <ArrowLeft className="h-3 w-3" />
            <span className="hidden sm:inline">Back to Posts</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Post Metadata Headers */}
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-[#121319] hover:bg-white/10 text-zinc-400 hover:text-white text-[8px] sm:text-[9px] uppercase font-bold tracking-widest border border-white/10 rounded-[6px]">
                {tag}
              </Badge>
            ))}
            {post.featured && (
              <Badge className="bg-[#6154f0]/20 text-[#766bf3] text-[8px] sm:text-[9px] uppercase font-bold tracking-widest border border-transparent">
                Featured
              </Badge>
            )}
            {isDraftMode && (
              <Badge className="bg-amber-500/20 text-amber-400 text-[8px] sm:text-[9px] uppercase font-bold tracking-widest border border-transparent">
                Draft
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15] break-words">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-zinc-400 pt-2 sm:pt-4">
            <div className="flex items-center gap-2 sm:gap-3 bg-[#121319] p-2 pr-3 sm:pr-4 rounded-full border border-white/5 w-fit">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full shrink-0">
                {post.author?.avatar ? (
                  <Image src={post.author.avatar!} alt={post.author.name} fill sizes="32px" className="object-cover" />
                ) : (
                  <div className="bg-[#6154f0] w-full h-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {post.author?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white text-[11px] sm:text-[12px] truncate">{post.author?.name || 'Unknown Author'}</span>
                <span className="text-[9px] sm:text-[10px] truncate max-w-[120px] sm:max-w-[150px]">{post.author?.bio || "Architect"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <Clock className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wide mt-0.5">
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(post.publishedAt || new Date()))}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-[12px] sm:rounded-[16px] shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent z-10 h-20 sm:h-32 bottom-0" />
            <Image
              src={post.coverImage}
              alt="Cover Image"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Body Render Engine */}
        <article className="pt-8">
          <PortableTextRenderer value={post.body} />
        </article>

      </div>
    </>
  );
}
