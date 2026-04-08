import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamBlock',
  title: 'Team Grid',
  type: 'object',
  icon: () => '👥',
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
      placeholder: 'Meet Our Team',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      placeholder: 'The people behind the product',
      group: 'content',
    }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              placeholder: 'CEO & Founder',
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'bio',
              title: 'Bio',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'socialLinks',
              title: 'Social Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'platform',
                      title: 'Platform',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Twitter', value: 'twitter' },
                          { title: 'LinkedIn', value: 'linkedin' },
                          { title: 'GitHub', value: 'github' },
                          { title: 'Website', value: 'website' },
                          { title: 'Email', value: 'email' },
                        ],
                      },
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Internal', value: 'internal' },
                          { title: 'External', value: 'external' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'external',
                    }),
                    defineField({
                      name: 'page',
                      title: 'Internal Page',
                      type: 'reference',
                      to: [{ type: 'page' }],
                      hidden: ({ parent }) => parent?.linkType !== 'internal',
                    }),
                    defineField({
                      name: 'href',
                      title: 'External URL',
                      type: 'string',
                      hidden: ({ parent }) => parent?.linkType !== 'external',
                    }),
                    defineField({
                      name: 'target',
                      title: 'Open In',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Same tab', value: '_self' },
                          { title: 'New tab', value: '_blank' },
                        ],
                      },
                      initialValue: '_blank',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'platform',
                      page: 'page.title',
                      href: 'href',
                    },
                    prepare({ title, page, href }) {
                      return {
                        title: title || 'Social link',
                        subtitle: page || href || 'No link selected',
                      }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'image',
            },
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'columns',
      title: 'Grid Columns',
      type: 'number',
      options: { list: [2, 3, 4, 5] },
      initialValue: 4,
      group: 'display',
    }),
    defineField({
      name: 'showBio',
      title: 'Show Bio',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'showSocial',
      title: 'Show Social Links',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Circle Photos', value: 'circle' },
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
      members: 'members',
    },
    prepare({ title, members }) {
      return {
        title: title || 'Team Grid',
        subtitle: `${members?.length || 0} members`,
      }
    },
  },
})
