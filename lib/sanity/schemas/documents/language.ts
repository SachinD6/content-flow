import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Language ID',
      type: 'string',
      description: 'Language code (e.g., "en", "hi")',
      validation: (Rule) => Rule.required().regex(/^[a-z]{2}$/, {
        name: 'language code',
        invert: false,
      }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Language name in English (e.g., "English")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nativeTitle',
      title: 'Native Title',
      type: 'string',
      description: 'Language name in its native script (e.g., "हिन्दी")',
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Language',
      type: 'boolean',
      description: 'Set as the default language for the site',
      initialValue: false,
    }),
    defineField({
      name: 'flag',
      title: 'Flag Emoji',
      type: 'string',
      description: 'Emoji flag for the language (e.g., "🇺🇸", "🇮🇳")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'id',
      flag: 'flag',
    },
    prepare(selection) {
      const { title, subtitle, flag } = selection as {title?: string; subtitle?: string; flag?: string}
      return {
        title: `${flag ? flag + ' ' : ''}${title || 'Language'}`,
        subtitle: subtitle || '',
      }
    },
  },
})