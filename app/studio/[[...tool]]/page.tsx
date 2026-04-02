'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useEffect } from 'react'
import { StudioErrorBoundary } from './StudioErrorBoundary'

export default function StudioPage() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.name === 'AbortError') {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === 'AbortError' || 
          (event.reason?.message && event.reason.message.includes('signal is aborted'))) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }
    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection, true)
    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection, true)
    }
  }, [])

  return (
    <StudioErrorBoundary>
      <NextStudio config={config} history="hash" />
    </StudioErrorBoundary>
  )
}