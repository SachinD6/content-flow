import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'separatorBlock',
  title: 'Separator',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Line', value: 'line' },
          { title: 'Dots', value: 'dots' },
          { title: 'Gradient', value: 'gradient' },
          { title: 'Space', value: 'space' },
        ],
      },
      initialValue: 'line',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
        ],
      },
      initialValue: 'md',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Default (muted)', value: 'default' },
          { title: 'Accent (purple)', value: 'accent' },
          { title: 'Light', value: 'light' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      style: 'style',
    },
    prepare({ style }) {
      return {
        title: 'Separator',
        subtitle: `Style: ${style || 'line'}`,
      }
    },
  },
})