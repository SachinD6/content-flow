import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'main', title: '📄 Main' },
    { name: 'content', title: '✏️ Content' },
    { name: 'settings', title: '⚙️ Settings' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    // Main
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
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in post cards and SEO',
      group: 'main',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      group: 'main',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'main',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'reference',
      to: [{ type: 'language' }],
      description: 'Language for this post',
      group: 'main',
    }),

    // Content
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      group: 'content',
    }),

    // Settings
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Publication date and time',
      group: 'settings',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'settings',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
      description: 'Show as featured on homepage',
      group: 'settings',
    }),
    defineField({
      name: 'mostViewed',
      title: 'Most Viewed',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as most viewed',
      group: 'settings',
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Display on homepage',
      group: 'settings',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Auto-calculated if empty',
      group: 'settings',
    }),
    defineField({
      name: 'translationOf',
      title: 'Translation Of',
      type: 'reference',
      to: [{ type: 'post' }],
      description: 'Link to original if this is a translation',
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
      group: 'settings',
    }),

    // SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (defaults to post title)',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'SEO description (defaults to excerpt)',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Recent',
      name: 'recent',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})