import { sanityClient } from './client'
import { sanityFetch } from './live'
import {
  SITE_SETTINGS_QUERY,
  PAGE_BY_TYPE_QUERY,
  PAGE_BY_SLUG_QUERY,
  ALL_PAGES_QUERY,
  HOME_PAGE_DATA_QUERY,
} from './queries'
import { DEFAULT_SITE_SETTINGS } from './content-types'
import type { SiteSettings, Page } from './content-types'

interface HomePagePost {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string
  featured: boolean | null
  tags: string[] | null
  author: { name: string; avatar: string | null } | null
  coverImage: string | null
}

interface HomePageData {
  settings: SiteSettings | null
  homePage: Page | null
  posts: HomePagePost[]
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  
  if (!data) {
    return {
      siteName: 'ContentFlow',
      siteNameHindi: DEFAULT_SITE_SETTINGS.siteNameHindi,
      siteDescription: 'A modern publishing platform for writers, creators, and thinkers.',
      siteDescriptionHindi: DEFAULT_SITE_SETTINGS.siteDescriptionHindi,
      logo: null,
      favicon: null,
      notFoundPage: DEFAULT_SITE_SETTINGS.notFoundPage,
      copyrightText: '© 2026 ContentFlow. All rights reserved.',
      copyrightTextHindi: DEFAULT_SITE_SETTINGS.copyrightTextHindi,
      footerDescription: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
      footerDescriptionHindi: DEFAULT_SITE_SETTINGS.footerDescriptionHindi,
      socialLinks: [],
      legalLinks: {
        privacy: DEFAULT_SITE_SETTINGS.legalLinks!.privacy,
        terms: DEFAULT_SITE_SETTINGS.legalLinks!.terms,
        cookies: DEFAULT_SITE_SETTINGS.legalLinks!.cookies,
      },
      headerNav: [
        ...DEFAULT_SITE_SETTINGS.headerNav!,
      ],
      footerNav: [
        ...DEFAULT_SITE_SETTINGS.footerNav!,
      ],
      dashboardNav: [
        ...DEFAULT_SITE_SETTINGS.dashboardNav!,
      ],
      authNav: [
        ...DEFAULT_SITE_SETTINGS.authNav!,
      ],
      guestNav: [
        ...DEFAULT_SITE_SETTINGS.guestNav!,
      ],
    }
  }
  
  return data
}

export async function getHomePage(): Promise<Page> {
  const result = await sanityFetch({
    query: PAGE_BY_TYPE_QUERY,
    params: { pageType: 'home' },
    tags: ['page', 'home'],
  })
  
  const data = result.data as Page | null
  
  if (!data) {
    return {
      _id: 'default-home',
      title: 'Home',
      pageType: 'home',
      heroSection: {
        featuredLabel: 'Featured Story',
        headline: null,
        subheadline: null,
      },
      ctaButtons: [
        { label: 'Get Started', href: '/signup', variant: 'primary' },
        { label: 'Learn more', href: '/posts', variant: 'secondary' },
      ],
      blogSection: {
        title: 'Latest Stories',
        subtitle: 'Thoughts, tutorials, and insights',
        emptyMessage: 'No stories found',
        emptyDescription: 'Try adjusting your search',
        latestArticlesLabel: 'Latest Articles',
        discoverLabel: 'Discover',
      },
      newsletterSection: {
        heading: 'Stay in the loop',
        description: 'Get the latest articles and updates delivered to your inbox.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
        enabled: true,
      },
      footerCTA: {
        enabled: true,
        heading: 'Ready to share your story?',
        description: null,
        buttons: [
          { label: 'Start Writing', href: '/dashboard/posts', variant: 'primary', requiresAuth: true },
          { label: 'Get Started', href: '/signup', variant: 'secondary' },
        ],
      },
      featuredPost: null,
      showFeaturedPost: true,
    }
  }
  
  return data
}

export async function getAuthPage(): Promise<Page> {
  const result = await sanityFetch({
    query: PAGE_BY_TYPE_QUERY,
    params: { pageType: 'auth' },
    tags: ['page', 'auth'],
  })
  
  const data = result.data as Page | null
  
  if (!data) {
    return {
      _id: 'default-auth',
      title: 'Auth',
      pageType: 'auth',
      brandName: 'ContentFlow',
      tagline: 'CMS-driven publishing for engineering teams.',
      features: [
        { title: 'API-first delivery architecture' },
        { title: 'Visual Schema Builder v2.0' },
        { title: 'Multi-environment staging' },
      ],
      loginPage: {
        title: 'Welcome back',
        subtitle: 'Sign in to your workspace',
        buttonText: 'Sign in',
        alternateText: "Don't have an account?",
        alternateLinkText: 'Sign up',
      },
      signupPage: {
        title: 'Create an account',
        subtitle: 'Sign up for your workspace',
        buttonText: 'Sign up',
        alternateText: 'Already have an account?',
        alternateLinkText: 'Sign in',
      },
      oauthProviders: [
        { name: 'google', enabled: true },
      ],
    }
  }
  
  return data
}

