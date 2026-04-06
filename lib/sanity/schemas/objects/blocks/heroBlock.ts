import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroBlock',
  title: 'Hero Section',
  type: 'object',
  icon: () => '🎯',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'style', title: '🎨 Style' },
    { name: 'buttons', title: '🔘 Buttons' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: '💡 The main headline text - make it impactful!',
      placeholder: 'Build something amazing today',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Tagline',
      type: 'string',
      group: 'content',
      description: 'A short line displayed above the headline',
      placeholder: 'Introducing ContentFlow',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Supporting paragraph text below the headline',
      placeholder: 'The modern content platform for teams who want to ship faster.',
    }),
    defineField({
      name: 'backgroundType',
      title: 'Background Style',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: '✨ Gradient (recommended)', value: 'gradient' },
          { title: '🖼️ Background Image', value: 'image' },
          { title: '🎬 Video Background', value: 'video' },
          { title: '⬜ Solid Color', value: 'solid' },
        ],
        layout: 'radio',
      },
      initialValue: 'gradient',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'style',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
      description: 'Upload an image for the hero background',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'style',
      hidden: ({ parent }) => parent?.backgroundType !== 'solid',
      description: 'Enter a hex color code',
      placeholder: '#0b0c10',
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
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'size',
      title: 'Section Height',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: 'Compact', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Full Screen', value: 'full' },
        ],
      },
      initialValue: 'lg',
    }),
    defineField({
      name: 'buttons',
      title: 'CTA Buttons',
      type: 'array',
      group: 'buttons',
      of: [{ type: 'ctaButton' }],
      description: 'Add 1-2 call-to-action buttons (max 3)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'Large hero with headline and CTA buttons',
        media: () => '🎯',
      }
    },
  },
})