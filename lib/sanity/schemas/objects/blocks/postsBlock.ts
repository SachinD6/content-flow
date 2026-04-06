import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'postsBlock',
  title: 'Posts Block',
  type: 'object',
  groups: [
    { name: 'main', title: '📋 Main' },
    { name: 'layout', title: '📐 Layout' },
    { name: 'display', title: '👁️ Display' },
    { name: 'pagination', title: '📄 Pagination' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    // Main
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional heading above the posts grid',
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional description below the title',
      group: 'main',
    }),

    // Post Source
    defineField({
      name: 'postSource',
      title: 'Post Source',
      type: 'string',
      options: {
        list: [
          { title: 'All Posts', value: 'all' },
          { title: 'By Tag(s)', value: 'tags' },
          { title: 'By Author', value: 'author' },
          { title: 'Featured Only', value: 'featured' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
      group: 'main',
    }),
    defineField({
      name: 'tags',
      title: 'Filter by Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Enter tag names to filter posts',
      group: 'main',
      hidden: ({ parent }) => parent?.postSource !== 'tags',
    }),
    defineField({
      name: 'author',
      title: 'Filter by Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'main',
      hidden: ({ parent }) => parent?.postSource !== 'author',
    }),

    // Layout
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid - 2 Columns', value: 'grid-2' },
          { title: 'Grid - 3 Columns', value: 'grid-3' },
          { title: 'Grid - 4 Columns', value: 'grid-4' },
          { title: 'List - Single Column', value: 'list' },
          { title: 'Featured - Large Hero', value: 'featured' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'grid-3',
      group: 'layout',
    }),
    defineField({
      name: 'columnsMobile',
      title: 'Mobile Columns',
      type: 'number',
      description: 'Number of columns on mobile devices',
      options: {
        list: [
          { title: '1 Column', value: 1 },
          { title: '2 Columns', value: 2 },
        ],
      },
      initialValue: 1,
      group: 'layout',
      validation: (Rule) => Rule.min(1).max(2),
    }),

    // Display Options
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
      name: 'showTags',
      title: 'Show Tags',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'showReadingTime',
      title: 'Show Reading Time',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'imageAspectRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Landscape)', value: '16/9' },
          { title: '4:3 (Standard)', value: '4/3' },
          { title: '1:1 (Square)', value: '1/1' },
          { title: '3:4 (Portrait)', value: '3/4' },
          { title: '2:3 (Tall)', value: '2/3' },
        ],
      },
      initialValue: '16/9',
      group: 'display',
    }),

    // Pagination
    defineField({
      name: 'enablePagination',
      title: 'Enable Pagination',
      type: 'boolean',
      initialValue: true,
      group: 'pagination',
    }),
    defineField({
      name: 'paginationMode',
      title: 'Pagination Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Numbered Pages', value: 'numbered' },
          { title: 'Infinite Scroll', value: 'infinite' },
          { title: 'Load More Button', value: 'loadMore' },
        ],
      },
      initialValue: 'numbered',
      group: 'pagination',
      hidden: ({ parent }) => parent?.enablePagination === false,
    }),
    defineField({
      name: 'postsPerPage',
      title: 'Posts Per Page',
      type: 'number',
      description: 'Number of posts to show per page/load',
      initialValue: 6,
      group: 'pagination',
      validation: (Rule) => Rule.min(1).max(50),
      hidden: ({ parent }) => parent?.enablePagination === false,
    }),
    defineField({
      name: 'maxPosts',
      title: 'Maximum Posts',
      type: 'number',
      description: 'Maximum total posts to display (0 for unlimited)',
      initialValue: 0,
      group: 'pagination',
      hidden: ({ parent }) => parent?.enablePagination === false,
    }),

    // Styles
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
      pagination: 'paginationMode',
      source: 'postSource',
    },
    prepare(selection) {
      const { title, layout, pagination, source } = selection as {
        title?: string
        layout?: string
        pagination?: string
        source?: string
      }
      const layoutLabels: Record<string, string> = {
        'grid-2': '2 Col Grid',
        'grid-3': '3 Col Grid',
        'grid-4': '4 Col Grid',
        list: 'List',
        featured: 'Featured',
      }
      const sourceLabels: Record<string, string> = {
        all: 'All',
        tags: 'By Tag',
        author: 'By Author',
        featured: 'Featured',
      }
      return {
        title: title || 'Posts Block',
        subtitle: `${layoutLabels[layout || 'grid-3']} • ${sourceLabels[source || 'all']} • ${pagination || 'Numbered'}`,
      }
    },
  },
})