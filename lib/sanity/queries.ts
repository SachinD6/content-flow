import { groq } from 'next-sanity'

// Site Settings
export const SITE_SETTINGS_QUERY = groq`
  *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
    siteName,
    siteDescription,
    'logo': logo.asset->url,
    'favicon': favicon.asset->url,
    copyrightText,
    footerDescription,
    socialLinks,
    legalLinks {
      privacy { label, href },
      terms { label, href },
      cookies { label, href }
    },
    headerNav[] {
      label,
      href,
      external,
      requiresAuth,
      authOnly,
      guestOnly
    },
    footerNav[] {
      title,
      items[] {
        label,
        href,
        external,
        requiresAuth
      }
    },
    dashboardNav[] {
      label,
      href,
      external,
      requiresAuth
    },
    authNav[] {
      label,
      href,
      external,
      requiresAuth
    },
    guestNav[] {
      label,
      href,
      external,
      requiresAuth
    }
  }
`

// Pages (by type - home, auth, dashboard)
export const PAGE_BY_TYPE_QUERY = groq`
  *[_type == 'page' && pageType == $pageType][0] {
    _id,
    title,
    pageType,
    description,
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    components,
    // Auth page fields
    brandName,
    tagline,
    features[] { title, description, icon },
    loginPage { title, subtitle, buttonText },
    signupPage { title, subtitle, buttonText },
    oauthProviders[] { name, enabled },
    // Dashboard fields
    dashboardWelcome { message, description },
    stats {
      totalPosts { label },
      subscription { label, proText, freeText }
    },
    // Generic page fields
    'slug': slug.current,
    content,
    publishedAt
  }
`

// Pages (by slug - generic pages)
export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == 'page' && pageType == 'generic' && slug.current == $slug][0] {
    _id,
    title,
    pageType,
    'slug': slug.current,
    description,
    components,
    content,
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    publishedAt
  }
`

// All pages list
export const ALL_PAGES_QUERY = groq`
  *[_type == 'page'] | order(title asc) {
    _id,
    title,
    pageType,
    'slug': slug.current,
    description,
    publishedAt
  }
