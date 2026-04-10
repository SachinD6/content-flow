import { groq } from 'next-sanity'

const POST_CARD_FIELDS = groq`
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
  'language': coalesce(language->id, language, 'en'),
  author->{ name, 'avatar': image.asset->url },
  'coverImage': coverImage.asset->url,
  'coverImageAssetId': coverImage.asset._ref
`

const NAV_ITEM_FIELDS = groq`
  label,
  labelHindi,
  linkType,
  'href': select(
    linkType == 'internal' && page->pageType == 'home' => '/',
    linkType == 'internal' && page->pageType == 'auth' => '/login',
    linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
    linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
    defined(href) => href,
    '#'
  ),
  'external': coalesce(external, linkType == 'external', target == '_blank'),
  'target': coalesce(target, select(linkType == 'external' => '_blank', '_self')),
  icon,
  group,
  'badge': coalesce(badge, 'none'),
  requiresAuth,
  authOnly,
  guestOnly,
  children[] {
    label,
    labelHindi,
    linkType,
    'href': select(
      linkType == 'internal' && page->pageType == 'home' => '/',
      linkType == 'internal' && page->pageType == 'auth' => '/login',
      linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
      linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
      defined(href) => href,
      '#'
    ),
    'external': linkType == 'external' || target == '_blank',
    'target': coalesce(target, select(linkType == 'external' => '_blank', '_self')),
    icon
  }
`

const PAGE_COMPONENT_FIELDS = groq`
  ...,
  'image': image.asset->url,
  'backgroundImage': backgroundImage.asset->url,
  'thumbnail': thumbnail.asset->url,
  buttons[] {
    ...,
    'href': select(
      linkType == 'internal' && page->pageType == 'home' => '/',
      linkType == 'internal' && page->pageType == 'auth' => '/login',
      linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
      linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
      defined(href) => href,
      '#'
    ),
    'external': coalesce(external, linkType == 'external', target == '_blank'),
    'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
  },
  viewAllLink {
    ...,
    'href': select(
      linkType == 'internal' && page->pageType == 'home' => '/',
      linkType == 'internal' && page->pageType == 'auth' => '/login',
      linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
      linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
      defined(href) => href,
      '#'
    ),
    'external': linkType == 'external' || target == '_blank',
    'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
  },
  features[] {
    ...,
    link {
      ...,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '#'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    }
  },
  plans[] {
    ...,
    buttonLink {
      ...,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '#'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    },
    'buttonHref': coalesce(
      select(
        buttonLink.linkType == 'internal' && buttonLink.page->pageType == 'home' => '/',
        buttonLink.linkType == 'internal' && buttonLink.page->pageType == 'auth' => '/login',
        buttonLink.linkType == 'internal' && buttonLink.page->pageType == 'dashboard' => '/dashboard',
        buttonLink.linkType == 'internal' && defined(buttonLink.page->slug.current) => '/' + buttonLink.page->slug.current,
        defined(buttonLink.href) => buttonLink.href,
        null
      ),
      buttonHref
    ),
    'buttonExternal': coalesce(buttonLink.linkType == 'external', false)
  },
  post->{ ${POST_CARD_FIELDS} },
  manualPosts[]->{ ${POST_CARD_FIELDS} },
  testimonials[] {
    ...,
    'avatar': avatar.asset->url
  },
  members[] {
    ...,
    'image': image.asset->url,
    socialLinks[] {
      platform,
      linkType,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '#'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    }
  }
`

const PAGE_ROUTE_FIELDS = groq`
  _id,
  title,
  pageType,
  'slug': slug.current,
  'canonicalSlug': coalesce(translationOf->slug.current, slug.current),
  'slugHistory': coalesce(slugHistory, []),
  'language': coalesce(language->id, language, 'en'),
  'translationGroupId': coalesce(translationOf._ref, _id),
  description,
  components[] { ${PAGE_COMPONENT_FIELDS} },
  content,
  seo {
    metaTitle,
    metaDescription,
    'ogImage': ogImage.asset->url
  },
  publishedAt,
  'availableTranslations': *[
    _type == 'page' &&
    pageType == 'generic' &&
    coalesce(language->id, language, 'en') in ['en', 'hi'] &&
    coalesce(translationOf._ref, _id) == coalesce(^.translationOf._ref, ^._id)
  ] | order(coalesce(language->id, language, 'en') asc) {
    _id,
    'language': coalesce(language->id, language, 'en'),
    'slug': slug.current,
    'canonicalSlug': coalesce(translationOf->slug.current, slug.current)
  }
`

