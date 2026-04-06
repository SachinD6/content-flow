<!-- contextpack-generated -->
# Contentflow

Contentflow manages posts, analytics, collaborations. subscription billing via Stripe. CMS-backed public content layer. authentication with protected routes. 34 protected routes, 2 public pages

## Features
- Home page
- Lang
- Admin
- Login
- Signup
- Main dashboard
- Analytics API endpoint
- Collaborations API endpoint

## Architecture
contentflow is structured as a next-app application. Primary entry point: app/layout.tsx. Server/client split follows server-default-client-islands.

## Setup
- `NEXT_PUBLIC_APP_URL`: project-specific configuration
- `NEXT_PUBLIC_POSTHOG_HOST`: project-specific configuration
- `NEXT_PUBLIC_POSTHOG_KEY`: project-specific configuration
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: project-specific configuration
- `NEXT_PUBLIC_SANITY_DATASET`: project-specific configuration
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: project-specific configuration
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: project-specific configuration
- `NEXT_PUBLIC_SUPABASE_URL`: project-specific configuration
- `NODE_ENV`: project-specific configuration
- `POSTHOG_API_KEY`: project-specific configuration
- `SANITY_API_TOKEN`: project-specific configuration
- `STRIPE_PRO_PRICE_ID`: Stripe API key or webhook secret
- `STRIPE_SECRET_KEY`: Stripe API key or webhook secret
- `STRIPE_WEBHOOK_SECRET`: Stripe API key or webhook secret
- `SUPABASE_SERVICE_ROLE_KEY`: project-specific configuration

### Scripts
- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint`

## Key Files
- `lib/sanity/client.ts`: Sanity CMS client - all content fetching goes through here
- `lib/supabase/server.ts`: Server-side database client - all server component data access goes through here
- `types/index.ts`: Central type definitions - check here before defining new types
- `types/supabase.ts`: Auto-generated - never edit manually, regenerate with the appropriate CLI command
- `lib/sanity/queries.ts`: Sanity GROQ queries - all CMS content queries defined here
- `lib/utils.ts`: Shared utility functions - imported by 30 files

## What Not To Do
- Never use useEffect for data fetching - use TanStack Query or server components
<!-- contextpack-generated -->
