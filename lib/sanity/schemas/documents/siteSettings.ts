import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'ContentFlow',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      initialValue: 'A modern publishing platform for writers, creators, and thinkers.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: '© 2026 ContentFlow. All rights reserved.',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'text',
      rows: 3,
      initialValue: 'A modern publishing platform for writers, creators, and thinkers. Share your stories with the world and grow your audience.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', options: {
              list: [
                { title: 'Twitter/X', value: 'twitter' },
                { title: 'LinkedIn', value: 'linkedin' },
                { title: 'GitHub', value: 'github' },
                { title: 'Instagram', value: 'instagram' },
                { title: 'YouTube', value: 'youtube' },
                { title: 'Facebook', value: 'facebook' },
              ]
            }}),
            defineField({ name: 'url', type: 'url', validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }) }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'object',
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
        defineField({
          name: 'cookies',
          title: 'Cookies',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', initialValue: 'Cookies' }),
            defineField({ name: 'href', type: 'string', initialValue: '/cookies' }),
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