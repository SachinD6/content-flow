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
    }
  }
`

// Navigation
export const NAVIGATION_QUERY = groq`
  *[_type == 'navigation' && _id == 'navigation'][0] {
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

// Home Page
export const HOME_PAGE_QUERY = groq`
  *[_type == 'homePage' && _id == 'homePage'][0] {
    heroSection {
      featuredLabel,
      headline,
      subheadline
    },
    ctaButtons[] {
      label,
      href,
      variant,
      external,
      requiresAuth
    },
    blogSection {
      title,
      subtitle,
      emptyMessage,
      emptyDescription,
      latestArticlesLabel,
      discoverLabel
    },
    newsletterSection {
      heading,
      description,
      placeholder,
      buttonText,
      enabled
    },
    footerCTA {
      enabled,
      heading,
      description,
      buttons[] {
        label,
        href,
        variant,
        external,
        requiresAuth
      }
    },
    featuredPost->{
      _id,
      title,
      'slug': slug.current,
      excerpt,
      'coverImage': coverImage.asset->url,
      author->{ name, 'avatar': image.asset->url }
    },
    showFeaturedPost,
    postsPerPage,
    defaultPostOrder
  }
`

// Auth Pages
export const AUTH_PAGES_QUERY = groq`
  *[_type == 'authPages' && _id == 'authPages'][0] {
    brandName,
    tagline,
    features[] {
      title,
      description,
      icon
    },
    loginPage {
      title,
      subtitle,
      buttonText,
      alternateText,
      alternateLinkText
    },
    signupPage {
      title,
      subtitle,
      buttonText,
      alternateText,
      alternateLinkText
    },
    oauthProviders[] {
      name,
      enabled
    },
    legalLinks {
      terms,
      termsUrl,
      privacy,
      privacyUrl,
      security,
      securityUrl
    },
    footer {
      backedByText,
      poweredByText
    }
  }
`

// Dashboard Settings
export const DASHBOARD_SETTINGS_QUERY = groq`
  *[_type == 'dashboardSettings' && _id == 'dashboardSettings'][0] {
    brandName,
    tagline,
    welcomeMessage,
    welcomeDescription,
    stats {
      totalPosts { label, icon },
      subscription { label, icon, proText, freeText },
      profileComplete { label, icon }
    },
    activitySection {
      title,
      viewAllLink,
      emptyMessage,
      tableHeaders { title, author, date }
    },
    defaultAuthor
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
    displayOrder,
    homePageOrder,
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
    homePageOrder,
    displayOrder,
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref,
    author->{ name, 'avatar': image.asset->url }
  } | order(featured desc, homePageOrder asc, publishedAt desc)[0]
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
    displayOrder,
    homePageOrder,
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

// Combined query for home page - fetches everything in one request
export const HOME_PAGE_DATA_QUERY = groq`
{
  'settings': *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
    siteName,
    siteDescription,
    'logo': logo.asset->url,
    copyrightText,
    footerDescription,
    socialLinks,
    legalLinks {
      privacy { label, href },
      terms { label, href },
      cookies { label, href }
    }
  },
  'navigation': *[_type == 'navigation' && _id == 'navigation'][0] {
    headerNav[] { label, href, external, requiresAuth, authOnly, guestOnly },
    footerNav[] { title, items[] { label, href, external, requiresAuth } },
    dashboardNav[] { label, href, external, requiresAuth },
    authNav[] { label, href, external, requiresAuth },
    guestNav[] { label, href, external, requiresAuth }
  },
  'homePage': *[_type == 'homePage' && _id == 'homePage'][0] {
    heroSection { featuredLabel, headline, subheadline },
    ctaButtons[] { label, href, variant, external, requiresAuth },
    blogSection { title, subtitle, emptyMessage, emptyDescription, latestArticlesLabel, discoverLabel },
    newsletterSection { heading, description, placeholder, buttonText, enabled },
    footerCTA { enabled, heading, description, buttons[] { label, href, variant, external, requiresAuth } },
    featuredPost->{ _id, title, 'slug': slug.current, excerpt, 'coverImage': coverImage.asset->url, author->{ name, 'avatar': image.asset->url } },
    showFeaturedPost,
    postsPerPage,
    defaultPostOrder
  },
  'posts': *[_type == 'post' && defined(publishedAt) && showOnHome != false] | order(publishedAt desc) [0...20] {
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