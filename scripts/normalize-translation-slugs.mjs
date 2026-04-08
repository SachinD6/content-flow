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

const translations = await client.fetch(`
  *[
    _type in ["page", "post"] &&
    defined(translationOf._ref)
  ]{
    _id,
    _type,
    title,
    "language": coalesce(language, "en"),
    pageType,
    "slug": slug.current,
    "slugHistory": coalesce(slugHistory, []),
    "sourceId": translationOf._ref,
    "sourceSlug": translationOf->slug.current
  }
`)

const updates = translations
  .filter((document) => {
    if (document._type === 'page' && document.pageType === 'home') return false

    const currentSlug = sanitizeSlug(document.slug)
    const sourceSlug = sanitizeSlug(document.sourceSlug)

    if (!sourceSlug) return false
    if (!currentSlug) return true

    return currentSlug !== sourceSlug || currentSlug !== document.slug
  })
  .map((document) => ({
    id: document._id,
    type: document._type,
    title: document.title,
    language: document.language,
    previousSlug: document.slug,
    nextSlug: sanitizeSlug(document.sourceSlug),
    slugHistory: uniqueStrings([
      ...(document.slugHistory || []),
      sanitizeSlug(document.slug) !== sanitizeSlug(document.sourceSlug) ? sanitizeSlug(document.slug) : null,
      document.slug && sanitizeSlug(document.slug) !== document.slug ? document.slug : null,
    ]),
  }))

if (updates.length === 0) {
  console.log('No translated slugs needed normalization.')
  process.exit(0)
}

for (const update of updates) {
  await client
    .patch(update.id)
    .set({
      slug: {
        _type: 'slug',
        current: update.nextSlug,
      },
      slugHistory: update.slugHistory,
    })
    .commit()

  console.log(
    `Normalized ${update.type} "${update.title || update.id}" (${update.language}): ${update.previousSlug} -> ${update.nextSlug}`
  )
}

console.log(`Updated ${updates.length} translated documents.`)
