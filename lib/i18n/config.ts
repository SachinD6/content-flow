export const defaultLanguage = 'en'

export const languages = [
  { id: 'en', title: 'English', nativeTitle: 'English', isDefault: true, flag: '🇺🇸' },
  { id: 'hi', title: 'Hindi', nativeTitle: 'हिन्दी', isDefault: false, flag: '🇮🇳' },
] as const

export type LanguageId = typeof languages[number]['id']

export const languageIds = languages.map((lang) => lang.id)

export function isValidLanguage(lang: string): lang is LanguageId {
  return languageIds.includes(lang as LanguageId)
}

export function getLanguage(lang: string | undefined) {
  if (!lang) return languages.find((l) => l.isDefault) || languages[0]
  return languages.find((l) => l.id === lang) || languages.find((l) => l.isDefault) || languages[0]
}

export function getDefaultLanguage() {
  return languages.find((l) => l.isDefault) || languages[0]
}