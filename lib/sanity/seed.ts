import { writeSanityClient } from './client'

const ENGLISH_LANG_ID = 'language-en'
const HINDI_LANG_ID = 'language-hi'
const SITE_SETTINGS_ID = 'siteSettings'
const HOME_PAGE_ID = 'page-home-en'
const AUTH_PAGE_ID = 'page-auth-en'
const DASHBOARD_PAGE_ID = 'page-dashboard-en'

type SeedResult = {
  languages: boolean
  siteSettings: boolean
  homePage: boolean
  authPage: boolean
  dashboardPage: boolean
  errors: string[]
}

const defaultLanguages = [
  {
    _type: 'language',
    _id: ENGLISH_LANG_ID,
    id: 'en',
    title: 'English',
    nativeTitle: 'English',
    isDefault: true,
    flag: '🇺🇸',
  },
  {
    _type: 'language',
    _id: HINDI_LANG_ID,
    id: 'hi',
    title: 'Hindi',
    nativeTitle: 'हिन्दी',
    isDefault: false,
    flag: '🇮🇳',
  },
]

const defaultSiteSettings = {
  _type: 'siteSettings',
  _id: SITE_SETTINGS_ID,
  siteName: 'ContentFlow',
  siteDescription: 'A modern publishing platform for writers, creators, and thinkers.',
  notFoundPage: {
    english: {
      eyebrow: '404 Error',
      title: 'Page not found',
      description: "The page you're looking for doesn't exist, was moved, or is not published yet.",
      primaryButtonLabel: 'Go to homepage',
      secondaryButtonLabel: 'Browse posts',
    },
    hindi: {
      eyebrow: '404 त्रुटि',
      title: 'पेज नहीं मिला',
      description: 'जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है, हटाया जा चुका है, या अभी प्रकाशित नहीं हुआ है।',
      primaryButtonLabel: 'होमपेज पर जाएँ',
      secondaryButtonLabel: 'पोस्ट्स देखें',
    },
  },
  copyrightText: '© 2026 ContentFlow. All rights reserved.',
  footerDescription: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
  socialLinks: [],
  legalLinks: {
    privacy: { label: 'Privacy Policy', href: '/privacy' },
    terms: { label: 'Terms of Service', href: '/terms' },
    cookies: { label: 'Cookies', href: '/cookies' },
  },
  supportedLanguages: [
    { _type: 'reference', _ref: ENGLISH_LANG_ID },
    { _type: 'reference', _ref: HINDI_LANG_ID },
  ],
  defaultLanguage: { _type: 'reference', _ref: ENGLISH_LANG_ID },
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
    { label: 'Dashboard', href: '/dashboard', external: false, requiresAuth: true, icon: 'layout-dashboard', group: 'Main' },
    { label: 'Posts', href: '/dashboard/posts', external: false, requiresAuth: true, icon: 'file-text', group: 'Main', badge: 'posts' },
    { label: 'Analytics', href: '/dashboard/analytics', external: false, requiresAuth: true, icon: 'bar-chart-3', group: 'Main' },
    { label: 'Settings', href: '/dashboard/settings', external: false, requiresAuth: true, icon: 'settings', group: 'Account' },
    { label: 'Billing', href: '/dashboard/billing', external: false, requiresAuth: true, icon: 'credit-card', group: 'Account' },
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
  _type: 'page',
  _id: HOME_PAGE_ID,
  pageType: 'home',
  language: { _type: 'reference', _ref: ENGLISH_LANG_ID },
  title: 'Home',
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
}

const defaultAuthPage = {
  _type: 'page',
  _id: AUTH_PAGE_ID,
  pageType: 'auth',
  language: { _type: 'reference', _ref: ENGLISH_LANG_ID },
  title: 'Authentication',
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
}

const defaultDashboardPage = {
  _type: 'page',
  _id: DASHBOARD_PAGE_ID,
  pageType: 'dashboard',
  language: { _type: 'reference', _ref: ENGLISH_LANG_ID },
  title: 'Dashboard',
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

export async function seedCMS(): Promise<SeedResult> {
  const results: SeedResult = {
    languages: false,
    siteSettings: false,
    homePage: false,
    authPage: false,
    dashboardPage: false,
    errors: [],
  }

  // Seed languages first
  for (const lang of defaultLanguages) {
    try {
      await writeSanityClient.createOrReplace(lang)
    } catch (error) {
      results.errors.push(`Failed to create language ${lang.id}: ${error}`)
    }
  }
  results.languages = true

  const documents = [
    { id: SITE_SETTINGS_ID, data: defaultSiteSettings, name: 'siteSettings' as const },
    { id: HOME_PAGE_ID, data: defaultHomePage, name: 'homePage' as const },
    { id: AUTH_PAGE_ID, data: defaultAuthPage, name: 'authPage' as const },
    { id: DASHBOARD_PAGE_ID, data: defaultDashboardPage, name: 'dashboardPage' as const },
  ]

  for (const doc of documents) {
    try {
      const existing = await writeSanityClient.getDocument(doc.id)
      
      if (!existing) {
        await writeSanityClient.createOrReplace(doc.data as { _id: string; _type: string; [key: string]: unknown })
      }
      results[doc.name] = true
    } catch {
      try {
        await writeSanityClient.createOrReplace(doc.data as { _id: string; _type: string; [key: string]: unknown })
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
    languages: false,
    siteSettings: false,
    homePage: false,
    authPage: false,
    dashboardPage: false,
    errors: [],
  }

  // Reset languages first
  for (const lang of defaultLanguages) {
    try {
      await writeSanityClient.createOrReplace(lang)
    } catch (error) {
      results.errors.push(`Failed to reset language ${lang.id}: ${error}`)
    }
  }
  results.languages = true

  const documents = [
    { id: SITE_SETTINGS_ID, data: defaultSiteSettings, name: 'siteSettings' as const },
    { id: HOME_PAGE_ID, data: defaultHomePage, name: 'homePage' as const },
    { id: AUTH_PAGE_ID, data: defaultAuthPage, name: 'authPage' as const },
    { id: DASHBOARD_PAGE_ID, data: defaultDashboardPage, name: 'dashboardPage' as const },
  ]

  for (const doc of documents) {
    try {
      await writeSanityClient.createOrReplace(doc.data as { _id: string; _type: string; [key: string]: unknown })
      results[doc.name] = true
    } catch (error) {
      results.errors.push(`Failed to reset ${doc.name}: ${error}`)
    }
  }

  return results
}
