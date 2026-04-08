import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'postsGridBlock',
  title: 'Posts Grid',
  type: 'object',
  icon: () => '📰',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'filter', title: '🔍 Filter' },
    { name: 'layout', title: '🎨 Layout' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      group: 'content',
      placeholder: 'Latest Articles',
      description: '💡 Heading for the posts section',
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'string',
      group: 'content',
      placeholder: 'Thoughts, tutorials, and insights',
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: ' Grid (3 columns) ✓', value: 'grid' },
          { title: '📑 List (1 column)', value: 'list' },
          { title: '⭐ Featured (large first)', value: 'featured' },
          { title: '🧱 Masonry', value: 'masonry' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'postsSource',
      title: 'How to select posts?',
      type: 'string',
      group: 'filter',
      options: {
        list: [
          { title: '📅 Latest Posts', value: 'latest' },
          { title: '⭐ Featured Posts', value: 'featured' },
          { title: '🏷️ By Tag', value: 'byTag' },
          { title: '👤 By Author', value: 'byAuthor' },
          { title: '✋ Manually Selected', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'tagFilter',
      title: 'Filter by Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'filter',
      hidden: ({ parent }) => parent?.postsSource !== 'byTag',
      description: 'Show posts with these tags',
    }),
    defineField({
      name: 'authorFilter',
      title: 'Filter by Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'filter',
      hidden: ({ parent }) => parent?.postsSource !== 'byAuthor',
    }),
    defineField({
      name: 'manualPosts',
      title: 'Select Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      group: 'filter',
      hidden: ({ parent }) => parent?.postsSource !== 'manual',
      description: 'Choose which posts to display',
    }),
    defineField({
      name: 'limit',
      title: 'Maximum Posts',
      type: 'number',
      group: 'layout',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(50),
      description: 'How many posts to show (1-50)',
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Empty State Message',
      type: 'string',
      group: 'content',
      initialValue: 'No posts found',
      description: 'Message when no posts are available',
    }),
    defineField({
      name: 'viewAllLink',
      title: 'View All Link',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'show',
          title: 'Show "View All" Link',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'text',
          title: 'Link Text',
          type: 'string',
          initialValue: 'View all posts',
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      source: 'postsSource',
    },
    prepare({ title, layout, source }) {
      return {
        title: title || 'Posts Grid',
        subtitle: `Layout: ${layout || 'grid'} • Source: ${source || 'latest'}`,
        media: () => '📰',
      }
    },
  },
})
