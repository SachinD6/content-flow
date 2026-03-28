import { groq } from 'next-sanity';

export const ALL_POSTS_QUERY = groq`
  *[_type == 'post' && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    publishedAt,
    featured,
    tags,
    'authorId': author._ref,
    author->{ name, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == 'post' && slug.current == $slug][0] {
    ...,
    author->{ name, bio, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`;

export const POSTS_COUNT_QUERY = groq`count(*[_type == 'post'])`;

export const FEATURED_POST_QUERY = groq`
  *[_type == "post" && featured == true && defined(publishedAt)] | order(publishedAt desc)[0] {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`;

export const POST_BY_ID_QUERY = groq`
  *[_type == 'post' && _id == $id][0] {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    body,
    publishedAt,
    featured,
    tags,
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref,
    'authorId': author._ref
  }
`;
