import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tagsFilterBlock',
  title: 'Tags Filter',
  type: 'object',
  icon: () => '🏷️',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'display', title: '🖥️ Display' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      placeholder: 'Browse by Topic',
      group: 'content',
    }),
    defineField({
      name: 'showAllTag',
      title: 'Show "All" Option',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'allTagLabel',
      title: '"All" Label',
      type: 'string',
      initialValue: 'All Posts',
      hidden: ({ parent }) => !parent?.showAllTag,
      group: 'content',
    }),
    defineField({
      name: 'tagsSource',
      title: 'Tags Source',
      type: 'string',
      options: {
        list: [
          { title: 'All Tags (auto)', value: 'all' },
          { title: 'Manual Selection', value: 'manual' },
        ],
      },
      initialValue: 'all',
      group: 'content',
    }),
    defineField({
      name: 'selectedTags',
      title: 'Selected Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Enter tag names manually',
      hidden: ({ parent }) => parent?.tagsSource !== 'manual',
      group: 'content',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Sidebar (tags on left)', value: 'sidebar' },
          { title: 'Top Bar (tags above posts)', value: 'top' },
          { title: 'Grid (tags as cards)', value: 'grid' },
        ],
      },
      initialValue: 'sidebar',
      group: 'display',
    }),
    defineField({
      name: 'postsLayout',
      title: 'Posts Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
          { title: 'Masonry', value: 'masonry' },
        ],
      },
      initialValue: 'grid',
      group: 'display',
    }),
    defineField({
      name: 'columns',
      title: 'Grid Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
      hidden: ({ parent }) => parent?.postsLayout === 'list',
      group: 'display',
    }),
    defineField({
      name: 'postsPerTag',
      title: 'Posts Per Tag',
      type: 'number',
      description: 'Maximum posts to show per tag',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(20),
      group: 'display',
    }),
    defineField({
      name: 'showPostCount',
      title: 'Show Post Count',
      type: 'boolean',
      description: 'Show number of posts per tag (e.g., "React (5)")',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Show Excerpt',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'showAuthor',
      title: 'Show Author',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'showDate',
      title: 'Show Date',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'styles',
      title: 'Block Styles',
      type: 'blockStyles',
      group: 'styles',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
    },
    prepare({ title, layout }) {
      const layoutLabels: Record<string, string> = {
        sidebar: 'Sidebar',
        top: 'Top Bar',
        grid: 'Grid',
      }
      return {
        title: title || 'Tags Filter',
        subtitle: `${layoutLabels[layout ?? 'sidebar']} layout`,
      }
    },
  },
})