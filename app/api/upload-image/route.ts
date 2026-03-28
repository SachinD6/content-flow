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

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return Response.json({ message: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ message: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ message: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Sanity
    const asset = await writeSanityClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return Response.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    });
  } catch (error) {
    console.error('Failed to upload image:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return Response.json({ message }, { status: 500 });
  }
}
