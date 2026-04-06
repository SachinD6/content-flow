import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'accordionBlock',
  title: 'FAQ / Accordion',
  type: 'object',
  icon: () => '❓',
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
      placeholder: 'Frequently Asked Questions',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      placeholder: 'Find answers to common questions',
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'initiallyOpen',
              title: 'Initially Open',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'allowMultiple',
      title: 'Allow Multiple Open',
      type: 'boolean',
      description: 'Allow multiple items to be expanded at once',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'iconPosition',
      title: 'Icon Position',
      type: 'string',
      options: {
        list: [
          { title: 'Right', value: 'right' },
          { title: 'Left', value: 'left' },
        ],
      },
      initialValue: 'right',
      group: 'display',
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default (bordered)', value: 'default' },
          { title: 'Minimal (no borders)', value: 'minimal' },
          { title: 'Card (elevated)', value: 'card' },
          { title: 'Filled (background)', value: 'filled' },
        ],
      },
      initialValue: 'default',
      group: 'styles',
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
      items: 'items',
    },
    prepare({ title, items }) {
      return {
        title: title || 'FAQ / Accordion',
        subtitle: `${items?.length || 0} questions`,
      }
    },
  },
})