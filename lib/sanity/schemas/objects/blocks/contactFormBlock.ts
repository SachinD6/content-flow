import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactFormBlock',
  title: 'Contact Form',
  type: 'object',
  icon: () => '📧',
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'fields', title: '📋 Fields' },
    { name: 'submission', title: '✉️ Submission' },
    { name: 'styles', title: '🎨 Styles' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      placeholder: 'Get in Touch',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      placeholder: 'Have a question? Send us a message.',
      group: 'content',
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Field Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'tel' },
                  { title: 'Textarea', value: 'textarea' },
                  { title: 'Select', value: 'select' },
                  { title: 'Checkbox', value: 'checkbox' },
                ],
              },
              initialValue: 'text',
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'options',
              title: 'Options (for Select)',
              type: 'array',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => parent?.type !== 'select',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'type',
            },
          },
        },
      ],
      initialValue: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
        { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message...' },
      ],
      group: 'fields',
    }),
    defineField({
      name: 'submitButton',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message',
      group: 'content',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      placeholder: 'Thank you! Your message has been sent.',
      group: 'submission',
    }),
    defineField({
      name: 'emailRecipient',
      title: 'Email Recipient',
      type: 'string',
      description: 'Email address to receive form submissions',
      group: 'submission',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Stacked (full width)', value: 'stacked' },
          { title: 'Two Column', value: 'twocolumn' },
        ],
      },
      initialValue: 'stacked',
      group: 'styles',
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Card (with background)', value: 'card' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'default',
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
      fields: 'fields',
    },
    prepare({ title, fields }) {
      return {
        title: title || 'Contact Form',
        subtitle: `${fields?.length || 0} fields`,
      }
    },
  },
})