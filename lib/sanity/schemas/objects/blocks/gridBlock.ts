import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gridBlock',
  title: 'Grid Layout',
  type: 'object',
  icon: () => '⊞',
  description: 'Multi-column grid for organizing content',
  groups: [
    { name: 'layout', title: '📐 Layout' },
    { name: 'gap', title: '↔️ Spacing' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [1, 2, 3, 4, 5, 6] },
      initialValue: 2,
      group: 'layout',
    }),
    defineField({
      name: 'columnsMobile',
      title: 'Columns on Mobile',
      type: 'number',
      options: { list: [1, 2] },
      initialValue: 1,
      group: 'layout',
    }),
    defineField({
      name: 'gap',
      title: 'Gap Between Items',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small (1rem)', value: 'sm' },
          { title: 'Medium (1.5rem)', value: 'md' },
          { title: 'Large (2rem)', value: 'lg' },
          { title: 'Extra Large (3rem)', value: 'xl' },
        ],
      },
      initialValue: 'md',
      group: 'gap',
    }),
    defineField({
      name: 'alignItems',
      title: 'Align Items',
      type: 'string',
      options: {
        list: [
          { title: 'Start', value: 'start' },
          { title: 'Center', value: 'center' },
          { title: 'End', value: 'end' },
          { title: 'Stretch', value: 'stretch' },
        ],
      },
      initialValue: 'stretch',
      group: 'layout',
    }),
    defineField({
      name: 'equalHeight',
      title: 'Equal Height Items',
      type: 'boolean',
      initialValue: true,
      description: 'Make all grid items the same height',
      group: 'layout',
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
      columns: 'columns',
    },
    prepare({ columns }) {
      return {
        title: `${columns || 2} Column Grid`,
        subtitle: 'Grid layout block',
      }
    },
  },
})