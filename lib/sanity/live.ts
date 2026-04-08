import { defineLive } from 'next-sanity/live'
import { sanityClient } from './client'

const token = process.env.SANITY_API_TOKEN

if (!token) {
  throw new Error('Missing SANITY_API_TOKEN')
}

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient.withConfig({
    useCdn: false,
    stega: {
      enabled: true,
      studioUrl: '/studio',
    },
  }),
  serverToken: token,
  browserToken: token,
})