export async function getDashboardPage(): Promise<Page> {
  const result = await sanityFetch({
    query: PAGE_BY_TYPE_QUERY,
    params: { pageType: 'dashboard' },
    tags: ['page', 'dashboard'],
  })
  
  const data = result.data as Page | null
  
  if (!data) {
    return {
      _id: 'default-dashboard',
      title: 'Dashboard',
      pageType: 'dashboard',
      dashboardWelcome: {
        message: 'Welcome back, {name}',
        description: 'Here is what is happening across your content ecosystem today.',
      },
      stats: {
        totalPosts: { label: 'Total Posts', icon: 'file-text' },
        subscription: { label: 'Subscription Plan', icon: 'credit-card', proText: 'Unlimited access to all nodes', freeText: 'Basic publishing limits active' },
        profileComplete: { label: 'Profile Complete', icon: 'user-check' },
      },
      activitySection: {
        title: 'Recent Content Activity',
        viewAllLink: 'View all architecture',
        emptyMessage: 'No recent architectural entries recorded yet.',
        tableHeaders: { title: 'Node Title', author: 'Architect', date: 'Publication Date' },
      },
      defaultAuthor: 'Generic System',
    }
  }
  
  return data
}

export async function getHomePageData() {
  const result = await sanityFetch({
    query: HOME_PAGE_DATA_QUERY,
    tags: ['page', 'siteSettings', 'post'],
  })
  
  const data = result.data as HomePageData | null
  
  const defaultSettings: SiteSettings = {
    siteName: 'ContentFlow',
    siteNameHindi: DEFAULT_SITE_SETTINGS.siteNameHindi,
    siteDescription: 'A modern publishing platform for writers, creators, and thinkers.',
    siteDescriptionHindi: DEFAULT_SITE_SETTINGS.siteDescriptionHindi,
    logo: null,
    favicon: null,
    notFoundPage: DEFAULT_SITE_SETTINGS.notFoundPage,
    copyrightText: '© 2026 ContentFlow. All rights reserved.',
    copyrightTextHindi: DEFAULT_SITE_SETTINGS.copyrightTextHindi,
    footerDescription: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
    footerDescriptionHindi: DEFAULT_SITE_SETTINGS.footerDescriptionHindi,
    socialLinks: [],
    legalLinks: {
      privacy: DEFAULT_SITE_SETTINGS.legalLinks!.privacy,
      terms: DEFAULT_SITE_SETTINGS.legalLinks!.terms,
      cookies: DEFAULT_SITE_SETTINGS.legalLinks!.cookies,
    },
    headerNav: [
      ...DEFAULT_SITE_SETTINGS.headerNav!,
    ],
    footerNav: [
      ...DEFAULT_SITE_SETTINGS.footerNav!,
    ],
    dashboardNav: [
      ...DEFAULT_SITE_SETTINGS.dashboardNav!,
    ],
    authNav: [
      ...DEFAULT_SITE_SETTINGS.authNav!,
    ],
    guestNav: [
      ...DEFAULT_SITE_SETTINGS.guestNav!,
    ],
  }
  
  const defaultHomePage: Page = {
    _id: 'default-home',
    title: 'Home',
    pageType: 'home',
    heroSection: {
      featuredLabel: 'Featured Story',
      headline: null,
      subheadline: null,
    },
    ctaButtons: [
      { label: 'Get Started', href: '/signup', variant: 'primary' },
      { label: 'Learn more', href: '/posts', variant: 'secondary' },
    ],
    blogSection: {
      title: 'Latest Stories',
      subtitle: 'Thoughts, tutorials, and insights',
      emptyMessage: 'No stories found',
      emptyDescription: 'Try adjusting your search',
      latestArticlesLabel: 'Latest Articles',
      discoverLabel: 'Discover',
    },
    newsletterSection: {
      heading: 'Stay in the loop',
      description: 'Get the latest articles and updates delivered to your inbox.',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      enabled: true,
    },
    footerCTA: {
      enabled: true,
      heading: 'Ready to share your story?',
      description: null,
      buttons: [
        { label: 'Start Writing', href: '/dashboard/posts', variant: 'primary', requiresAuth: true },
        { label: 'Get Started', href: '/signup', variant: 'secondary' },
      ],
    },
    featuredPost: null,
    showFeaturedPost: true,
  }
  
  return {
    settings: data?.settings ?? defaultSettings,
    homePage: data?.homePage ?? defaultHomePage,
    posts: data?.posts ?? [],
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const result = await sanityFetch({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ['page'],
  })
  
  return result.data as Page | null
}

export async function getAllPages() {
  const data = await sanityClient.fetch<Array<{
    _id: string
    title: string
    pageType: string
    slug: string | null
    description: string | null
    publishedAt: string | null
  }>>(ALL_PAGES_QUERY)
  
  return data ?? []
}
