import { defineField, defineType } from 'sanity'
import { getStudioLanguage } from '../../studio/languageSelectorPlugin'

function sanitizeStoredSlug(value?: string | null) {
  return value?.trim().replace(/^\/+/, '').replace(/\/+$/, '') || ''
}

function normalizeLanguageValue(value: unknown) {
  return typeof value === 'string' && value ? value : 'en'
}

function isTranslationDocument(document: unknown) {
  return Boolean((document as { translationOf?: { _ref?: string } } | undefined)?.translationOf?._ref)
}

async function isSlugUniquePerLanguage(slug: string, context: { document?: { _id?: string; language?: string }; getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T> } }) {
  const document = context.document
  const publishedId = document?._id?.replace(/^drafts\./, '')
  const draftId = publishedId ? `drafts.${publishedId}` : undefined
  const normalizedSlug = sanitizeStoredSlug(slug)
  const language = normalizeLanguageValue(document?.language)

  const client = context.getClient({ apiVersion: '2024-01-01' })

  return client.fetch<boolean>(
    `count(*[
      _type == "post" &&
      slug.current == $slug &&
      coalesce(language->id, language, "en") == $language &&
      !(_id in [$draftId, $publishedId])
    ]) == 0`,
    {
      slug: normalizedSlug,
      language,
      draftId,
      publishedId,
    }
  )
}

function validateNormalizedSlug(value: { current?: string } | undefined) {
  if (!value?.current) return 'A slug is required for this post.'

  const normalized = sanitizeStoredSlug(value.current)

  if (value.current !== normalized) {
    return 'The slug cannot start or end with spaces or slashes.'
  }

  if (/^(en|hi)(\/|-)/i.test(normalized) || /-(en|hi)$/i.test(normalized)) {
    return 'Do not add language codes to the slug. Use only the base slug, for example "my-post".'
  }

  return true
}

async function validateTranslationSlugMatchesSource(
  value: { current?: string } | undefined,
  context: {
    document?: {
      translationOf?: { _ref?: string }
    }
    getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T> }
  }
) {
  const normalizedValidation = validateNormalizedSlug(value)
  if (normalizedValidation !== true) return normalizedValidation

  const sourceId = context.document?.translationOf?._ref
  if (!sourceId) return true

  const client = context.getClient({ apiVersion: '2024-01-01' })
  const sourceSlug = await client.fetch<string | null>(`*[_id == $sourceId][0].slug.current`, { sourceId })
  const currentSlug = sanitizeStoredSlug(value?.current)

  if (!sourceSlug) return true

  if (currentSlug !== sanitizeStoredSlug(sourceSlug)) {
    return `Translated posts must use the same slug as the original post: "${sanitizeStoredSlug(sourceSlug)}". Do not add language codes.`
  }

  return true
}

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  initialValue: () => ({
    language: getStudioLanguage(),
  }),
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'publishing', title: 'Publishing' },
    { name: 'translation', title: 'Translation' },
    { name: 'advanced', title: 'SEO / Advanced' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'The main title readers will see.',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Use only the last URL part, for example my-post. Do not add hi, en, or /hi/. The language prefix is added automatically in public URLs.',
      options: {
        source: 'title',
        slugify: (input: string) =>
          input
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 200),
        isUnique: isSlugUniquePerLanguage,
      },
      validation: (Rule) => Rule.required().custom((value, context) => validateTranslationSlugMatchesSource(value as { current?: string } | undefined, context as {
        document?: {
          translationOf?: { _ref?: string }
        }
        getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T> }
      })),
      readOnly: ({ document }) => isTranslationDocument(document),
      group: 'basic',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      description: 'A short summary shown in post cards and search previews.',
      group: 'basic',
    }),
    defineField({
      name: 'body',
      title: 'Post Body',
      type: 'array',
      description: 'Write the article content here.',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main image shown on post cards and the post page.',
      options: { hotspot: true },
      group: 'media',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      description: 'Choose who wrote this post.',
      to: [{ type: 'author' }],
      group: 'publishing',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description: 'Set when this post should appear as published.',
      group: 'publishing',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add a few simple tags to help readers find this post.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'publishing',
    }),
    defineField({
      name: 'featured',
      title: 'Feature This Post',
      type: 'boolean',
      initialValue: false,
      description: 'Show this post in featured sections.',
      group: 'publishing',
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show On Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Allow homepage post blocks to display this post.',
      group: 'publishing',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'Choose the language for this version of the post.',
      options: {
        list: [
          { title: '🇺🇸 English', value: 'en' },
          { title: '🇮🇳 Hindi', value: 'hi' },
        ],
        layout: 'dropdown',
      },
      initialValue: getStudioLanguage,
      readOnly: ({ document }) => isTranslationDocument(document),
      group: 'translation',
    }),
    defineField({
      name: 'translationOf',
      title: 'Translation Of',
      type: 'reference',
      description: 'Automatically linked when you use the Translate action.',
      to: [{ type: 'post' }],
      options: {
        disableNew: true,
        filter: ({ document }) => {
          const language = (document as { language?: string })?.language
          if (!language) return { filter: 'true' }
          return {
            filter: 'coalesce(language->id, language, "en") != $language',
            params: { language },
          }
        },
      },
      readOnly: ({ document }) => isTranslationDocument(document),
      group: 'translation',
    }),
    defineField({
      name: 'mostViewed',
      title: 'Mark As Most Viewed',
      type: 'boolean',
      initialValue: false,
      description: 'Manual override for most-viewed sections.',
      group: 'advanced',
    }),
    defineField({
      name: 'slugHistory',
      title: 'Slug History',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      hidden: true,
      group: 'advanced',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time',
      type: 'number',
      description: 'Optional manual reading time in minutes.',
      group: 'advanced',
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Optional search-engine title. Defaults to the post title.',
      group: 'advanced',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Optional search-engine description. Defaults to the summary.',
      group: 'advanced',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      language: 'language',
      translationOf: 'translationOf._ref',
    },
    prepare(selection) {
      const { title, author, media, language, translationOf } = selection as {
        title?: string
        author?: string
        media?: unknown
        language?: string
        translationOf?: string
      }
      const flag = language === 'hi' ? '🇮🇳' : '🇺🇸'
      const translationLabel = translationOf ? 'translation' : 'original'

      return {
        title: `${flag} ${title || 'Untitled Post'}`,
        subtitle: author ? `${author} - ${translationLabel}` : translationLabel,
        media: media as undefined,
      }
    },
  },
  orderings: [
    {
      title: 'Recent',
      name: 'recent',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
