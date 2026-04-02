// Types for CMS content

export type PageType = 'home' | 'auth' | 'dashboard' | 'generic'

export interface SocialLink {
  platform: string
  url: string
}

export interface LegalLinks {
  privacy: { label: string; href: string }
  terms: { label: string; href: string }
  cookies: { label: string; href: string }
}

export interface NavItem {
  label: string
  href: string
  external?: boolean
  requiresAuth?: boolean
  authOnly?: boolean
  guestOnly?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SiteSettings {
  siteName: string | null
  siteDescription: string | null
  logo: string | null
  favicon: string | null
  copyrightText: string | null
  footerDescription: string | null
  socialLinks: SocialLink[] | null
  legalLinks: LegalLinks | null
  headerNav: NavItem[] | null
  footerNav: NavGroup[] | null
  dashboardNav: NavItem[] | null
  authNav: NavItem[] | null
  guestNav: NavItem[] | null
}

export interface CTAButton {
  label: string
  href: string
  variant: 'primary' | 'secondary' | 'ghost' | 'link'
  external?: boolean
  requiresAuth?: boolean
}

// Page Types

export interface HeroSection {
  featuredLabel?: string | null
  headline?: string | null
  subheadline?: string | null
}

export interface BlogSection {
  title: string | null
  subtitle: string | null
  emptyMessage: string | null
  emptyDescription: string | null
  latestArticlesLabel: string | null
  discoverLabel: string | null
}

export interface NewsletterSection {
  heading: string | null
  description: string | null
  placeholder: string | null
  buttonText: string | null
  enabled: boolean | null
}

export interface FooterCTA {
  enabled: boolean | null
  heading: string | null
  description: string | null
  buttons: CTAButton[] | null
}

export interface HomePageContent {
  heroSection: HeroSection | null
  ctaButtons: CTAButton[] | null
  blogSection: BlogSection | null
  newsletterSection: NewsletterSection | null
  footerCTA: FooterCTA | null
  featuredPost: {
    _id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    author: { name: string; avatar: string | null } | null
  } | null
  showFeaturedPost: boolean | null
}

export interface AuthPageContent {
  brandName: string | null
  tagline: string | null
  features: Array<{ title: string; description?: string; icon?: string }> | null
  loginPage: {
    title: string | null
    subtitle: string | null
    buttonText: string | null
    alternateText: string | null
    alternateLinkText: string | null
  } | null
  signupPage: {
    title: string | null
    subtitle: string | null
    buttonText: string | null
    alternateText: string | null
    alternateLinkText: string | null
  } | null
  oauthProviders: Array<{ name: string; enabled: boolean }> | null
}

export interface DashboardPageContent {
  dashboardWelcome: {
    message: string | null
    description: string | null
  } | null
  stats: {
    totalPosts: { label: string; icon: string } | null
    subscription: { label: string; icon: string; proText: string; freeText: string } | null
    profileComplete: { label: string; icon: string } | null
  } | null
  activitySection: {
    title: string | null
    viewAllLink: string | null
    emptyMessage: string | null
    tableHeaders: { title: string; author: string; date: string } | null
  } | null
  defaultAuthor: string | null
}

export interface GenericPageContent {
  content: Array<unknown> | null
}

export interface Page {
  _id: string
  title: string
  pageType: PageType
  slug?: { current: string } | string | null
  description?: string | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    ogImage?: string | null
  } | null
  publishedAt?: string | null
  
  // Home page fields
  heroSection?: HeroSection | null
  ctaButtons?: CTAButton[] | null
  blogSection?: BlogSection | null
  newsletterSection?: NewsletterSection | null
  footerCTA?: FooterCTA | null
  featuredPost?: {
    _id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    author: { name: string; avatar: string | null } | null
  } | null
  showFeaturedPost?: boolean | null
  
  // Auth page fields
  brandName?: string | null
  tagline?: string | null
  features?: Array<{ title: string; description?: string; icon?: string }> | null
  loginPage?: {
    title: string | null
    subtitle: string | null
    buttonText: string | null
    alternateText: string | null
    alternateLinkText: string | null
  } | null
  signupPage?: {
    title: string | null
    subtitle: string | null
    buttonText: string | null
    alternateText: string | null
    alternateLinkText: string | null
  } | null
  oauthProviders?: Array<{ name: string; enabled: boolean }> | null
  
  // Dashboard fields
  dashboardWelcome?: {
    message: string | null
    description: string | null
  } | null
  stats?: {
    totalPosts: { label: string; icon: string } | null
    subscription: { label: string; icon: string; proText: string; freeText: string } | null
    profileComplete: { label: string; icon: string } | null
  } | null
  activitySection?: {
    title: string | null
    viewAllLink: string | null
    emptyMessage: string | null
    tableHeaders: { title: string; author: string; date: string } | null
  } | null
  defaultAuthor?: string | null
  
  // Generic page fields
  content?: Array<unknown> | null
}

// Default fallback values
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
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

export const DEFAULT_HOME_PAGE: HomePageContent = {
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

export const DEFAULT_AUTH_PAGE: AuthPageContent = {
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

export const DEFAULT_DASHBOARD_PAGE: DashboardPageContent = {
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