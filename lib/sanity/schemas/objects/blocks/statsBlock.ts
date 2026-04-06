import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'statsBlock',
  title: 'Statistics',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional heading for the stats section',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (horizontal)', value: 'grid' },
          { title: 'Stacked (vertical)', value: 'stacked' },
          { title: 'Inline (horizontal scroll)', value: 'inline' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The main number or value (e.g., "10K+", "99%")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Label below the value (e.g., "Users", "Uptime")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Optional supporting text',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Users', value: 'users' },
                  { title: 'File Text', value: 'file-text' },
                  { title: 'Rocket', value: 'rocket' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Code', value: 'code' },
                  { title: 'Layers', value: 'layers' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Muted', value: 'muted' },
          { title: 'Accent', value: 'accent' },
        ],
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      stats: 'stats',
    },
    prepare({ title, stats }) {
      return {
        title: title || 'Statistics',
        subtitle: `${stats?.length || 0} stats`,
      }
    },
  },
})