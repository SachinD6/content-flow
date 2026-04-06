import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  icon: () => '🔘',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'style', title: '🎨 Style' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: '💡 Main heading for the CTA section',
      placeholder: 'Ready to get started?',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      group: 'content',
      placeholder: 'Join thousands of teams using ContentFlow.',
    }),
    defineField({
      name: 'buttons',
      title: 'CTA Buttons',
      type: 'array',
      of: [{ type: 'ctaButton' }],
      group: 'content',
      validation: (Rule) => Rule.min(1).max(3).error('Add 1-3 buttons'),
      description: 'Add 1-3 call-to-action buttons',
    }),
    defineField({
      name: 'background',
      title: 'Background Style',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: '⬜ None (default)', value: 'default' },
          { title: '💜 Gradient (recommended)', value: 'gradient' },
          { title: '📦 Card Style', value: 'card' },
          { title: '↔️ Border', value: 'border' },
        ],
      },
      initialValue: 'gradient',
    }),
    defineField({
      name: 'align',
      title: 'Text Alignment',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: '⬅️ Left', value: 'left' },
          { title: '⏺️ Center', value: 'center' },
          { title: '➡️ Right', value: 'right' },
        ],
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Call to Action',
        subtitle: subtitle ? subtitle.slice(0, 50) + '...' : 'CTA block with buttons',
        media: () => '🔘',
      }
    },
  },
})