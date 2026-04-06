import { defineType, defineField } from 'sanity'

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
      name: 'href',
      title: 'URL',
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
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})

export const objects = [
  navItem,
  navGroup,
  ctaButton,
  blockStyles,
  // Block components for page builder - Layout
  containerBlock,
  gridBlock,
  separatorBlock,
  // Block components - Content
  heroBlock,
  contentBlock,
  imageBlock,
  codeBlock,
  videoBlock,
  // Block components - Posts
  postsGridBlock,
  featuredPostBlock,
  searchBlock,
  tagsFilterBlock,
  // Block components - Marketing
  ctaBlock,
  newsletterBlock,
  pricingBlock,
  // Block components - Social
  statsBlock,
  testimonialBlock,
  teamBlock,
  featuresBlock,
  // Block components - Interactive
  contactFormBlock,
  accordionBlock,
]