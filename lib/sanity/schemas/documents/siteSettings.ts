import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: '🏷️ General' },
    { name: 'languages', title: '🌐 Languages' },
    { name: 'navigation', title: '🔗 Navigation' },
    { name: 'footer', title: '📄 Footer' },
  ],
  fields: [
    // ==================== GENERAL ====================
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'ContentFlow',
      group: 'general',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      initialValue: 'A modern publishing platform for writers, creators, and thinkers.',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
    }),

    // ==================== LANGUAGES ====================
    defineField({
      name: 'supportedLanguages',
      title: 'Supported Languages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'language' }] }],
      description: 'Languages available for this site',
      validation: (Rule) => Rule.min(1).error('At least one language is required'),
      group: 'languages',
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Default Language',
      type: 'reference',
      to: [{ type: 'language' }],
      description: 'The default language for the site',
      group: 'languages',
    }),

    // ==================== NAVIGATION ====================
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Main navigation shown in header',
      group: 'navigation',
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [{ type: 'navGroup' }],
      description: 'Navigation groups shown in footer',
      group: 'navigation',
    }),
    defineField({
      name: 'dashboardNav',
      title: 'Dashboard Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Links shown in dashboard sidebar',
      group: 'navigation',
    }),
    defineField({
      name: 'authNav',
      title: 'Auth Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'User menu when logged in',
      group: 'navigation',
    }),
    defineField({
      name: 'guestNav',
      title: 'Guest Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Links shown when logged out',
      group: 'navigation',
    }),

    // ==================== FOOTER ====================
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'text',
      rows: 3,
      initialValue: 'A modern publishing platform for writers, creators, and thinkers.',
      group: 'footer',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: '© 2026 ContentFlow. All rights reserved.',
      group: 'footer',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Facebook', value: 'facebook' },
                ],
              },
            }),
            defineField({ name: 'url', type: 'url', validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }) }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'privacy',
          title: 'Privacy Policy',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Privacy Policy' }),
            defineField({ name: 'href', type: 'string', initialValue: '/privacy' }),
          ],
        }),
        defineField({
          name: 'terms',
          title: 'Terms of Service',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Terms of Service' }),
            defineField({ name: 'href', type: 'string', initialValue: '/terms' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', subtitle: 'siteDescription' },
    prepare(selection) {
      const { title, subtitle } = selection as { title?: string; subtitle?: string }
      return { title: title || 'Site Settings', subtitle }
    },
  },
})