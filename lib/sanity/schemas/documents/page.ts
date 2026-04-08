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
      _type == "page" &&
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

function validateNormalizedSlug(value: { current?: string } | undefined, pageType?: string) {
  if (pageType === 'home' || pageType === 'auth' || pageType === 'dashboard') return true
  if (!value?.current) return 'A slug is required for this page.'

  const normalized = sanitizeStoredSlug(value.current)

  if (value.current !== normalized) {
    return 'The slug cannot start or end with spaces or slashes.'
  }

  if (/^(en|hi)(\/|-)/i.test(normalized) || /-(en|hi)$/i.test(normalized)) {
    return 'Do not add language codes to the slug. Use only the base slug, for example "cookie".'
  }

  return true
}

async function validateTranslationSlugMatchesSource(
  value: { current?: string } | undefined,
  context: {
    document?: {
      language?: string
      translationOf?: { _ref?: string }
      pageType?: string
    }
    getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T> }
  }
) {
  const normalizedValidation = validateNormalizedSlug(value, context.document?.pageType)
  if (normalizedValidation !== true) return normalizedValidation
  if (
    context.document?.pageType === 'home' ||
    context.document?.pageType === 'auth' ||
    context.document?.pageType === 'dashboard'
  ) {
    return true
  }

  const sourceId = context.document?.translationOf?._ref
  if (!sourceId) return true

  const client = context.getClient({ apiVersion: '2024-01-01' })
  const sourceSlug = await client.fetch<string | null>(`*[_id == $sourceId][0].slug.current`, { sourceId })
  const currentSlug = sanitizeStoredSlug(value?.current)

  if (!sourceSlug) return true

  if (currentSlug !== sanitizeStoredSlug(sourceSlug)) {
    return `Translated pages must use the same slug as the original page: "${sanitizeStoredSlug(sourceSlug)}". Do not add language codes.`
  }

  return true
}

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  initialValue: () => ({
    language: getStudioLanguage(),
  }),
  groups: [
    { name: 'basic', title: 'Page Info', default: true },
    { name: 'content', title: 'Content Blocks' },
    { name: 'settings', title: 'Settings' },
    { name: 'translation', title: 'Translation' },
    { name: 'advanced', title: 'SEO / Advanced' },
    { name: 'auth', title: 'Auth Page' },
    { name: 'dashboard', title: 'Dashboard Page' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The page name shown in Studio and used as a default heading.',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Use only the last URL part, for example cookies. Do not add hi, en, or /hi/. The language prefix is added automatically in public URLs.',
      options: {
        source: 'title',
        maxLength: 200,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 200),
        isUnique: isSlugUniquePerLanguage,
      },
      validation: (Rule) => Rule.custom((value, context) => validateTranslationSlugMatchesSource(value as { current?: string } | undefined, context as {
        document?: {
          language?: string
          translationOf?: { _ref?: string }
          pageType?: string
        }
        getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T> }
      })),
      hidden: ({ document }) => document?.pageType !== 'generic',
      readOnly: ({ document }) => isTranslationDocument(document),
      group: 'basic',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      description: 'Choose what this page is used for.',
      options: {
        list: [
          { title: 'Homepage', value: 'home' },
          { title: 'Standard Page', value: 'generic' },
          { title: 'Login / Signup Page', value: 'auth' },
          { title: 'Dashboard Page', value: 'dashboard' },
        ],
        layout: 'radio',
      },
      initialValue: 'generic',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Optional summary used in previews and as fallback SEO text.',
      group: 'basic',
    }),
    defineField({
      name: 'components',
      title: 'Page Sections',
      type: 'array',
      description: 'Add, remove, and reorder sections to build the page like WordPress blocks.',
      of: [
        { type: 'heroBlock', title: 'Hero Section' },
        { type: 'contentBlock', title: 'Rich Text Section' },
        { type: 'postsGridBlock', title: 'Latest Posts' },
        { type: 'featuredPostBlock', title: 'Featured Post' },
        { type: 'ctaBlock', title: 'Call To Action' },
        { type: 'newsletterBlock', title: 'Email Signup' },
        { type: 'featuresBlock', title: 'Feature Cards' },
        { type: 'testimonialBlock', title: 'Testimonials' },
        { type: 'teamBlock', title: 'Team Members' },
        { type: 'statsBlock', title: 'Stats' },
        { type: 'pricingBlock', title: 'Pricing Table' },
        { type: 'contactFormBlock', title: 'Contact Form' },
        { type: 'accordionBlock', title: 'FAQ' },
        { type: 'imageBlock', title: 'Image' },
        { type: 'videoBlock', title: 'Video' },
        { type: 'separatorBlock', title: 'Spacer / Divider' },
        { type: 'searchBlock', title: 'Post Search' },
        { type: 'tagsFilterBlock', title: 'Posts By Tag' },
        { type: 'containerBlock', title: 'Layout Container' },
        { type: 'gridBlock', title: 'Layout Grid' },
        { type: 'codeBlock', title: 'Code Block' },
      ],
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'Choose the language for this version of the page.',
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
      to: [{ type: 'page' }],
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
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description: 'Optional date used for sorting page lists.',
      group: 'settings',
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
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'ContentFlow',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'CMS-driven publishing for engineering teams.',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    defineField({
      name: 'features',
      title: 'Auth Page Benefits',
      type: 'array',
      description: 'Short benefit bullets shown beside login and signup forms.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Rocket', value: 'rocket' },
                  { title: 'Code', value: 'code' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Users', value: 'users' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
    }),
    defineField({
      name: 'loginPage',
      title: 'Login Form Text',
      type: 'object',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Welcome back' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', initialValue: 'Sign in to your workspace' }),
        defineField({ name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Sign in' }),
      ],
    }),
    defineField({
      name: 'signupPage',
      title: 'Signup Form Text',
      type: 'object',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Create an account' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', initialValue: 'Sign up for your workspace' }),
        defineField({ name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Sign up' }),
      ],
    }),
    defineField({
      name: 'oauthProviders',
      title: 'OAuth Providers',
      type: 'array',
      group: 'auth',
      hidden: ({ document }) => document?.pageType !== 'auth',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Provider',
              type: 'string',
              options: {
                list: [
                  { title: 'Google', value: 'google' },
                  { title: 'GitHub', value: 'github' },
                ],
              },
            }),
            defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
          ],
          preview: { select: { title: 'name' } },
        },
      ],
    }),
    defineField({
      name: 'dashboardWelcome',
      title: 'Dashboard Welcome Message',
      type: 'object',
      group: 'dashboard',
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'message',
          title: 'Message',
          type: 'string',
          description: "Use {name} for the user's name.",
          initialValue: 'Welcome back, {name}',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'Here is what is happening across your content ecosystem today.',
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Dashboard Stats',
      type: 'object',
      group: 'dashboard',
      hidden: ({ document }) => document?.pageType !== 'dashboard',
      fields: [
        defineField({
          name: 'totalPosts',
          title: 'Total Posts Card',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Total Posts' }),
          ],
        }),
        defineField({
          name: 'subscription',
          title: 'Subscription Card',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Subscription Plan' }),
            defineField({ name: 'proText', title: 'Pro Text', type: 'string', initialValue: 'Unlimited access' }),
            defineField({ name: 'freeText', title: 'Free Text', type: 'string', initialValue: 'Basic limits' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: 'Optional overrides for search engines and social sharing.',
      group: 'advanced',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'SEO Title',
          type: 'string',
          description: 'Defaults to the page title.',
        }),
        defineField({
          name: 'metaDescription',
          title: 'SEO Description',
          type: 'text',
          rows: 2,
          description: 'Defaults to the short description.',
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Image shown when this page is shared.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'pageType',
      slug: 'slug.current',
      language: 'language',
      translationOf: 'translationOf._ref',
    },
    prepare(selection) {
      const { title, pageType, slug, language, translationOf } = selection as {
        title?: string
        pageType?: string
        slug?: string
        language?: string
        translationOf?: string
      }
      const pageTypeLabels: Record<string, string> = {
        home: 'Homepage',
        auth: 'Auth Page',
        dashboard: 'Dashboard Page',
        generic: 'Page',
      }
      const flag = language === 'hi' ? '🇮🇳' : '🇺🇸'
      const path = pageType === 'home'
        ? language === 'hi' ? '/hi' : '/'
        : pageType === 'auth'
          ? '/login'
          : pageType === 'dashboard'
            ? '/dashboard'
            : slug
              ? language === 'hi' ? `/hi/${slug}` : `/${slug}`
              : 'No slug yet'
      const translationLabel = translationOf ? 'translation' : 'original'

      return {
        title: `${flag} ${title || 'Untitled Page'}`,
        subtitle: `${pageTypeLabels[pageType || 'generic']} - ${path} - ${translationLabel}`,
      }
    },
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Recent',
      name: 'recent',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
