import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption below the image',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow', value: 'narrow' },
          { title: 'Medium', value: 'medium' },
          { title: 'Wide', value: 'wide' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'rounded',
      title: 'Rounded Corners',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shadow',
      title: 'Shadow',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      media: 'image',
      caption: 'caption',
    },
    prepare({ media, caption }) {
      return {
        title: 'Image',
        subtitle: caption || 'Image block',
        media,
      }
    },
  },
})