const POST_ROUTE_FIELDS = groq`
  _id,
  title,
  excerpt,
  body,
  publishedAt,
  featured,
  tags,
  readingTime,
  'slug': slug.current,
  'canonicalSlug': coalesce(translationOf->slug.current, slug.current),
  'slugHistory': coalesce(slugHistory, []),
  'language': coalesce(language->id, language, 'en'),
  'translationGroupId': coalesce(translationOf._ref, _id),
  author->{ name, bio, 'avatar': image.asset->url },
  'coverImage': coverImage.asset->url,
  'coverImageAssetId': coverImage.asset._ref,
  'availableTranslations': *[
    _type == 'post' &&
    coalesce(language->id, language, 'en') in ['en', 'hi'] &&
    coalesce(translationOf._ref, _id) == coalesce(^.translationOf._ref, ^._id)
  ] | order(coalesce(language->id, language, 'en') asc) {
    _id,
    'language': coalesce(language->id, language, 'en'),
    'slug': slug.current,
    'canonicalSlug': coalesce(translationOf->slug.current, slug.current)
  }
`

const SITE_SETTINGS_FIELDS = groq`
  siteName,
  siteNameHindi,
  siteDescription,
  siteDescriptionHindi,
  'logo': logo.asset->url,
  'favicon': favicon.asset->url,
  notFoundPage {
    english {
      eyebrow,
      title,
      description,
      primaryButtonLabel,
      secondaryButtonLabel
    },
    hindi {
      eyebrow,
      title,
      description,
      primaryButtonLabel,
      secondaryButtonLabel
    }
  },
  copyrightText,
  copyrightTextHindi,
  footerDescription,
  footerDescriptionHindi,
  socialLinks[] {
    platform,
    linkType,
    'url': select(
      linkType == 'internal' && page->pageType == 'home' => '/',
      linkType == 'internal' && page->pageType == 'auth' => '/login',
      linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
      linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
      defined(href) => href,
      '#'
    ),
    'external': linkType == 'external' || target == '_blank',
    'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
  },
  legalLinks {
    privacy {
      label,
      labelHindi,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '/privacy'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    },
    terms {
      label,
      labelHindi,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '/terms'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    },
    cookies {
      label,
      labelHindi,
      'href': select(
        linkType == 'internal' && page->pageType == 'home' => '/',
        linkType == 'internal' && page->pageType == 'auth' => '/login',
        linkType == 'internal' && page->pageType == 'dashboard' => '/dashboard',
        linkType == 'internal' && defined(page->slug.current) => '/' + page->slug.current,
        defined(href) => href,
        '/cookies'
      ),
      'external': linkType == 'external' || target == '_blank',
      'target': coalesce(target, select(linkType == 'external' => '_blank', '_self'))
    }
  },
  headerNav[] { ${NAV_ITEM_FIELDS} },
  footerNav[] {
    title,
    titleHindi,
    items[] { ${NAV_ITEM_FIELDS} }
  },
  dashboardNav[] { ${NAV_ITEM_FIELDS} },
  authNav[] { ${NAV_ITEM_FIELDS} },
  guestNav[] { ${NAV_ITEM_FIELDS} }
`

export const SITE_SETTINGS_QUERY = groq`
  *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
    ${SITE_SETTINGS_FIELDS}
  }
`

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
    components[] { ${PAGE_COMPONENT_FIELDS} },
    brandName,
    tagline,
    features[] { title, description, icon },
    loginPage { title, subtitle, buttonText },
    signupPage { title, subtitle, buttonText },
    oauthProviders[] { name, enabled },
    dashboardWelcome { message, description },
    stats {
      totalPosts { label },
      subscription { label, proText, freeText }
    },
    dashboardNav[] { ${NAV_ITEM_FIELDS} },
    dashboardFooterNav[] { ${NAV_ITEM_FIELDS} },
    'slug': slug.current,
    content,
    publishedAt
  }
`

export const DASHBOARD_NAV_QUERY = groq`
  *[_type == 'page' && pageType == 'dashboard'][0] {
    dashboardNav[] { ${NAV_ITEM_FIELDS} },
    dashboardFooterNav[] { ${NAV_ITEM_FIELDS} }
  }
`

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == 'page' && pageType == 'generic' && slug.current == $slug][0] {
    _id,
    title,
    pageType,
    'slug': slug.current,
    description,
    components[] { ${PAGE_COMPONENT_FIELDS} },
    content,
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    publishedAt
  }
`

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

export const ALL_POSTS_QUERY = groq`
  *[_type == 'post' && defined(publishedAt) && showOnHome != false] | order(publishedAt desc) {
    ${POST_CARD_FIELDS},
    'authorId': author._ref
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
    ${POST_CARD_FIELDS}
  } | order(featured desc, publishedAt desc)[0]
`

export const MOST_VIEWED_POSTS_QUERY = groq`
  *[_type == 'post' && mostViewed == true && defined(publishedAt)] | order(publishedAt desc) [0...5] {
    ${POST_CARD_FIELDS}
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

export const ALL_AUTHORS_QUERY = groq`
  *[_type == 'author'] | order(name asc) {
    _id,
    name,
    'slug': slug.current,
    bio,
    'avatar': image.asset->url
  }
