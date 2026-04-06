import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featuredPostBlock',
  title: 'Featured Post',
  type: 'object',
  icon: () => '⭐',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'style', title: '🎨 Style' },
  ],
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      group: 'content',
      initialValue: 'Featured Story',
      description: 'Small label shown above the featured post',
    }),
    defineField({
      name: 'post',
      title: 'Featured Post',
      type: 'reference',
      to: [{ type: 'post' }],
      group: 'content',
      description: 'Manually select a post, or leave empty for automatic selection',
    }),
    defineField({
      name: 'autoSelect',
      title: 'Auto Selection Method',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: '⭐ Featured Posts', value: 'featured' },
          { title: '📅 Latest Post', value: 'latest' },
          { title: '🔥 Most Viewed', value: 'mostViewed' },
          { title: '✋ Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'featured',
      description: 'How to select the featured post if not manually chosen',
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: '📰 Large (full width)', value: 'large' },
          { title: '📑 Medium (card)', value: 'medium' },
          { title: '↔️ Split (text + image)', value: 'split' },
        ],
      },
      initialValue: 'large',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      postTitle: 'post.title',
    },
    prepare({ title, postTitle }) {
      return {
        title: title || 'Featured Post',
        subtitle: postTitle || 'Auto-selected',
        media: () => '⭐',
      }
    },
  },
})