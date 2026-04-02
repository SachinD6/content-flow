import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    // Page Type Selector
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'home' },
          { title: 'Auth Pages', value: 'auth' },
          { title: 'Dashboard', value: 'dashboard' },
          { title: 'Generic Page', value: 'generic' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Select the type of page. Only one Homepage, Auth, and Dashboard page can exist.',
    }),
    
    // Basic Fields (all page types)
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      description: 'URL path for generic pages.Ignored for home/auth/dashboard.',
      hidden: ({ document }) => document?.pageType !== 'generic',
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Meta description for SEO.',
    }),

    // ==================== HOMEPAGE FIELDS ====================
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'home',
      fields: [
        defineField({
          name: 'featuredLabel',
          title: 'Featured Label',
          type: 'string',
          initialValue: 'Featured Story',
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Optional - displayed above featured post',
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [{ type: 'ctaButton' }],
      hidden: ({ document }) => !['home', 'generic'].includes(document?.pageType as string ?? ''),
    }),
    
    defineField({
      name: 'blogSection',
      title: 'Blog Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'home',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Latest Stories',
        }),
        defineField({
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'string',
          initialValue: 'Thoughts, tutorials, and insights',
        }),
        defineField({
          name: 'emptyMessage',
          title: 'Empty State Message',
          type: 'string',
          initialValue: 'No stories found',
        }),
        defineField({
          name: 'emptyDescription',
          title: 'Empty State Description',
          type: 'string',
          initialValue: 'Try adjusting your search',
        }),
        defineField({
          name: 'latestArticlesLabel',
          title: 'Latest Articles Label',
          type: 'string',
          initialValue: 'Latest Articles',
        }),
        defineField({
          name: 'discoverLabel',
          title: 'Discover Sidebar Label',
          type: 'string',
          initialValue: 'Discover',
        }),
      ],
    }),
    
    defineField({
      name: 'newsletterSection',
      title: 'Newsletter Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => !['home', 'generic'].includes(document?.pageType as string ?? ''),
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Stay in the loop',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'Get the latest articles and updates delivered to your inbox.',
        }),
        defineField({
          name: 'placeholder',
          title: 'Email Placeholder',
          type: 'string',
          initialValue: 'Enter your email',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Subscribe',
        }),
        defineField({
          name: 'enabled',
          title: 'Show Newsletter Section',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    
    defineField({
      name: 'footerCTA',
      title: 'Footer CTA Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'home',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Footer CTA',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Ready to share your story?',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'buttons',
          title: 'CTA Buttons',
          type: 'array',
          of: [{ type: 'ctaButton' }],
        }),
      ],
    }),
    
    defineField({
      name: 'featuredPost',
      title: 'Featured Post',
      type: 'reference',
      to: [{ type: 'post' }],
      description: 'Manually select a featured post, or leave empty for automatic selection',
      hidden: ({ document }) => document?.pageType !== 'home',
    }),
    
    defineField({
      name: 'showFeaturedPost',
      title: 'Show Featured Post Section',
      type: 'boolean',
      initialValue: true,
      hidden: ({ document }) => document?.pageType !== 'home',
    }),

    // ==================== AUTH PAGE FIELDS ====================
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'ContentFlow',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'CMS-driven publishing for engineering teams.',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'features',
      title: 'Feature List',
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
                  { title: 'Rocket', value: 'rocket' },
                  { title: 'Code', value: 'code' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Users', value: 'users' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    
    defineField({
      name: 'loginPage',
      title: 'Login Page',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Welcome back' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign in to your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign in' }),
        defineField({ name: 'alternateText', type: 'string', initialValue: "Don't have an account?" }),
        defineField({ name: 'alternateLinkText', type: 'string', initialValue: 'Sign up' }),
      ],
    }),
    
    defineField({
      name: 'signupPage',
      title: 'Signup Page',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Create an account' }),
        defineField({ name: 'subtitle', type: 'string', initialValue: 'Sign up for your workspace' }),
        defineField({ name: 'buttonText', type: 'string', initialValue: 'Sign up' }),
        defineField({ name: 'alternateText', type: 'string', initialValue: 'Already have an account?' }),
        defineField({ name: 'alternateLinkText', type: 'string', initialValue: 'Sign in' }),
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
                  { title: 'Apple', value: 'apple' },
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
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),

    // ==================== DASHBOARD FIELDS ====================
    defineField({
      name: 'dashboardWelcome',
      title: 'Welcome Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'message',
          title: 'Welcome Message Template',
          type: 'string',
          description: "Use {name} to insert the user's name",
          initialValue: 'Welcome back, {name}',
        }),
        defineField({
          name: 'description',
          title: 'Welcome Description',
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
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'totalPosts',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Total Posts' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'file-text' }),
          ],
        }),
        defineField({
          name: 'subscription',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Subscription Plan' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'credit-card' }),
            defineField({ name: 'proText', type: 'string', initialValue: 'Unlimited access to all nodes' }),
            defineField({ name: 'freeText', type: 'string', initialValue: 'Basic publishing limits active' }),
          ],
        }),
        defineField({
          name: 'profileComplete',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Profile Complete' }),
            defineField({ name: 'icon', type: 'string', initialValue: 'user-check' }),
          ],
        }),
      ],
    }),
    
    defineField({
      name: 'activitySection',
      title: 'Activity Section',
      type: 'object',
      options: { collapsible: true },
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Recent Content Activity' }),
        defineField({ name: 'viewAllLink', type: 'string', initialValue: 'View all architecture' }),
        defineField({ name: 'emptyMessage', type: 'string', initialValue: 'No recent architectural entries recorded yet.' }),
        defineField({
          name: 'tableHeaders',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', initialValue: 'Node Title' }),
            defineField({ name: 'author', type: 'string', initialValue: 'Architect' }),
            defineField({ name: 'date', type: 'string', initialValue: 'Publication Date' }),
          ],
        }),
      ],
    }),
    
    defineField({
      name: 'defaultAuthor',
      title: 'Default Author Name',
      type: 'string',
      initialValue: 'Generic System',
      hidden: ({ document }) => document?.pageType !== 'dashboard',
    }),

    // ==================== GENERIC PAGE FIELDS ====================
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
      hidden: ({ document }) => document?.pageType !== 'generic',
    }),

    // ==================== SEO FIELDS (all page types) ====================
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the default page title for SEO',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Override the default description for SEO',
        }),
        defineField({
          name: 'ogImage',
          title: 'OpenGraph Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When this page was published (optional)',
      hidden: ({ document }) => document?.pageType !== 'generic',
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
        home: 'Homepage',
        auth: 'Auth Pages',
        dashboard: 'Dashboard',
        generic: 'Generic',
      }
      return {
        title: title || 'Untitled',
        subtitle: slug ? `${pageTypeLabels[subtitle ?? ''] || subtitle} — /${slug}` : pageTypeLabels[subtitle ?? ''] || subtitle,
      }
    },
  },
})