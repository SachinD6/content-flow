import { notFound, redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { sanityClient } from '@/lib/sanity/client';
import { EditPostForm } from '@/features/posts/EditPostForm';
import type { Post } from '@/types';

interface ExtendedPost extends Post {
  _id: string;
  body?: unknown[];
  authorId?: string;
}

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { slug } = await params;

  // Fetch post with full body content
  const post = await sanityClient.fetch<ExtendedPost & { author?: { _ref?: string } }>(`
    *[_type == 'post' && slug.current == $slug][0] {
      _id,
      title,
      'slug': slug.current,
      excerpt,
      body,
      publishedAt,
      featured,
      tags,
      'coverImage': coverImage.asset->url,
      'authorId': author._ref
    }
  `, { slug });

  if (!post) {
    notFound();
  }

  // Check if user is the author
  const authorId = `author-${user.id}`;
  if (post.authorId !== authorId) {
    // User is not the author, redirect to posts list
    redirect('/dashboard/posts');
  }

  return (
    <>
      <PageHeader
        title="Edit Post"
        description={`Editing: ${post.title}`}
      />
      <div className="mt-8">
        <EditPostForm post={post} />
      </div>
    </>
  );
}
