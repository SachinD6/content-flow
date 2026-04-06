import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialBlock',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'What People Say',
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
          { title: 'Carousel (slider)', value: 'carousel' },
          { title: 'Featured (1 large + 2 small)', value: 'featured' },
          { title: 'Stacked (vertical list)', value: 'stacked' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Author Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Author Role/Company',
              type: 'string',
              description: 'e.g., "CEO at Company"',
            }),
            defineField({
              name: 'avatar',
              title: 'Author Avatar',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'rating',
              title: 'Star Rating',
              type: 'number',
              options: { list: [1, 2, 3, 4, 5] },
            }),
          ],
          preview: {
            select: { title: 'author', subtitle: 'role' },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      testimonials: 'testimonials',
    },
    prepare({ title, testimonials }) {
      return {
        title: title || 'Testimonials',
        subtitle: `${testimonials?.length || 0} testimonials`,
      }
    },
  },
})