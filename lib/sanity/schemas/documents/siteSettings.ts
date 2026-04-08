import { defineField, defineType } from 'sanity'

const defineLegalLinkFields = () => [
  defineField({ name: 'label', title: 'Label', type: 'string' }),
  defineField({
    name: 'linkType',
    title: 'Link Type',
    type: 'string',
    options: {
      list: [
        { title: 'Internal', value: 'internal' },
        { title: 'External', value: 'external' },
      ],
      layout: 'radio',
    },
    initialValue: 'internal',
  }),
  defineField({
    name: 'page',
    title: 'Internal Page',
    type: 'reference',
    to: [{ type: 'page' }],
    hidden: ({ parent }) => parent?.linkType !== 'internal',
  }),
  defineField({
    name: 'href',
    title: 'External URL',
    type: 'string',
    hidden: ({ parent }) => parent?.linkType !== 'external',
  }),
  defineField({
    name: 'target',
    title: 'Open In',
    type: 'string',
    options: {
      list: [
        { title: 'Same tab', value: '_self' },
        { title: 'New tab', value: '_blank' },
      ],
    },
    initialValue: '_self',
  }),
]

const defineNotFoundLanguageFields = (defaults: {
  eyebrow: string
  title: string
  description: string
  primaryButtonLabel: string
  secondaryButtonLabel: string
}) => [
  defineField({
    name: 'eyebrow',
    title: 'Eyebrow',
    type: 'string',
    initialValue: defaults.eyebrow,
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    initialValue: defaults.title,
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    initialValue: defaults.description,
  }),
  defineField({
    name: 'primaryButtonLabel',
    title: 'Primary Button Label',
    type: 'string',
    initialValue: defaults.primaryButtonLabel,
  }),
  defineField({
    name: 'secondaryButtonLabel',
    title: 'Secondary Button Label',
    type: 'string',
    initialValue: defaults.secondaryButtonLabel,
  }),
]

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'languages', title: 'Languages' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'experience', title: 'Experience' },
  ],
  fields: [
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
      initialValue:
        'A modern publishing platform for writers, creators, and thinkers.',
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
    defineField({
      name: 'supportedLanguages',
      title: 'Supported Languages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'language' }] }],
      description: 'Languages available for this site',
      validation: (Rule) =>
        Rule.min(1).error('At least one language is required'),
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
    defineField({
      name: 'notFoundPage',
      title: '404 Page',
      type: 'object',
      description:
        'Content shown when a page URL does not exist. English is used for normal routes, Hindi for /hi routes.',
      group: 'experience',
      fields: [
        defineField({
          name: 'english',
          title: 'English Copy',
          type: 'object',
          fields: defineNotFoundLanguageFields({
            eyebrow: '404 Error',
            title: 'Page not found',
            description:
              "The page you're looking for doesn't exist, was moved, or is not published yet.",
            primaryButtonLabel: 'Go to homepage',
            secondaryButtonLabel: 'Browse posts',
          }),
        }),
        defineField({
          name: 'hindi',
          title: 'Hindi Copy',
          type: 'object',
          fields: defineNotFoundLanguageFields({
            eyebrow: '404 त्रुटि',
            title: 'पेज नहीं मिला',
            description:
              'जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है, हटाया जा चुका है, या अभी प्रकाशित नहीं हुआ है।',
            primaryButtonLabel: 'होमपेज पर जाएँ',
            secondaryButtonLabel: 'पोस्ट्स देखें',
          }),
        }),
      ],
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'text',
      rows: 3,
      initialValue:
        'A modern publishing platform for writers, creators, and thinkers.',
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
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Internal', value: 'internal' },
                  { title: 'External', value: 'external' },
                ],
                layout: 'radio',
              },
              initialValue: 'external',
            }),
            defineField({
              name: 'page',
              title: 'Internal Page',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent?.linkType !== 'internal',
            }),
            defineField({
              name: 'href',
              title: 'External URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({ scheme: ['http', 'https'] }),
              hidden: ({ parent }) => parent?.linkType !== 'external',
            }),
            defineField({
              name: 'target',
              title: 'Open In',
              type: 'string',
              options: {
                list: [
                  { title: 'Same tab', value: '_self' },
                  { title: 'New tab', value: '_blank' },
                ],
              },
              initialValue: '_blank',
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'href', page: 'page.title' },
            prepare({ title, subtitle, page }) {
              return {
                title,
                subtitle: page || subtitle,
              }
            },
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
          fields: defineLegalLinkFields(),
          initialValue: {
            label: 'Privacy Policy',
            linkType: 'internal',
          },
        }),
        defineField({
          name: 'terms',
          title: 'Terms of Service',
          type: 'object',
          fields: defineLegalLinkFields(),
          initialValue: {
            label: 'Terms of Service',
            linkType: 'internal',
          },
        }),
        defineField({
          name: 'cookies',
          title: 'Cookies',
          type: 'object',
          fields: defineLegalLinkFields(),
          initialValue: {
            label: 'Cookies',
            linkType: 'internal',
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', subtitle: 'siteDescription' },
    prepare(selection) {
      const { title, subtitle } = selection as {
        title?: string
        subtitle?: string
      }

      return { title: title || 'Site Settings', subtitle }
    },
  },
})
