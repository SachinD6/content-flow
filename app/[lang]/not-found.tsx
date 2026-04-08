import { NotFoundPage } from '@/features/layout/NotFoundPage'
import { getSiteSettings } from '@/lib/sanity/content'

interface LocalizedNotFoundProps {
  params?: Promise<{ lang?: string }> | { lang?: string }
}

export default async function LocalizedNotFound({
  params,
}: LocalizedNotFoundProps) {
  const resolvedParams = params ? await params : undefined
  const lang = resolvedParams?.lang
  const settings = await getSiteSettings()

  return <NotFoundPage lang={lang === 'hi' ? 'hi' : 'en'} settings={settings} />
}
