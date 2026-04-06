import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'searchBlock',
  title: 'Search Block',
  type: 'object',
  icon: () => '🔍',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'results', title: '📋 Results' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title above the search bar',
      group: 'content',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder Text',
      type: 'string',
      initialValue: 'Search posts...',
      group: 'content',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Search',
      group: 'content',
    }),
    defineField({
      name: 'searchScope',
      title: 'Search Scope',
      type: 'string',
      options: {
        list: [
          { title: 'Posts Only', value: 'posts' },
          { title: 'Posts & Pages', value: 'all' },
        ],
      },
      initialValue: 'posts',
      group: 'results',
    }),
    defineField({
      name: 'resultsLayout',
      title: 'Results Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Inline (show on same page)', value: 'inline' },
          { title: 'Redirect (go to search page)', value: 'redirect' },
        ],
      },
      initialValue: 'inline',
      group: 'results',
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Show Excerpt in Results',
      type: 'boolean',
      initialValue: true,
      group: 'results',
    }),
    defineField({
      name: 'showAuthor',
      title: 'Show Author in Results',
      type: 'boolean',
      initialValue: true,
      group: 'results',
    }),
    defineField({
      name: 'showDate',
      title: 'Show Date in Results',
      type: 'boolean',
      initialValue: true,
      group: 'results',
    }),
    defineField({
      name: 'limit',
      title: 'Max Results',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(50),
      group: 'results',
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
      placeholder: 'placeholder',
    },
    prepare({ title, placeholder }) {
      return {
        title: title || 'Search Block',
        subtitle: placeholder || 'Search posts...',
      }
    },
  },
})