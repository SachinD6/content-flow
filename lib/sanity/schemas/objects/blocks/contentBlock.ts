import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contentBlock',
  title: 'Rich Text Content',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
      description: 'Rich text content with support for images',
    }),
    defineField({
      name: 'width',
      title: 'Maximum Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (prose)', value: 'narrow' },
          { title: 'Medium', value: 'medium' },
          { title: 'Wide', value: 'wide' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'narrow',
    }),
    defineField({
      name: 'align',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const firstBlock = content?.find((block: { _type: string }) => block._type === 'block')
      const text = firstBlock?.children?.map((child: { text: string }) => child.text).join('') || ''
      return {
        title: 'Rich Text Content',
        subtitle: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
      }
    },
  },
})