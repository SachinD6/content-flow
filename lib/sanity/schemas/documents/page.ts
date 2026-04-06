import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'main', title: '📄 Main' },
    { name: 'content', title: '🧱 Content' },
    { name: 'auth', title: '🔐 Auth Settings' },
    { name: 'dashboard', title: '📊 Dashboard Settings' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    // ==================== MAIN FIELDS ====================
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
        slugify: (input: string) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 200),
      },
      description: 'URL path for this page',
      group: 'main',
    }),
    
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: '🏠 Homepage', value: 'home' },
          { title: '📄 Generic Page', value: 'generic' },
          { title: '🔐 Auth Page', value: 'auth' },
          { title: '📊 Dashboard', value: 'dashboard' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Select the type of page',
      group: 'main',
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description shown in previews',
      group: 'main',
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'reference',
      to: [{ type: 'language' }],
      description: 'Language for this page',
      group: 'main',
    }),
    
    defineField({
      name: 'translationOf',
      title: 'Translation Of',
      type: 'reference',
      to: [{ type: 'page' }],
      description: 'Link to original page if this is a translation',
      options: {
        filter: ({ document }) => {
          const language = (document as { language?: { _ref?: string } })?.language?._ref
          if (!language) return { filter: 'true' }
          return {
            filter: 'language._ref != $language',
            params: { language },
          }
        },
      },
      group: 'main',
    }),

    // ==================== CONTENT BUILDER ====================
    defineField({
      name: 'components',
      title: 'Page Content',
      type: 'array',
      of: [
        // Layout
        { type: 'containerBlock', title: 'Container' },
        { type: 'gridBlock', title: 'Grid Layout' },
        { type: 'separatorBlock', title: 'Separator' },
        // Content
        { type: 'heroBlock', title: 'Hero Section' },
        { type: 'contentBlock', title: 'Rich Text' },
        { type: 'imageBlock', title: 'Image' },
        { type: 'codeBlock', title: 'Code Block' },
        { type: 'videoBlock', title: 'Video Embed' },
        // Posts
        { type: 'postsGridBlock', title: 'Posts Grid' },
        { type: 'featuredPostBlock', title: 'Featured Post' },
        { type: 'searchBlock', title: 'Search' },
        { type: 'tagsFilterBlock', title: 'Tags Filter' },
        // Marketing
        { type: 'ctaBlock', title: 'Call to Action' },
        { type: 'newsletterBlock', title: 'Newsletter' },
        { type: 'pricingBlock', title: 'Pricing Table' },
        // Social
        { type: 'statsBlock', title: 'Statistics' },
        { type: 'testimonialBlock', title: 'Testimonials' },
        { type: 'teamBlock', title: 'Team Grid' },
        { type: 'featuresBlock', title: 'Features Grid' },
        // Interactive
        { type: 'contactFormBlock', title: 'Contact Form' },
        { type: 'accordionBlock', title: 'FAQ / Accordion' },
      ],
      description: 'Build your page by adding and arranging content blocks',
      group: 'content',
    }),

    // ==================== AUTH PAGE SETTINGS ====================
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'ContentFlow',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'CMS-driven publishing for engineering teams.',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'icon',
              type: 'string',
              options: {
                list: [
                  { title: '🚀 Rocket', value: 'rocket' },
                  { title: '💻 Code', value: 'code' },
                  { title: '📚 Layers', value: 'layers' },
                  { title: '⚡ Zap', value: 'zap' },
                  { title: '🛡️ Shield', value: 'shield' },
                  { title: '👥 Users', value: 'users' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'loginPage',
      title: 'Login Page',
      type: 'object',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Welcome back' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign in to your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign in' }),
      ],
    }),
    
    defineField({
      name: 'signupPage',
      title: 'Signup Page',
      type: 'object',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Create an account' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign up for your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign up' }),
      ],
    }),
    
    defineField({
      name: 'oauthProviders',
      title: 'OAuth Providers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              options: {
                list: [
                  { title: 'Google', value: 'google' },
                  { title: 'GitHub', value: 'github' },
                ],
              },
            }),
            defineField({ name: 'enabled', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'name' },
          },
        },
      ],
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),

    // ==================== DASHBOARD SETTINGS ====================
    defineField({
      name: 'dashboardWelcome',
      title: 'Welcome Message',
      type: 'object',
      group: 'dashboard',
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'message',
          type: 'string',
          description: "Use {name} for user's name",
          initialValue: 'Welcome back, {name}',
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 2,
          initialValue: 'Here is what is happening across your content ecosystem today.',
        }),
      ],
    }),
    
    defineField({
      name: 'stats',
      title: 'Dashboard Stats',
      type: 'object',
      group: 'dashboard',
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'totalPosts',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Total Posts' }),
          ],
        }),
        defineField({
          name: 'subscription',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Subscription Plan' }),
            defineField({ name: 'proText', type: 'string', initialValue: 'Unlimited access' }),
            defineField({ name: 'freeText', type: 'string', initialValue: 'Basic limits' }),
          ],
        }),
      ],
    }),

    // ==================== SEO ====================
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override page title for SEO',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Override description for SEO',
        }),
        defineField({
          name: 'ogImage',
          title: 'OpenGraph Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Image shown when shared on social media',
        }),
      ],
    }),
    
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Publication date for sorting',
      group: 'seo',
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { title, subtitle, slug } = selection as { title?: string; subtitle?: string; slug?: string }
      const pageTypeLabels: Record<string, string> = {
        home: '🏠 Homepage',
        auth: '🔐 Auth',
        dashboard: '📊 Dashboard',
        generic: '📄 Page',
      }
      return {
        title: title || 'Untitled',
        subtitle: slug ? `${pageTypeLabels[subtitle ?? ''] || subtitle} — /${slug}` : pageTypeLabels[subtitle ?? ''] || subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Recent',
      name: 'recent',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})