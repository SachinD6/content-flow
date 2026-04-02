import { writeSanityClient } from './client'

const SITE_SETTINGS_ID = 'siteSettings'
const NAVIGATION_ID = 'navigation'
const HOME_PAGE_ID = 'homePage'
const AUTH_PAGES_ID = 'authPages'
const DASHBOARD_SETTINGS_ID = 'dashboardSettings'

type SeedResult = {
  siteSettings: boolean
  navigation: boolean
  homePage: boolean
  authPages: boolean
  dashboardSettings: boolean
  errors: string[]
}

const defaultSiteSettings = {
  _type: 'siteSettings',
  _id: SITE_SETTINGS_ID,
  siteName: 'ContentFlow',
  siteDescription: 'A modern publishing platform for writers, creators, and thinkers.',
  copyrightText: '© 2026 ContentFlow. All rights reserved.',
  footerDescription: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
  socialLinks: [],
  legalLinks: {
    privacy: { label: 'Privacy Policy', href: '/privacy' },
    terms: { label: 'Terms of Service', href: '/terms' },
    cookies: { label: 'Cookies', href: '/cookies' },
  },
}

const defaultNavigation = {
  _type: 'navigation',
  _id: NAVIGATION_ID,
  headerNav: [
    { label: 'Articles', href: '/posts', external: false, requiresAuth: false, authOnly: false, guestOnly: false },
    { label: 'Write', href: '/dashboard/posts', external: false, requiresAuth: true, authOnly: true, guestOnly: false },
  ],
  footerNav: [
    {
      title: 'Platform',
      items: [
        { label: 'Articles', href: '/posts', external: false, requiresAuth: false },
        { label: 'Dashboard', href: '/dashboard', external: false, requiresAuth: true },
        { label: 'Write a story', href: '/dashboard/posts', external: false, requiresAuth: true },
        { label: 'Writers', href: '/writers', external: false, requiresAuth: false },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Settings', href: '/dashboard/settings', external: false, requiresAuth: true },
        { label: 'Billing', href: '/dashboard/billing', external: false, requiresAuth: true },
        { label: 'Help Center', href: '/help', external: false, requiresAuth: false },
      ],
    },
  ],
  dashboardNav: [
    { label: 'Dashboard', href: '/dashboard', external: false, requiresAuth: true },
    { label: 'Posts', href: '/dashboard/posts', external: false, requiresAuth: true },
    { label: 'Analytics', href: '/dashboard/analytics', external: false, requiresAuth: true },
    { label: 'Settings', href: '/dashboard/settings', external: false, requiresAuth: true },
    { label: 'Billing', href: '/dashboard/billing', external: false, requiresAuth: true },
  ],
  authNav: [
    { label: 'Write a story', href: '/dashboard/posts/new', external: false, requiresAuth: true },
    { label: 'Dashboard', href: '/dashboard', external: false, requiresAuth: true },
    { label: 'Invite Collaborators', href: '#invite', external: false },
    { label: 'Settings', href: '/dashboard/settings', external: false, requiresAuth: true },
    { label: 'Sign out', href: '#signout', external: false },
  ],
  guestNav: [
    { label: 'Sign In', href: '/login', external: false, requiresAuth: false },
    { label: 'Get Started', href: '/signup', external: false, requiresAuth: false },
  ],
}

const defaultHomePage = {
  _type: 'homePage',
  _id: HOME_PAGE_ID,
  heroSection: {
    featuredLabel: 'Featured Story',
    headline: null,
    subheadline: null,
  },
  ctaButtons: [
    { label: 'Get Started', href: '/signup', variant: 'primary', external: false, requiresAuth: false },
    { label: 'Learn more', href: '/posts', variant: 'secondary', external: false, requiresAuth: false },
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
      { label: 'Start Writing', href: '/dashboard/posts', variant: 'primary', external: false, requiresAuth: true },
      { label: 'Get Started', href: '/signup', variant: 'secondary', external: false, requiresAuth: false },
    ],
  },
  showFeaturedPost: true,
  postsPerPage: 10,
  defaultPostOrder: 'publishedAt_desc',
}

const defaultAuthPages = {
  _type: 'authPages',
  _id: AUTH_PAGES_ID,
  brandName: 'ContentFlow',
  tagline: 'CMS-driven publishing for engineering teams.',
  features: [
    { title: 'API-first delivery architecture', description: 'Built for scale with modern APIs', icon: 'zap' },
    { title: 'Visual Schema Builder', description: 'Drag and drop content modeling', icon: 'layers' },
    { title: 'Multi-environment staging', description: 'Seamless deployment workflows', icon: 'rocket' },
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
  legalLinks: {
    terms: 'TERMS',
    termsUrl: '/terms',
    privacy: 'PRIVACY',
    privacyUrl: '/privacy',
    security: 'SECURITY',
    securityUrl: '/security',
  },
  footer: {
    backedByText: 'BACKED BY',
    poweredByText: 'Supabase Auth',
  },
}

const defaultDashboardSettings = {
  _type: 'dashboardSettings',
  _id: DASHBOARD_SETTINGS_ID,
  brandName: 'ContentFlow',
  tagline: 'Engineering CMS',
  welcomeMessage: 'Welcome back, {name}',
  welcomeDescription: 'Here is what is happening across your content ecosystem today.',
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

export async function seedCMS(): Promise<SeedResult> {
  const results: SeedResult = {
    siteSettings: false,
    navigation: false,
    homePage: false,
    authPages: false,
    dashboardSettings: false,
    errors: [],
  }

  const documents = [
    { id: SITE_SETTINGS_ID, data: defaultSiteSettings, name: 'siteSettings' as const },
    { id: NAVIGATION_ID, data: defaultNavigation, name: 'navigation' as const },
    { id: HOME_PAGE_ID, data: defaultHomePage, name: 'homePage' as const },
    { id: AUTH_PAGES_ID, data: defaultAuthPages, name: 'authPages' as const },
    { id: DASHBOARD_SETTINGS_ID, data: defaultDashboardSettings, name: 'dashboardSettings' as const },
  ]

  for (const doc of documents) {
    try {
      // Check if document exists
      const existing = await writeSanityClient.getDocument(doc.id)
      
      if (!existing) {
        // Create new document
        await writeSanityClient.createOrReplace(doc.data as any)
      }
      results[doc.name] = true
    } catch {
      // Document doesn't exist, create it
      try {
        await writeSanityClient.createOrReplace(doc.data as any)
        results[doc.name] = true
      } catch (createError) {
        results.errors.push(`Failed to create ${doc.name}: ${createError}`)
      }
    }
  }

  return results
}

export async function resetCMS(): Promise<SeedResult> {
  const results: SeedResult = {
    siteSettings: false,
    navigation: false,
    homePage: false,
    authPages: false,
    dashboardSettings: false,
    errors: [],
  }

  const documents = [
    { id: SITE_SETTINGS_ID, data: defaultSiteSettings, name: 'siteSettings' as const },
    { id: NAVIGATION_ID, data: defaultNavigation, name: 'navigation' as const },
    { id: HOME_PAGE_ID, data: defaultHomePage, name: 'homePage' as const },
    { id: AUTH_PAGES_ID, data: defaultAuthPages, name: 'authPages' as const },
    { id: DASHBOARD_SETTINGS_ID, data: defaultDashboardSettings, name: 'dashboardSettings' as const },
  ]

  for (const doc of documents) {
    try {
      await writeSanityClient.createOrReplace(doc.data as any)
      results[doc.name] = true
    } catch (error) {
      results.errors.push(`Failed to reset ${doc.name}: ${error}`)
    }
  }

  return results
}