`

// Posts
export const ALL_POSTS_QUERY = groq`
  *[_type == 'post' && defined(publishedAt) && showOnHome != false] | order(publishedAt desc) {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    publishedAt,
    featured,
    mostViewed,
    showOnHome,
    readingTime,
    tags,
    'authorId': author._ref,
    author->{ name, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`

export const POST_BY_SLUG_QUERY = groq`
  *[_type == 'post' && slug.current == $slug][0] {
    ...,
    author->{ name, bio, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`

export const POSTS_COUNT_QUERY = groq`count(*[_type == 'post'])`

export const FEATURED_POST_QUERY = groq`
  *[_type == 'post' && defined(publishedAt)] {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    publishedAt,
    featured,
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref,
    author->{ name, 'avatar': image.asset->url }
  } | order(featured desc, publishedAt desc)[0]
`

export const MOST_VIEWED_POSTS_QUERY = groq`
  *[_type == 'post' && mostViewed == true && defined(publishedAt)] | order(publishedAt desc) [0...5] {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    'coverImage': coverImage.asset->url,
    author->{ name }
  }
`

export const POST_BY_ID_QUERY = groq`
  *[_type == 'post' && _id == $id][0] {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    body,
    publishedAt,
    featured,
    mostViewed,
    showOnHome,
    tags,
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref,
    'authorId': author._ref,
    metaTitle,
    metaDescription
  }
`

// Authors
export const ALL_AUTHORS_QUERY = groq`
  *[_type == 'author'] | order(name asc) {
    _id,
    name,
    'slug': slug.current,
    bio,
    'avatar': image.asset->url
  }
`

// Language queries
export const ALL_LANGUAGES_QUERY = groq`
  *[_type == 'language'] | order(isDefault desc) {
    _id,
    id,
    title,
    nativeTitle,
    isDefault,
    flag
  }
`

export const DEFAULT_LANGUAGE_QUERY = groq`
  *[_type == 'language' && isDefault == true][0] {
    _id,
    id,
    title,
    nativeTitle,
    isDefault,
    flag
  }
`

// Page by type with language filter
export const PAGE_BY_TYPE_AND_LANGUAGE_QUERY = groq`
  *[_type == 'page' && pageType == $pageType && (language == null || language->id == $language)][0] {
    _id,
    title,
    pageType,
    description,
    components,
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    language->{ _id, id, title, nativeTitle },
    translationOf->{ _id, title },
    // Auth page fields
    brandName,
    tagline,
    features[] { title, description, icon },
    loginPage { title, subtitle, buttonText },
    signupPage { title, subtitle, buttonText },
    oauthProviders[] { name, enabled },
    // Dashboard fields
    dashboardWelcome { message, description },
    stats {
      totalPosts { label },
      subscription { label, proText, freeText }
    },
    // Generic page fields
    'slug': slug.current,
    content,
    publishedAt
  }
`

// Page by slug with language filter
export const PAGE_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[_type == 'page' && pageType == 'generic' && slug.current == $slug && (language == null || language->id == $language)][0] {
    _id,
    title,
    pageType,
    'slug': slug.current,
    description,
    components,
    content,
    language->{ _id, id, title, nativeTitle },
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    publishedAt
  }
`

// Posts with language filter
export const ALL_POSTS_BY_LANGUAGE_QUERY = groq`
  *[_type == 'post' && defined(publishedAt) && showOnHome != false && (language == null || language->id == $language)] | order(publishedAt desc) {
    _id,
    title,
    'slug': slug.current,
    excerpt,
    publishedAt,
    featured,
    tags,
    language->{ _id, id, title, nativeTitle },
    author->{ name, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url
  }
`

export const POST_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[_type == 'post' && slug.current == $slug && (language == null || language->id == $language)][0] {
    ...,
    language->{ _id, id, title, nativeTitle },
    author->{ name, bio, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`

// Site settings with languages
export const SITE_SETTINGS_WITH_LANGUAGES_QUERY = groq`
  *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
    siteName,
    siteDescription,
    'logo': logo.asset->url,
    'favicon': favicon.asset->url,
    copyrightText,
    footerDescription,
    socialLinks,
    legalLinks {
      privacy { label, href },
      terms { label, href },
      cookies { label, href }
    },
    headerNav[] {
      label,
      href,
      external,
      requiresAuth,
      authOnly,
      guestOnly
    },
    footerNav[] {
      title,
      items[] {
        label,
        href,
        external,
        requiresAuth
      }
    },
    dashboardNav[] {
      label,
      href,
      external,
      requiresAuth
    },
    authNav[] {
      label,
      href,
      external,
      requiresAuth
    },
    guestNav[] {
      label,
      href,
      external,
      requiresAuth
    },
    supportedLanguages[] -> {
      _id,
      id,
      title,
      nativeTitle,
      isDefault,
      flag
    },
    defaultLanguage-> {
      _id,
      id,
      title,
      nativeTitle,
      isDefault,
      flag
    }
  }
`

// Combined home page data
export const HOME_PAGE_DATA_QUERY = groq`
  {
    'settings': *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
      siteName,
      siteDescription,
      'logo': logo.asset->url,
      copyrightText,
      footerDescription,
      legalLinks {
        privacy { label, href },
        terms { label, href }
      },
      headerNav[] { label, href, external, requiresAuth, authOnly, guestOnly },
      footerNav[] { title, items[] { label, href, external, requiresAuth } },
      guestNav[] { label, href, external, requiresAuth }
    },
    'homePage': *[_type == 'page' && pageType == 'home' && (language == null || language->id == $language)][0] {
      _id,
      title,
      components
    },
    'posts': *[_type == 'post' && defined(publishedAt) && showOnHome != false && (language == null || language->id == $language)] | order(publishedAt desc) [0...20] {
      _id,
      title,
      'slug': slug.current,
      excerpt,
      publishedAt,
      featured,
      tags,
      author->{ name, 'avatar': image.asset->url },
      'coverImage': coverImage.asset->url
    }
  }
`