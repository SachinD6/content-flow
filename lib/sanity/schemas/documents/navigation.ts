import { defineType, defineField } from 'sanity'

const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'external',
      title: 'External Link',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'requiresAuth',
      title: 'Requires Authentication',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'authOnly',
      title: 'Show Only When Logged In',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'guestOnly',
      title: 'Show Only When Logged Out',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})

const navGroup = defineType({
  name: 'navGroup',
  title: 'Navigation Group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Group Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Main navigation links shown in the header',
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [{ type: 'navGroup' }],
      description: 'Navigation groups shown in the footer',
    }),
    defineField({
      name: 'dashboardNav',
      title: 'Dashboard Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Navigation items shown in the dashboard sidebar',
    }),
    defineField({
      name: 'authNav',
      title: 'Auth Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Navigation shown when user is logged in (user menu)',
    }),
    defineField({
      name: 'guestNav',
      title: 'Guest Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Navigation shown when user is logged out',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})