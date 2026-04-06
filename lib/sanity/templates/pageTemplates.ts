// Page Templates for easy creation
// These are used in sanity.config.ts for initial value templates

export const homepageTemplate = {
  id: 'homepage-template',
  title: 'Homepage (with Hero & Posts)',
  schemaType: 'page',
  value: {
    pageType: 'home',
    title: 'Home',
    components: [
      {
        _type: 'heroBlock',
        title: 'Welcome to ContentFlow',
        subtitle: 'Modern Publishing Platform',
        description: 'Create, manage, and publish amazing content with our powerful CMS-driven platform.',
        backgroundType: 'gradient',
        align: 'center',
        size: 'lg',
        buttons: [
          {
            label: 'Get Started',
            href: '/signup',
            variant: 'primary',
          },
          {
            label: 'Browse Articles',
            href: '/posts',
            variant: 'secondary',
          },
        ],
      },
      {
        _type: 'featuredPostBlock',
        label: 'Featured Story',
        autoSelect: 'featured',
        layout: 'large',
      },
      {
        _type: 'postsGridBlock',
        title: 'Latest Stories',
        subtitle: 'Thoughts, tutorials, and insights',
        layout: 'grid',
        postsSource: 'latest',
        limit: 6,
        viewAllLink: {
          show: true,
          text: 'View all stories',
          href: '/posts',
        },
      },
      {
        _type: 'newsletterBlock',
        title: 'Stay in the loop',
        description: 'Get the latest articles and updates delivered to your inbox.',
        style: 'simple',
      },
    ],
  },
}

export const blogPageTemplate = {
  id: 'blog-page-template',
  title: 'Blog Page',
  schemaType: 'page',
  value: {
    pageType: 'generic',
    title: 'Blog',
    slug: { current: 'blog' },
    description: 'Explore our latest articles, tutorials, and insights.',
    components: [
      {
        _type: 'heroBlock',
        title: 'Our Blog',
        subtitle: 'Resources',
        description: 'Discover insights, tutorials, and stories from our team.',
        backgroundType: 'gradient',
        align: 'center',
        size: 'md',
      },
      {
        _type: 'postsGridBlock',
        layout: 'grid',
        postsSource: 'latest',
        limit: 12,
        viewAllLink: {
          show: false,
        },
      },
    ],
  },
}

export const aboutPageTemplate = {
  id: 'about-page-template',
  title: 'About Page',
  schemaType: 'page',
  value: {
    pageType: 'generic',
    title: 'About Us',
    slug: { current: 'about' },
    description: 'Learn more about our mission and team.',
    components: [
      {
        _type: 'heroBlock',
        title: 'About ContentFlow',
        subtitle: 'Our Story',
        description: 'We\'re building the future of content management for modern teams.',
        backgroundType: 'gradient',
        align: 'center',
        size: 'lg',
      },
      {
        _type: 'featuresBlock',
        title: 'What We Offer',
        layout: 'grid',
        features: [
          {
            title: 'Fast & Modern',
            description: 'Built with the latest technologies for speed and reliability.',
            icon: 'zap',
          },
          {
            title: 'CMS-Driven',
            description: 'Manage all your content from a powerful headless CMS.',
            icon: 'layers',
          },
          {
            title: 'SEO Optimized',
            description: 'Every page is optimized for search engines out of the box.',
            icon: 'globe',
          },
        ],
      },
    ],
  },
}

export const contactPageTemplate = {
  id: 'contact-page-template',
  title: 'Contact Page',
  schemaType: 'page',
  value: {
    pageType: 'generic',
    title: 'Contact Us',
    slug: { current: 'contact' },
    description: 'Get in touch with our team.',
    components: [
      {
        _type: 'heroBlock',
        title: 'Get in Touch',
        subtitle: 'Contact',
        description: 'Have questions? We\'d love to hear from you.',
        backgroundType: 'gradient',
        align: 'center',
        size: 'md',
      },
      {
        _type: 'newsletterBlock',
        title: 'Stay Updated',
        description: 'Subscribe to our newsletter for updates and announcements.',
        style: 'simple',
        showIcon: true,
      },
    ],
  },
}

export const landingPageTemplate = {
  id: 'landing-page-template',
  title: 'Landing Page (Full)',
  schemaType: 'page',
  value: {
    pageType: 'generic',
    title: 'Landing Page',
    slug: { current: 'landing' },
    description: 'A complete landing page template.',
    components: [
      {
        _type: 'heroBlock',
        title: 'Transform Your Content Strategy',
        subtitle: 'Content Management Platform',
        description: 'The all-in-one platform for modern content teams. Create, collaborate, and publish with ease.',
        backgroundType: 'gradient',
        align: 'center',
        size: 'full',
        buttons: [
          {
            label: 'Start Free Trial',
            href: '/signup',
            variant: 'primary',
          },
          {
            label: 'Watch Demo',
            href: '#demo',
            variant: 'secondary',
          },
        ],
      },
      {
        _type: 'featuresBlock',
        title: 'Everything You Need',
        subtitle: 'Powerful features for modern teams',
        layout: 'grid',
        features: [
          {
            title: 'Visual Editor',
            description: 'Intuitive drag-and-drop content building.',
            icon: 'layers',
          },
          {
            title: 'Real-time Collaboration',
            description: 'Work together with your team in real-time.',
            icon: 'users',
          },
          {
            title: 'API-First',
            description: 'Headless CMS with powerful APIs.',
            icon: 'code',
          },
        ],
      },
      {
        _type: 'statsBlock',
        title: 'Trusted by Teams Worldwide',
        layout: 'grid',
        stats: [
          { value: '10K+', label: 'Active Users' },
          { value: '1M+', label: 'Articles Published' },
          { value: '99.9%', label: 'Uptime' },
          { value: '50+', label: 'Countries' },
        ],
      },
      {
        _type: 'ctaBlock',
        title: 'Ready to Get Started?',
        description: 'Join thousands of teams using ContentFlow.',
        buttons: [
          {
            label: 'Start Free Trial',
            href: '/signup',
            variant: 'primary',
          },
        ],
        background: 'gradient',
        align: 'center',
      },
    ],
  },
}

export const allPageTemplates = [
  homepageTemplate,
  blogPageTemplate,
  aboutPageTemplate,
  contactPageTemplate,
  landingPageTemplate,
]