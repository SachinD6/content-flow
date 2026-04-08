import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featuresBlock',
  title: 'Features Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional heading for the features section',
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'string',
      description: 'Supporting text below the title',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (3 columns)', value: 'grid' },
          { title: 'Grid (2 columns)', value: 'grid2' },
          { title: 'List (vertical)', value: 'list' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Rocket', value: 'rocket' },
                  { title: 'Code', value: 'code' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Users', value: 'users' },
                  { title: 'File Text', value: 'file-text' },
                  { title: 'Settings', value: 'settings' },
                  { title: 'Database', value: 'database' },
                  { title: 'Cloud', value: 'cloud' },
                  { title: 'Lock', value: 'lock' },
                ],
              },
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'cmsLink',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      features: 'features',
    },
    prepare({ title, features }) {
      return {
        title: title || 'Features',
        subtitle: `${features?.length || 0} features`,
      }
    },
  },
})
