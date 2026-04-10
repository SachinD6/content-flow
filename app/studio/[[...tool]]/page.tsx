'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { StudioErrorBoundary } from './StudioErrorBoundary'

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason
    if (
      reason?.name === 'AbortError' ||
      (typeof reason?.message === 'string' && reason.message.includes('aborted'))
    ) {
      e.preventDefault()
    }
  })
}

export default function StudioPage() {
  return (
    <StudioErrorBoundary>
      <NextStudio config={config} history="hash" />
    </StudioErrorBoundary>
  )
}