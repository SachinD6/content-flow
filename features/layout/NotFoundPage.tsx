import Link from 'next/link'
import Image from 'next/image'

import { getLocalizedPath } from '@/lib/i18n/translations'
import type { SiteSettings } from '@/lib/sanity/content-types'

type SupportedLanguage = 'en' | 'hi'

const FALLBACK_COPY = {
  en: {
    eyebrow: '404 Error',
    title: 'Page not found',
    description:
      "The page you're looking for doesn't exist, was moved, or is not published yet.",
    primaryButtonLabel: 'Go to homepage',
    secondaryButtonLabel: 'Browse posts',
    checksTitle: 'What to check',
    checks: [
      'Whether the URL is correct',
      'Whether the page is published',
      'Whether the correct language is selected',
    ],
    studioHint:
      'You can edit this 404 page copy in Sanity Studio > Site Settings > Experience > 404 Page.',
  },
  hi: {
    eyebrow: '404 त्रुटि',
    title: 'पेज नहीं मिला',
    description:
      'जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है, हटाया जा चुका है, या अभी प्रकाशित नहीं हुआ है।',
    primaryButtonLabel: 'होमपेज पर जाएँ',
    secondaryButtonLabel: 'पोस्ट्स देखें',
    checksTitle: 'क्या जांचें',
    checks: [
      'URL सही है या नहीं',
      'पेज प्रकाशित है या नहीं',
      'सही भाषा चुनी गई है या नहीं',
    ],
    studioHint:
      'इस 404 पेज की कॉपी आप Sanity Studio > Site Settings > Experience > 404 Page में बदल सकते हैं।',
  },
} as const

interface NotFoundPageProps {
  lang: SupportedLanguage
  settings: SiteSettings
}

export function NotFoundPage({ lang, settings }: NotFoundPageProps) {
  const isHindi = lang === 'hi'
  const localizedSiteName =
    isHindi ? settings.siteNameHindi || settings.siteName || 'ContentFlow' : settings.siteName || 'ContentFlow'
  const cmsCopy = isHindi
    ? settings.notFoundPage?.hindi
    : settings.notFoundPage?.english
  const fallbackCopy = isHindi ? FALLBACK_COPY.hi : FALLBACK_COPY.en

  const copy = {
    eyebrow: cmsCopy?.eyebrow || fallbackCopy.eyebrow,
    title: cmsCopy?.title || fallbackCopy.title,
    description: cmsCopy?.description || fallbackCopy.description,
    primaryButtonLabel:
      cmsCopy?.primaryButtonLabel || fallbackCopy.primaryButtonLabel,
    secondaryButtonLabel:
      cmsCopy?.secondaryButtonLabel || fallbackCopy.secondaryButtonLabel,
    checksTitle: fallbackCopy.checksTitle,
    checks: fallbackCopy.checks,
    studioHint: fallbackCopy.studioHint,
  }

  return (
    <main className="min-h-screen bg-[#0b0c10] px-6 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <section className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(97,84,240,0.22),_transparent_38%),linear-gradient(180deg,rgba(18,19,25,0.98),rgba(11,12,16,1))] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                {settings.logo ? (
                  <span className="relative h-5 w-5 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={settings.logo}
                      alt={localizedSiteName}
                      fill
                      sizes="20px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#6154f0]" />
                )}
                <span>{localizedSiteName}</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9d93ff]">
                  {copy.eyebrow}
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  {copy.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={getLocalizedPath('/', lang)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#6154f0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5841e8]"
                >
                  {copy.primaryButtonLabel}
                </Link>
                <Link
                  href={getLocalizedPath('/posts', lang)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
                >
                  {copy.secondaryButtonLabel}
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 sm:p-6">
              <div className="rounded-[24px] border border-dashed border-white/10 bg-[#121319] p-6 sm:p-7">
                <div className="text-7xl font-semibold leading-none text-white/10">
                  404
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-zinc-200">
                      {copy.checksTitle}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                      {copy.checks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm leading-6 text-zinc-500">
                    {copy.studioHint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
