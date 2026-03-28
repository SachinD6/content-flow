import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

console.log('PostHog Init - Token exists:', !!token)
console.log('PostHog Init - Host:', host)

if (token) {
  posthog.init(token, {
    api_host: host || 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (posthog) => {
      console.log('PostHog loaded successfully')
    },
  })
  console.log('PostHog init called')
} else {
  console.error('PostHog: No token found in environment variables')
}
