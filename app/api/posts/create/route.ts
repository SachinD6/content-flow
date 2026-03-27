import { createClient } from '@/lib/supabase/server';
import { writeSanityClient } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('id', user.id)
      .single();

    const body = await request.json();
    const { title, slug, excerpt, content, tags } = body;

    // Validation
    if (!title || !slug || !content) {
      return Response.json(
        { message: 'Title, slug, and content are required' },
        { status: 400 }
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

    // Create author first (upsert - create if doesn't exist)
    const authorId = `author-${user.id}`;
    const authorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';
    const authorSlug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await writeSanityClient.createOrReplace({
      _type: 'author',
      _id: authorId,
      name: authorName,
      slug: {
        _type: 'slug',
        current: authorSlug,
      },
    });

    // Create post in Sanity
    const doc = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      excerpt: excerpt || '',
      body: contentBlocks,
      publishedAt: new Date().toISOString(),
      featured: false,
      tags: tags || [],
      author: {
        _type: 'reference',
        _ref: authorId,
      },
    };

    const result = await writeSanityClient.create(doc);

    return Response.json({ 
      success: true, 
      postId: result._id,
      message: 'Post created successfully' 
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    const message = error instanceof Error ? error.message : 'Failed to create post';
    return Response.json({ message }, { status: 500 });
  }
}
