import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries';

export async function GET() {
  try {
    const posts = await sanityClient.fetch(ALL_POSTS_QUERY);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
