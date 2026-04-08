import { defineField, defineType } from 'sanity'

import heroBlock from './blocks/heroBlock'
import postsGridBlock from './blocks/postsGridBlock'
import ctaBlock from './blocks/ctaBlock'
import newsletterBlock from './blocks/newsletterBlock'
import contentBlock from './blocks/contentBlock'
import imageBlock from './blocks/imageBlock'
import featuredPostBlock from './blocks/featuredPostBlock'
import statsBlock from './blocks/statsBlock'
import separatorBlock from './blocks/separatorBlock'
import testimonialBlock from './blocks/testimonialBlock'
import featuresBlock from './blocks/featuresBlock'
import searchBlock from './blocks/searchBlock'
import tagsFilterBlock from './blocks/tagsFilterBlock'
import codeBlock from './blocks/codeBlock'
import videoBlock from './blocks/videoBlock'
import containerBlock from './blocks/containerBlock'
import gridBlock from './blocks/gridBlock'
import accordionBlock from './blocks/accordionBlock'
import pricingBlock from './blocks/pricingBlock'
import contactFormBlock from './blocks/contactFormBlock'
import teamBlock from './blocks/teamBlock'
import blockStyles from './blockStyles'

const navChildItem = defineType({
  name: 'navChildItem',
  title: 'Dropdown Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
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
      description: 'Paste the full external link.',
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
      initialValue: '_self',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional icon name for supported frontend nav styles.',
    }),
  ],
  preview: {
    select: { title: 'label', href: 'href', page: 'page.title' },
    prepare({ title, href, page }) {
      return {
        title: title || 'Untitled link',
        subtitle: page || href || 'No link set',
      }
    },
  },
})

const cmsLink = defineType({
  name: 'cmsLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Link Text',
      type: 'string',
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
      initialValue: 'internal',
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
      initialValue: '_self',
    }),
  ],
  preview: {
    select: { title: 'text', href: 'href', page: 'page.title' },
    prepare({ title, href, page }) {
      return {
        title: title || 'Link',
        subtitle: page || href || 'No link selected',
      }
    },
  },
})

const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text visitors click.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      description: 'Choose an internal page or an external URL.',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
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
      description: 'Paste the full external link.',
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
      initialValue: '_self',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional icon name for supported frontend nav styles.',
    }),
    defineField({
      name: 'children',
      title: 'Dropdown Items',
      type: 'array',
      description: 'Optional one-level dropdown links.',
      of: [{ type: 'navChildItem' }],
    }),
    defineField({
      name: 'external',
      title: 'Legacy External Link',
      type: 'boolean',
      description: 'Kept for old content. Prefer Link Type for new links.',
      initialValue: false,
      hidden: true,
    }),
    defineField({
      name: 'requiresAuth',
      title: 'Requires Login',
      type: 'boolean',
      description: 'Hide this link unless the visitor is logged in.',
      initialValue: false,
    }),
    defineField({
      name: 'authOnly',
      title: 'Only Show When Logged In',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'guestOnly',
      title: 'Only Show When Logged Out',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', href: 'href', page: 'page.title' },
    prepare({ title, href, page }) {
      return {
        title: title || 'Untitled link',
        subtitle: page || href || 'No link set',
      }
    },
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

const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Solid)', value: 'primary' },
          { title: 'Secondary (Outline)', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
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
      initialValue: 'internal',
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
      initialValue: '_self',
    }),
    defineField({
      name: 'external',
      title: 'External Link',
      type: 'boolean',
      initialValue: false,
      hidden: true,
    }),
    defineField({
      name: 'requiresAuth',
      title: 'Requires Authentication',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', href: 'href', page: 'page.title' },
    prepare({ title, href, page }) {
      return {
        title: title || 'Button',
        subtitle: page || href || 'No link selected',
      }
    },
  },
})

export const objects = [
  cmsLink,
  navChildItem,
  navItem,
  navGroup,
  ctaButton,
  blockStyles,
  containerBlock,
  gridBlock,
  separatorBlock,
  heroBlock,
  contentBlock,
  imageBlock,
  codeBlock,
  videoBlock,
  postsGridBlock,
  featuredPostBlock,
  searchBlock,
  tagsFilterBlock,
  ctaBlock,
  newsletterBlock,
  pricingBlock,
  statsBlock,
  testimonialBlock,
  teamBlock,
  featuresBlock,
  contactFormBlock,
  accordionBlock,
]
