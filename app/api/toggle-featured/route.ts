import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { writeSanityClient, sanityClient } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, featured } = body;

    if (typeof postId !== 'string' || typeof featured !== 'boolean') {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    // Fetch the post to verify authorship
    const post = await sanityClient.fetch(
      `*[_type == "post" && _id == $postId][0]{ _id, "authorId": author._ref }`,
      { postId }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Verify the current user is the author
    // authorId format is "author-<uuid>" from Sanity
    const expectedAuthorId = `author-${user.id}`;
    if (post.authorId !== expectedAuthorId) {
      return NextResponse.json(
        { error: 'Forbidden - Only the author can mark this post as featured' },
        { status: 403 }
      );
    }

    // Server-side securely mutates the graphQL/Sanity document
    await writeSanityClient
      .patch(postId)
      .set({ featured })
      .commit();

    return NextResponse.json({ success: true, postId, featured });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}
