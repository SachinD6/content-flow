import type { DocumentActionComponent, DocumentActionProps } from 'sanity'
import { useClient } from 'sanity'
import { useRouter } from 'sanity/router'
import { TranslateIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'

const LANGUAGES: Record<string, { title: string; flag: string }> = {
  en: { title: 'English', flag: '🇺🇸' },
  hi: { title: 'Hindi', flag: '🇮🇳' },
}

const COPY_FIELDS: Record<string, string[]> = {
  post: ['coverImage', 'author', 'tags', 'featured', 'mostViewed', 'showOnHome', 'readingTime', 'publishedAt'],
  page: ['pageType', 'publishedAt'],
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

function getPublishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function createDraftId(type: string, sourceId: string, targetLang: string) {
  return `drafts.translation.${type}.${sourceId}.${targetLang}`
}

function createPublishedId(type: string, sourceId: string, targetLang: string) {
  return `translation.${type}.${sourceId}.${targetLang}`
}

function normalizeDocumentLanguage(value: unknown) {
  if (typeof value === 'string' && value in LANGUAGES) return value
  return 'en'
}

function getTargetSlug(slug: string) {
  return slug
    .trim()
    .replace(/^\/?(en|hi)\//i, '')
    .replace(/^\/+/, '')
    .replace(/-(en|hi)$/i, '')
    .replace(/\/+$/, '')
}

function blankTranslatableValue(value: unknown, key?: string): unknown {
  if (typeof value === 'string') {
    return key && TRANSLATABLE_FIELD_NAMES.has(key) ? '' : value
  }

  if (Array.isArray(value)) {
    if (key === 'body' || key === 'content') return []
    return value.map((item) => blankTranslatableValue(item))
  }

  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([entryKey, entryValue]) => [
      entryKey,
      blankTranslatableValue(entryValue, entryKey),
    ])
  )
}

const CreateTranslationAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, published, draft } = props
  const document = draft || published
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()
  const [existingTranslationId, setExistingTranslationId] = useState<string | null>(null)
  const translationOf = document?.translationOf as { _ref?: string } | undefined
  const currentLang = normalizeDocumentLanguage(document?.language)
  const targetLang = currentLang === 'en' ? 'hi' : 'en'
  const langInfo = LANGUAGES[targetLang]
  const sourceId = id ? getPublishedId(id) : null
  const draftSourceId = sourceId ? `drafts.${sourceId}` : null
  const translationLookupQuery = `
    *[
      _type == $type &&
      translationOf._ref in [$sourceId, $draftSourceId] &&
      coalesce(language, 'en') == $targetLang
    ] | order(
      select(defined(title) && title != '' => 5, 0) desc,
      select(defined(excerpt) && excerpt != '' => 4, 0) desc,
      select(count(body) > 0 => 3, 0) desc,
      select(count(components) > 0 => 3, 0) desc,
      select(defined(publishedAt) => 2, 0) desc,
      _updatedAt desc
    )[0]{
      _id
    }
  `

  useEffect(() => {
    if (!document || !sourceId || translationOf?._ref || !LANGUAGES[currentLang]) {
      setExistingTranslationId(null)
      return
    }

    const abortController = new AbortController()

    client
      .fetch<{ _id: string } | null>(translationLookupQuery, {
        type,
        targetLang,
        sourceId,
        draftSourceId,
      }, { signal: abortController.signal })
      .then((result) => {
        setExistingTranslationId(result?._id ?? null)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setExistingTranslationId(null)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [
    client,
    currentLang,
    document,
    draftSourceId,
    sourceId,
    targetLang,
    translationLookupQuery,
    translationOf?._ref,
    type,
  ])

  if (!document || !id || !sourceId) return null
  if (translationOf?._ref) return null
  if (!LANGUAGES[currentLang] || !langInfo) return null

  if (existingTranslationId) {
    return {
      label: `Open ${langInfo.flag} ${langInfo.title} Translation`,
      icon: TranslateIcon,
      tone: 'default',
      title: `Open the existing ${langInfo.title} translation.`,
      group: ['paneActions'],
      onHandle: () => {
        router.navigateIntent('edit', { type, id: getPublishedId(existingTranslationId) })
        props.onComplete()
      },
    }
  }

  return {
    label: `Create ${langInfo.flag} ${langInfo.title} Translation`,
    icon: TranslateIcon,
    tone: 'default',
    title: `Create a ${langInfo.title} translation and open it for editing.`,
    group: ['paneActions'],
    onHandle: async () => {
      try {
        const existingTranslation = await client.fetch<{ _id: string } | null>(translationLookupQuery, {
          type,
          targetLang,
          sourceId,
          draftSourceId,
        })

        if (existingTranslation?._id) {
          router.navigateIntent('edit', { type, id: getPublishedId(existingTranslation._id) })
          props.onComplete()
          return
        }

        const langLabel = targetLang === 'hi' ? 'Hindi' : 'English'
        const draftId = createDraftId(type, sourceId, targetLang)
        const values: Record<string, unknown> = {
          _id: draftId,
          _type: type,
          language: targetLang,
          translationOf: { _type: 'reference', _ref: sourceId },
        }

        if (typeof document.title === 'string' && document.title) {
          values.title = `${document.title} (${langLabel})`
        }

        const slug = document.slug as { current?: string } | undefined
        if (slug?.current) {
          values.slug = {
            _type: 'slug',
            current: getTargetSlug(slug.current),
          }
        }

        const fieldsToCopy = COPY_FIELDS[type] || []
        fieldsToCopy.forEach((field) => {
          if (field in document) {
            values[field] = document[field]
          }
        })

        if (type === 'page' && Array.isArray(document.components)) {
          values.components = blankTranslatableValue(document.components, 'components')
        }

        const nextPublishedId = createPublishedId(type, sourceId, targetLang)
        const existingDraft = await client.fetch<{ _id: string } | null>(
          `*[_id in [$draftId, $publishedId]][0]{_id}`,
          {
            draftId,
            publishedId: nextPublishedId,
          }
        )

        const patchableValues = Object.fromEntries(
          Object.entries(values).filter(([key]) => key !== '_id')
        )

        const newDoc = existingDraft?._id
          ? await client.patch(existingDraft._id).set(patchableValues).commit()
          : await client.create(values as { _id: string; _type: string } & Record<string, unknown>)

        router.navigateIntent('edit', { type, id: getPublishedId(newDoc._id) })
        props.onComplete()
      } catch (error) {
        console.error('Translation creation failed:', error)
        alert('Failed to create translation. Check console.')
      }
    },
  }
}

const ViewOriginalAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { type, published, draft } = props
  const document = draft || published
  const router = useRouter()
  const translationOf = document?.translationOf as { _ref?: string } | undefined

  if (!translationOf?._ref) return null
  const originalId = getPublishedId(translationOf._ref)

  return {
    label: 'View Original',
    tone: 'default',
    group: ['paneActions'],
    onHandle: () => {
      router.navigateIntent('edit', { type, id: originalId })
      props.onComplete()
    },
  }
}

export const createTranslationAction = CreateTranslationAction
export const viewOriginalAction = ViewOriginalAction
