import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

const languages = ['en', 'hi']
const defaultLanguage = 'en'

async function getPreferredLanguage(): Promise<string> {
  // Try cookie first
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('preferred-language')
  if (langCookie && languages.includes(langCookie.value)) {
    return langCookie.value
  }

  // Try accept-language header
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  if (acceptLanguage) {
    const preferredLanguages = acceptLanguage
      .split(',')
      .map((lang: string) => lang.split(';')[0].trim().substring(0, 2))
    
    for (const lang of preferredLanguages) {
      if (languages.includes(lang)) {
        return lang
      }
    }
  }

  return defaultLanguage
}

export default async function RootPage() {
  const preferredLanguage = await getPreferredLanguage()
  redirect(`/${preferredLanguage}`)
}