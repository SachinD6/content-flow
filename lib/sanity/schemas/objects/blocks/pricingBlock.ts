import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pricingBlock',
  title: 'Pricing Table',
  type: 'object',
  icon: () => '💰',
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
      placeholder: 'Simple, transparent pricing',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      placeholder: 'Choose the perfect plan for your needs',
      group: 'content',
    }),
    defineField({
      name: 'plans',
      title: 'Pricing Plans',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Plan Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              validation: (Rule) => Rule.required(),
              placeholder: '$29',
            }),
            defineField({
              name: 'period',
              title: 'Billing Period',
              type: 'string',
              placeholder: '/month',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              placeholder: 'Perfect for individuals',
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'highlighted',
              title: 'Highlighted',
              type: 'boolean',
              description: 'Mark as recommended/popular',
              initialValue: false,
            }),
            defineField({
              name: 'highlightLabel',
              title: 'Highlight Label',
              type: 'string',
              placeholder: 'Most Popular',
              hidden: ({ parent }) => !parent?.highlighted,
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              placeholder: 'Get Started',
            }),
            defineField({
              name: 'buttonHref',
              title: 'Button Link',
              type: 'string',
              placeholder: '/signup',
              hidden: true,
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'cmsLink',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
            },
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
      group: 'display',
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'Table', value: 'table' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'cards',
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
      plans: 'plans',
    },
    prepare({ title, plans }) {
      return {
        title: title || 'Pricing Table',
        subtitle: `${plans?.length || 0} plans`,
      }
    },
  },
})
