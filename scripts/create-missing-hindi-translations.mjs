import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from 'next-sanity'

const TARGET_LANGUAGE = 'hi'
const TARGET_LABEL = 'Hindi'
const COPY_FIELDS = {
  post: ['coverImage', 'author', 'tags', 'featured', 'mostViewed', 'showOnHome', 'readingTime', 'publishedAt'],
}

const TRANSLATABLE_FIELD_NAMES = new Set([
  'alt',
  'answer',
  'buttonText',
  'caption',
  'content',
  'description',
  'emptyMessage',
  'heading',
  'label',
  'metaDescription',
  'metaTitle',
  'placeholder',
  'question',
  'quote',
  'subtitle',
  'successMessage',
  'text',
  'title',
])

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function loadEnvironment() {
  const cwd = process.cwd()
  loadEnvFile(path.join(cwd, '.env.local'))
  loadEnvFile(path.join(cwd, '.env'))
}

function getPublishedId(id) {
  return id.replace(/^drafts\./, '')
}

function sanitizeSlug(value) {
  return value?.trim().replace(/^\/+/, '').replace(/\/+$/, '') || ''
}

function createDraftId(type, sourceId, targetLang) {
  return `drafts.translation.${type}.${sourceId}.${targetLang}`
}

function normalizeLanguage(value) {
  return typeof value === 'string' && value ? value : 'en'
}

function blankTranslatableValue(value, key) {
  if (key === 'body') return []
  if (key === 'excerpt') return ''

  if (typeof value === 'string') {
    return key && TRANSLATABLE_FIELD_NAMES.has(key) ? '' : value
  }

  if (Array.isArray(value)) {
    if (key === 'body' || key === 'content') return []
    return value.map((item) => blankTranslatableValue(item))
  }

  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      blankTranslatableValue(entryValue, entryKey),
    ])
  )
}

function scoreSource(document) {
  let score = 0
  if (!document._id.startsWith('drafts.')) score += 100
  if (document.title) score += 20
  if (document.slug) score += 20
  if (document._type === 'post' && Array.isArray(document.body) && document.body.length > 0) score += 20
  if (document._type === 'page' && Array.isArray(document.components) && document.components.length > 0) score += 20
  return score
}

loadEnvironment()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('Missing Sanity credentials. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
  perspective: 'raw',
})

const documents = await client.fetch(`
  *[_type in ["page", "post"]]{
    _id,
    _type,
    title,
    pageType,
    description,
    excerpt,
    body,
    components,
    content,
    slug,
    language,
    translationOf,
    author,
    tags,
    featured,
    mostViewed,
    showOnHome,
    readingTime,
    publishedAt,
    coverImage,
    seo,
    brandName,
    tagline,
    features,
    loginPage,
    signupPage,
    dashboardWelcome,
    stats,
    activitySection,
    oauthProviders
  }
`)

const canonicalSources = new Map()
const hindiTranslationsBySource = new Map()
const existingDocumentIds = new Set(documents.map((document) => document._id))

for (const document of documents) {
  const language = normalizeLanguage(document.language)
  const sourceId = document.translationOf?._ref ? getPublishedId(document.translationOf._ref) : null

  if (sourceId && language === TARGET_LANGUAGE) {
    hindiTranslationsBySource.set(sourceId, document)
    continue
  }

  if (sourceId) continue
  if (language !== 'en') continue

  const canonicalId = getPublishedId(document._id)
  if (document._id.startsWith('drafts.') && !existingDocumentIds.has(canonicalId)) {
    continue
  }
  const existing = canonicalSources.get(canonicalId)

  if (!existing || scoreSource(document) > scoreSource(existing)) {
    canonicalSources.set(canonicalId, document)
  }
}

const created = []
const skipped = []

for (const [sourceId, source] of canonicalSources.entries()) {
  if (!source?.title) {
    skipped.push({ sourceId, reason: 'missing title' })
    continue
  }

  if (hindiTranslationsBySource.has(sourceId)) {
    skipped.push({ sourceId, reason: 'existing Hindi translation' })
    continue
  }

  const draftId = createDraftId(source._type, sourceId, TARGET_LANGUAGE)
  const values = {
    _id: draftId,
    _type: source._type,
    language: TARGET_LANGUAGE,
    translationOf: { _type: 'reference', _ref: sourceId },
    title: `${source.title} (${TARGET_LABEL})`,
  }

  if (source.slug?.current) {
    values.slug = {
      _type: 'slug',
      current: sanitizeSlug(source.slug.current),
    }
  }

  if (source._type === 'post') {
    for (const field of COPY_FIELDS.post) {
      if (field in source) {
        values[field] = source[field]
      }
    }
    values.excerpt = ''
    values.body = []
  }

  if (source._type === 'page') {
    for (const [key, rawValue] of Object.entries(source)) {
      if (
        key === '_id' ||
        key === '_type' ||
        key === 'language' ||
        key === 'translationOf' ||
        key === 'slug' ||
        key === 'title'
      ) {
        continue
      }

      values[key] = blankTranslatableValue(rawValue, key)
    }
  }

  await client.createOrReplace(values)
  created.push({
    sourceId,
    type: source._type,
    title: source.title,
    draftId,
  })
}

console.log(JSON.stringify({ created, skipped }, null, 2))
