import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  resultSourceMap: 'withKeyArraySelector',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Record<string, unknown> | string) {
  return builder.image(source);
}

// Server only — NEVER import in client components
export const writeSanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  resultSourceMap: 'withKeyArraySelector',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
  token: process.env.SANITY_API_TOKEN,
});

// Server only — NEVER import in client components
export const previewSanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'previewDrafts',
  resultSourceMap: 'withKeyArraySelector',
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
  token: process.env.SANITY_API_TOKEN,
});
