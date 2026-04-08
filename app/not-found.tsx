import { NotFoundPage } from '@/features/layout/NotFoundPage'
import { getSiteSettings } from '@/lib/sanity/content'

export default async function NotFound() {
  const settings = await getSiteSettings()

  return <NotFoundPage lang="en" settings={settings} />
}
