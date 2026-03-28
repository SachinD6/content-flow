import { createClient } from '@/lib/supabase/server';
import { writeSanityClient, sanityClient } from '@/lib/sanity/client';
import { POST_BY_ID_QUERY } from '@/lib/sanity/queries';

export async function PUT(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { postId, title, slug, excerpt, content, tags, coverImage, published, featured } = body;

    if (!postId) {
      return Response.json({ message: 'Post ID is required' }, { status: 400 });
    }

    // Fetch the post to check ownership
    const post = await sanityClient.fetch(POST_BY_ID_QUERY, { id: postId });

    if (!post) {
      return Response.json({ message: 'Post not found' }, { status: 404 });
    }

    // Check if user is the author
    const authorId = `author-${user.id}`;
    if (post.authorId !== authorId) {
      return Response.json(
        { message: 'You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Convert plain text content to Portable Text blocks
    const contentBlocks = content.split('\n\n').filter((p: string) => p.trim()).map((paragraph: string) => ({
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(7),
          text: paragraph.trim(),
          marks: [],
        },
      ],
      markDefs: [],
    }));

    // Build update document
    const updateDoc: Record<string, unknown> = {
      title,
      slug: { _type: 'slug', current: slug },
      excerpt: excerpt || '',
      body: contentBlocks,
      featured: featured || false,
      tags: tags || [],
    };

    // Handle cover image (should be a Sanity asset ID)
    if (coverImage && typeof coverImage === 'string') {
      if (coverImage.startsWith('image-')) {
        updateDoc.coverImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: coverImage,
          },
        };
      } else if (coverImage === 'remove') {
        // Remove cover image
        updateDoc.coverImage = null;
      }
    }

    // Handle published status
    if (published && !post.publishedAt) {
      // Was draft, now publishing
      updateDoc.publishedAt = new Date().toISOString();
    } else if (!published && post.publishedAt) {
      // Was published, now draft
      updateDoc.publishedAt = null;
    }

    await writeSanityClient.patch(postId).set(updateDoc).commit();

    return Response.json({
      success: true,
      message: published ? 'Post updated and published' : 'Draft updated successfully',
    });
  } catch (error) {
    console.error('Failed to update post:', error);
    const message = error instanceof Error ? error.message : 'Failed to update post';
    return Response.json({ message }, { status: 500 });
  }
}
