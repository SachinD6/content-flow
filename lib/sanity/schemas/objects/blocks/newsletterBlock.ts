import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'newsletterBlock',
  title: 'Newsletter Signup',
  type: 'object',
  icon: () => '📧',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'style', title: '🎨 Style' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      group: 'content',
      initialValue: 'Stay in the loop',
      description: 'Main heading for the newsletter section',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue: 'Get the latest articles and updates delivered to your inbox.',
    }),
    defineField({
      name: 'placeholder',
      title: 'Email Placeholder',
      type: 'string',
      group: 'content',
      initialValue: 'Enter your email',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      group: 'content',
      initialValue: 'Subscribe',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      group: 'content',
      initialValue: 'Thanks for subscribing!',
      description: 'Message shown after successful subscription',
    }),
    defineField({
      name: 'style',
      title: 'Visual Style',
      type: 'string',
      group: 'style',
      options: {
        list: [
          { title: '📝 Simple (inline)', value: 'simple' },
          { title: '📦 Card (boxed)', value: 'card' },
          { title: '📐 Full Width (with background)', value: 'fullWidth' },
        ],
      },
      initialValue: 'simple',
    }),
    defineField({
      name: 'showIcon',
      title: 'Show Email Icon',
      type: 'boolean',
      group: 'style',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      style: 'style',
    },
    prepare({ title, style }) {
      return {
        title: title || 'Newsletter',
        subtitle: `Style: ${style || 'simple'}`,
        media: () => '📧',
      }
    },
  },
})