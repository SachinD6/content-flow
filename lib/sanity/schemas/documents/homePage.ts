import { defineType, defineField } from 'sanity'

const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Solid)', value: 'primary' },
          { title: 'Secondary (Outline)', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'external',
      title: 'External Link',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'requiresAuth',
      title: 'Requires Authentication',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
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
      description: 'Call-to-action buttons shown in header/hero area',
    }),
    defineField({
      name: 'blogSection',
      title: 'Blog Section',
      type: 'object',
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
          description: 'Label shown above the articles grid',
        }),
        defineField({
          name: 'discoverLabel',
          title: 'Discover Sidebar Label',
          type: 'string',
          initialValue: 'Discover',
          description: 'Label for the tags sidebar',
        }),
      ],
    }),
    defineField({
      name: 'newsletterSection',
      title: 'Newsletter Section',
      type: 'object',
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
    }),
    defineField({
      name: 'showFeaturedPost',
      title: 'Show Featured Post Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'postsPerPage',
      title: 'Posts Per Page',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(50),
    }),
    defineField({
      name: 'defaultPostOrder',
      title: 'Default Post Order',
      type: 'string',
      options: {
        list: [
          { title: 'Publication Date (Newest)', value: 'publishedAt_desc' },
          { title: 'Publication Date (Oldest)', value: 'publishedAt_asc' },
          { title: 'Manually Ordered', value: 'order' },
        ],
      },
      initialValue: 'publishedAt_desc',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})