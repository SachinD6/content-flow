import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from 'next-sanity'

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

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))]
}

function sanitizeSlug(value) {
  return value?.trim().replace(/^\/+/, '').replace(/\/+$/, '') || ''
}

function getBaseId(id) {
  return id.replace(/^drafts\./, '')
}

function scoreRecord(record) {
  let score = 0

  if (record.title) score += 50
  if (record.excerpt) score += 15
  if (record.publishedAt) score += 20
  if (record._id.startsWith('translation.')) score += 5

  if (record._type === 'post' && record.bodyCount > 0) score += 40
  if (record._type === 'page' && (record.componentsCount > 0 || record.contentCount > 0)) score += 40

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

const languageDocs = await client.fetch(`*[_type == "language"]{_id, id, isDefault}`)
const languageIdMap = new Map(languageDocs.map((doc) => [doc._id, doc.id]))

const documents = await client.fetch(`
  *[_type in ["page", "post"]]{
    _id,
    _type,
    title,
    pageType,
    language,
    translationOf,
    "slug": slug.current,
    "slugHistory": coalesce(slugHistory, []),
    "sourceSlug": translationOf->slug.current,
    publishedAt,
    excerpt,
    body,
    "bodyCount": count(body),
    components,
    "componentsCount": count(components),
    content,
    "contentCount": count(content),
    author,
    tags,
    featured,
    showOnHome,
    mostViewed,
    readingTime,
    coverImage,
    description,
    _updatedAt
  }
`)

const translationSourceIds = new Set(
  documents
    .map((document) => document.translationOf?._ref)
    .filter(Boolean)
)

function normalizeLanguageValue(language, document) {
  if (!document.translationOf?._ref && translationSourceIds.has(getBaseId(document._id))) {
    return 'en'
  }
  if (typeof language === 'string' && language) return language
  if (language && typeof language === 'object' && typeof language._ref === 'string') {
    return languageIdMap.get(language._ref) || 'en'
  }
  if (document.translationOf?._ref) return null
  return 'en'
}

const patches = []
const deletions = new Set()

for (const document of documents) {
  const normalizedLanguage = normalizeLanguageValue(document.language, document)
  const normalizedSlug = sanitizeSlug(document.slug)
  const nextPatch = {}

  if (normalizedLanguage && document.language !== normalizedLanguage) {
    nextPatch.language = normalizedLanguage
  }

  if (document.translationOf?._ref && document._type === 'page' && document.pageType !== 'home') {
    const sourceSlug = sanitizeSlug(document.sourceSlug)
    if (sourceSlug && normalizedSlug !== sourceSlug) {
      nextPatch.slug = { _type: 'slug', current: sourceSlug }
      nextPatch.slugHistory = uniqueStrings([
        ...(document.slugHistory || []),
        normalizedSlug && normalizedSlug !== sourceSlug ? normalizedSlug : null,
        document.slug && document.slug !== normalizedSlug ? document.slug : null,
      ])
    }
  }

  if (document.translationOf?._ref && document._type === 'post') {
    const sourceSlug = sanitizeSlug(document.sourceSlug)
    if (sourceSlug && normalizedSlug !== sourceSlug) {
      nextPatch.slug = { _type: 'slug', current: sourceSlug }
      nextPatch.slugHistory = uniqueStrings([
        ...(document.slugHistory || []),
        normalizedSlug && normalizedSlug !== sourceSlug ? normalizedSlug : null,
        document.slug && document.slug !== normalizedSlug ? document.slug : null,
      ])
    }
  }

  if (Object.keys(nextPatch).length > 0) {
    patches.push({ id: document._id, set: nextPatch })
  }
}

const translationGroups = new Map()

for (const document of documents) {
  const sourceId = document.translationOf?._ref
  if (!sourceId) continue

  const language = normalizeLanguageValue(document.language, document) || 'en'
  const groupKey = `${document._type}:${sourceId}:${language}`
  const baseId = getBaseId(document._id)

  if (!translationGroups.has(groupKey)) {
    translationGroups.set(groupKey, new Map())
  }

  const group = translationGroups.get(groupKey)
  const existing = group.get(baseId)
  const candidate = {
    ...document,
    _id: baseId,
    language,
    draftId: document._id.startsWith('drafts.') ? document._id : existing?.draftId,
    publishedId: document._id.startsWith('drafts.') ? existing?.publishedId : document._id,
  }

  group.set(baseId, existing ? { ...existing, ...candidate } : candidate)
}

for (const [, recordsByBaseId] of translationGroups) {
  const records = [...recordsByBaseId.values()]
  if (records.length <= 1) continue

  records.sort((left, right) => {
    const scoreDelta = scoreRecord(right) - scoreRecord(left)
    if (scoreDelta !== 0) return scoreDelta
    return new Date(right._updatedAt).getTime() - new Date(left._updatedAt).getTime()
  })

  const canonical = records[0]
  const duplicates = records.slice(1)

  const canonicalSlug = sanitizeSlug(canonical.sourceSlug) || sanitizeSlug(canonical.slug)
  const canonicalPatch = {}
  const mergedSlugHistory = new Set(canonical.slugHistory || [])

  for (const duplicate of duplicates) {
    const duplicateSlug = sanitizeSlug(duplicate.slug)
    if (duplicateSlug && duplicateSlug !== canonicalSlug) {
      mergedSlugHistory.add(duplicateSlug)
    }
    if (duplicate.slug && duplicate.slug !== duplicateSlug) {
      mergedSlugHistory.add(duplicate.slug)
    }

    if (!canonical.title && duplicate.title) canonicalPatch.title = duplicate.title
    if (!canonical.excerpt && duplicate.excerpt) canonicalPatch.excerpt = duplicate.excerpt
    if (!canonical.publishedAt && duplicate.publishedAt) canonicalPatch.publishedAt = duplicate.publishedAt
    if (!canonical.author && duplicate.author) canonicalPatch.author = duplicate.author
    if ((!canonical.tags || canonical.tags.length === 0) && duplicate.tags?.length) canonicalPatch.tags = duplicate.tags
    if (!canonical.featured && duplicate.featured) canonicalPatch.featured = duplicate.featured
    if (canonical.showOnHome == null && duplicate.showOnHome != null) canonicalPatch.showOnHome = duplicate.showOnHome
    if (!canonical.mostViewed && duplicate.mostViewed) canonicalPatch.mostViewed = duplicate.mostViewed
    if (!canonical.readingTime && duplicate.readingTime) canonicalPatch.readingTime = duplicate.readingTime
    if (!canonical.coverImage && duplicate.coverImage) canonicalPatch.coverImage = duplicate.coverImage
    if (!canonical.description && duplicate.description) canonicalPatch.description = duplicate.description
    if (canonical._type === 'post' && (!canonical.bodyCount || canonical.bodyCount === 0) && duplicate.bodyCount > 0) canonicalPatch.body = duplicate.body
    if (canonical._type === 'page' && (!canonical.componentsCount || canonical.componentsCount === 0) && duplicate.componentsCount > 0) canonicalPatch.components = duplicate.components
    if (canonical._type === 'page' && (!canonical.contentCount || canonical.contentCount === 0) && duplicate.contentCount > 0) canonicalPatch.content = duplicate.content

    if (duplicate.publishedId) deletions.add(duplicate.publishedId)
    if (duplicate.draftId) deletions.add(duplicate.draftId)
  }

  if (canonicalSlug && sanitizeSlug(canonical.slug) !== canonicalSlug) {
    canonicalPatch.slug = { _type: 'slug', current: canonicalSlug }
  }

  const nextSlugHistory = uniqueStrings([
    ...(canonical.slugHistory || []),
    ...mergedSlugHistory,
  ])

  if (nextSlugHistory.length > 0) {
    canonicalPatch.slugHistory = nextSlugHistory
  }

  if (Object.keys(canonicalPatch).length > 0) {
    if (canonical.publishedId) patches.push({ id: canonical.publishedId, set: canonicalPatch })
    if (canonical.draftId) patches.push({ id: canonical.draftId, set: canonicalPatch })
  }
}

if (patches.length === 0 && deletions.size === 0) {
  console.log('No translation data fixes were needed.')
  process.exit(0)
}

for (const patch of patches) {
  await client.patch(patch.id).set(patch.set).commit()
  console.log(`Patched ${patch.id}`)
}

for (const id of deletions) {
  await client.delete(id)
  console.log(`Deleted duplicate translation ${id}`)
}

console.log(`Applied ${patches.length} patches and deleted ${deletions.size} duplicate documents.`)
