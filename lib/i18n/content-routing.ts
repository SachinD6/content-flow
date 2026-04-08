import { defaultLanguage, type LanguageId } from './config'

type TranslationEntry = {
  language: string
  slug?: string | null
  canonicalSlug?: string | null
}

function normalizeLanguage(language?: string | null): LanguageId {
  return (language === 'hi' ? 'hi' : defaultLanguage) as LanguageId
}

function normalizeSlug(slug?: string | null) {
  return slug?.trim().replace(/^\/+/, '').replace(/\/+$/, '') || ''
}

export function getLocalizedPath(path: string, language?: string | null) {
  const normalizedLanguage = normalizeLanguage(language)
  if (normalizedLanguage === defaultLanguage) return path
  if (path === '/') return `/${normalizedLanguage}`
  if (path === `/${normalizedLanguage}` || path.startsWith(`/${normalizedLanguage}/`)) return path
  return `/${normalizedLanguage}${path.startsWith('/') ? path : `/${path}`}`
}

export function getPagePath(slug?: string | null, language?: string | null) {
  const normalizedSlug = normalizeSlug(slug)
  return getLocalizedPath(normalizedSlug ? `/${normalizedSlug}` : '/', language)
}

export function getPostPath(slug?: string | null, language?: string | null) {
  const normalizedSlug = normalizeSlug(slug)
  return getLocalizedPath(normalizedSlug ? `/posts/${normalizedSlug}` : '/posts', language)
}

export function buildTranslationLinks(
  translations: TranslationEntry[] | undefined,
  type: 'page' | 'post'
): Partial<Record<LanguageId, string>> {
  if (!translations) return {}

  return translations.reduce<Partial<Record<LanguageId, string>>>((links, translation) => {
    const language = normalizeLanguage(translation.language)
    const slug = normalizeSlug(translation.canonicalSlug || translation.slug)
    links[language] = type === 'post' ? getPostPath(slug, language) : getPagePath(slug, language)
    return links
  }, {})
}

export function buildAlternateLanguageEntries(
  translations: TranslationEntry[] | undefined,
  type: 'page' | 'post'
) {
  return (translations || []).reduce<Record<string, string>>((entries, translation) => {
    const language = normalizeLanguage(translation.language)
    const slug = normalizeSlug(translation.canonicalSlug || translation.slug)
    entries[language] = type === 'post' ? getPostPath(slug, language) : getPagePath(slug, language)
    return entries
  }, {})
}