`

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

export const PAGE_BY_TYPE_AND_LANGUAGE_QUERY = groq`
  *[
    _type == 'page' &&
    pageType == $pageType &&
    coalesce(language->id, language, 'en') == $language
  ][0] {
    _id,
    title,
    pageType,
    description,
    components[] { ${PAGE_COMPONENT_FIELDS} },
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    'language': coalesce(language->id, language, 'en'),
    brandName,
    tagline,
    features[] { title, description, icon },
    loginPage { title, subtitle, buttonText },
    signupPage { title, subtitle, buttonText },
    oauthProviders[] { name, enabled },
    dashboardWelcome { message, description },
    stats {
      totalPosts { label },
      subscription { label, proText, freeText }
    },
    'availableTranslations': *[
      _type == 'page' &&
      pageType == $pageType &&
      coalesce(language->id, language, 'en') in ['en', 'hi'] &&
      coalesce(translationOf._ref, _id) == coalesce(^.translationOf._ref, ^._id)
    ] | order(coalesce(language->id, language, 'en') asc) {
      _id,
      'language': coalesce(language->id, language, 'en'),
      'slug': slug.current,
      'canonicalSlug': coalesce(translationOf->slug.current, slug.current)
    },
    'slug': slug.current,
    content,
    publishedAt
  }
`

export const PAGE_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[
    _type == 'page' &&
    pageType == 'generic' &&
    slug.current == $slug &&
    coalesce(language->id, language, 'en') == $language
  ][0] {
    _id,
    title,
    pageType,
    'slug': slug.current,
    description,
    components[] { ${PAGE_COMPONENT_FIELDS} },
    content,
    'language': coalesce(language->id, language, 'en'),
    seo {
      metaTitle,
      metaDescription,
      'ogImage': ogImage.asset->url
    },
    publishedAt
  }
`

export const ALL_POSTS_BY_LANGUAGE_QUERY = groq`
  *[
    _type == 'post' &&
    defined(publishedAt) &&
    showOnHome != false &&
    coalesce(language->id, language, 'en') == $language
  ] | order(publishedAt desc) {
    ${POST_CARD_FIELDS}
  }
`

export const ALL_PUBLISHED_POSTS_BY_LANGUAGE_QUERY = groq`
  *[
    _type == 'post' &&
    defined(publishedAt) &&
    coalesce(language->id, language, 'en') == $language
  ] | order(publishedAt desc) {
    ${POST_CARD_FIELDS}
  }
`

export const PAGE_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[
    _type == 'page' &&
    pageType == 'generic' &&
    (
      slug.current == $slug ||
      $slug in coalesce(slugHistory, []) ||
      translationOf->slug.current == $slug
    ) &&
    coalesce(language->id, language, 'en') == $language
  ] | order(
    select(defined(title) && title != '' => 4, 0) desc,
    select(count(components) > 0 => 3, 0) desc,
    select(count(content) > 0 => 3, 0) desc,
    select(
      slug.current == $slug => 2,
      coalesce(translationOf->slug.current, '') == $slug => 1,
      0
    ) desc,
    _updatedAt desc
  )[0] {
    ${PAGE_ROUTE_FIELDS}
  }
`

export const POST_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[
    _type == 'post' &&
    slug.current == $slug &&
    coalesce(language->id, language, 'en') == $language
  ][0] {
    ...,
    'language': coalesce(language->id, language, 'en'),
    author->{ name, bio, 'avatar': image.asset->url },
    'coverImage': coverImage.asset->url,
    'coverImageAssetId': coverImage.asset._ref
  }
`

export const POST_ROUTE_BY_SLUG_AND_LANGUAGE_QUERY = groq`
  *[
    _type == 'post' &&
    (
      slug.current == $slug ||
      $slug in coalesce(slugHistory, []) ||
      translationOf->slug.current == $slug
    ) &&
    coalesce(language->id, language, 'en') == $language
  ] | order(
    select(defined(title) => 4, 0) desc,
    select(count(body) > 0 => 3, 0) desc,
    select(
      slug.current == $slug => 2,
      coalesce(translationOf->slug.current, '') == $slug => 1,
      0
    ) desc,
    _updatedAt desc
  )[0] {
    ${POST_ROUTE_FIELDS}
  }
`

export const SITE_SETTINGS_WITH_LANGUAGES_QUERY = groq`
  *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
    ${SITE_SETTINGS_FIELDS},
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

export const HOME_PAGE_DATA_QUERY = groq`
  {
    'settings': *[_type == 'siteSettings' && _id == 'siteSettings'][0] {
      ${SITE_SETTINGS_FIELDS}
    },
    'homePage': *[
      _type == 'page' &&
      pageType == 'home' &&
      coalesce(language->id, language, 'en') == $language
    ][0] {
      _id,
      title,
      components[] { ${PAGE_COMPONENT_FIELDS} }
    },
    'posts': *[
      _type == 'post' &&
      defined(publishedAt) &&
      showOnHome != false &&
      coalesce(language->id, language, 'en') == $language
    ] | order(publishedAt desc) [0...20] {
      ${POST_CARD_FIELDS}
    }
  }
`
