import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'containerBlock',
  title: 'Container',
  type: 'object',
  icon: () => '📦',
  description: 'Wrap content with custom width and styling',
  groups: [
    { name: 'layout', title: '📐 Layout' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (640px)', value: 'narrow' },
          { title: 'Medium (768px)', value: 'medium' },
          { title: 'Wide (1024px)', value: 'wide' },
          { title: 'Extra Wide (1280px)', value: 'xwide' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'wide',
      group: 'layout',
    }),
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Extra Large', value: 'xl' },
        ],
      },
      initialValue: 'none',
      group: 'layout',
    }),
    defineField({
      name: 'centerContent',
      title: 'Center Content',
      type: 'boolean',
      initialValue: true,
      group: 'layout',
    }),
    defineField({
      name: 'backgroundType',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'None (transparent)', value: 'none' },
          { title: 'Solid Color', value: 'color' },
          { title: 'Gradient', value: 'gradient' },
          { title: 'Image', value: 'image' },
        ],
      },
      initialValue: 'none',
      group: 'styles',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code',
      hidden: ({ parent }) => parent?.backgroundType !== 'color',
      group: 'styles',
    }),
    defineField({
      name: 'backgroundGradient',
      title: 'Gradient',
      type: 'string',
      description: 'CSS gradient',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
      group: 'styles',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
      group: 'styles',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Full', value: 'full' },
        ],
      },
      initialValue: 'none',
      group: 'styles',
    }),
    defineField({
      name: 'shadow',
      title: 'Shadow',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
        ],
      },
      initialValue: 'none',
      group: 'styles',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Container',
        subtitle: 'Wrapper with custom styling',
      }
    },
  },
})