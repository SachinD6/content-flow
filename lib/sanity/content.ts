import { sanityClient } from './client'
import {
  SITE_SETTINGS_QUERY,
  NAVIGATION_QUERY,
  HOME_PAGE_QUERY,
  HOME_PAGE_DATA_QUERY,
} from './queries'
import type {
  SiteSettings,
  Navigation,
  HomePage,
  NavItem,
} from './content-types'

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  
  return {
    siteName: data?.siteName ?? 'ContentFlow',
    siteDescription: data?.siteDescription ?? 'A modern publishing platform for writers, creators, and thinkers.',
    logo: data?.logo ?? null,
    favicon: data?.favicon ?? null,
    copyrightText: data?.copyrightText ?? '© 2026 ContentFlow. All rights reserved.',
    footerDescription: data?.footerDescription ?? 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
    socialLinks: data?.socialLinks ?? [],
    legalLinks: data?.legalLinks ?? {
      privacy: { label: 'Privacy Policy', href: '/privacy' },
      terms: { label: 'Terms of Service', href: '/terms' },
      cookies: { label: 'Cookies', href: '/cookies' },
    },
  }
}

export async function getNavigation(): Promise<Navigation> {
  const data = await sanityClient.fetch<Navigation | null>(NAVIGATION_QUERY)
  
  if (!data) {
    return {
      headerNav: [
        { label: 'Articles', href: '/posts' },
        { label: 'Write', href: '/dashboard/posts', requiresAuth: true },
      ],
      footerNav: [
        {
          title: 'Platform',
          items: [
            { label: 'Articles', href: '/posts' },
            { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
            { label: 'Write a story', href: '/dashboard/posts', requiresAuth: true },
            { label: 'Writers', href: '/writers' },
          ],
        },
        {
          title: 'Account',
          items: [
            { label: 'Settings', href: '/dashboard/settings', requiresAuth: true },
            { label: 'Billing', href: '/dashboard/billing', requiresAuth: true },
            { label: 'Help Center', href: '/help' },
          ],
        },
      ],
      dashboardNav: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Posts', href: '/dashboard/posts' },
        { label: 'Analytics', href: '/dashboard/analytics' },
        { label: 'Settings', href: '/dashboard/settings' },
        { label: 'Billing', href: '/dashboard/billing' },
      ],
authNav: [
      { label: 'Write a story', href: '/dashboard/posts/new', requiresAuth: true },
      { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
      { label: 'Invite Collaborators', href: '#invite' },
      { label: 'Settings', href: '/dashboard/settings', requiresAuth: true },
      { label: 'Sign out', href: '#signout' },
    ],
    guestNav: [
      { label: 'Sign In', href: '/login' },
      { label: 'Get Started', href: '/signup' },
    ],
  }
}
  
  return data
}

export async function getHomePage(): Promise<HomePage> {
  const data = await sanityClient.fetch<HomePage | null>(HOME_PAGE_QUERY)
  
  if (!data) {
    return {
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
      postsPerPage: 10,
      defaultPostOrder: 'publishedAt_desc',
    }
  }
  
  return data
}

export async function getHomePageData() {
  const data = await sanityClient.fetch<{
    settings: SiteSettings | null
    navigation: Navigation | null
    homePage: HomePage | null
    posts: Array<{
      _id: string
      title: string
      slug: string
      excerpt: string | null
      publishedAt: string
      featured: boolean | null
      tags: string[] | null
      author: { name: string; avatar: string | null } | null
      coverImage: string | null
    }>
  } | null>(HOME_PAGE_DATA_QUERY)
  
  // Default settings
  const defaultSettings: SiteSettings = {
    siteName: 'ContentFlow',
    siteDescription: 'A modern publishing platform for writers, creators, and thinkers.',
    logo: null,
    favicon: null,
    copyrightText: '© 2026 ContentFlow. All rights reserved.',
    footerDescription: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
    socialLinks: [],
    legalLinks: {
      privacy: { label: 'Privacy Policy', href: '/privacy' },
      terms: { label: 'Terms of Service', href: '/terms' },
      cookies: { label: 'Cookies', href: '/cookies' },
    },
  }
  
  // Default navigation
  const defaultNavigation: Navigation = {
    headerNav: [
      { label: 'Articles', href: '/posts' },
      { label: 'Write', href: '/dashboard/posts', requiresAuth: true },
    ],
    footerNav: [
      {
        title: 'Platform',
        items: [
          { label: 'Articles', href: '/posts' },
          { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
          { label: 'Write a story', href: '/dashboard/posts', requiresAuth: true },
          { label: 'Writers', href: '/writers' },
        ],
      },
      {
        title: 'Account',
        items: [
          { label: 'Settings', href: '/dashboard/settings', requiresAuth: true },
          { label: 'Billing', href: '/dashboard/billing', requiresAuth: true },
          { label: 'Help Center', href: '/help' },
        ],
      },
    ],
    dashboardNav: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Posts', href: '/dashboard/posts' },
      { label: 'Analytics', href: '/dashboard/analytics' },
      { label: 'Settings', href: '/dashboard/settings' },
      { label: 'Billing', href: '/dashboard/billing' },
    ],
    authNav: [
      { label: 'Write a story', href: '/dashboard/posts' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/dashboard/settings' },
    ],
    guestNav: [
      { label: 'Sign In', href: '/login' },
      { label: 'Get Started', href: '/signup' },
    ],
  }
  
  // Default home page
  const defaultHomePage: HomePage = {
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
    postsPerPage: 10,
    defaultPostOrder: 'publishedAt_desc',
  }
  
  return {
    settings: data?.settings ?? defaultSettings,
    navigation: data?.navigation ?? defaultNavigation,
    homePage: data?.homePage ?? defaultHomePage,
    posts: data?.posts ?? [],
  }
}