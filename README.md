# ContentFlow

A CMS-driven SaaS dashboard built for Weframetech. ContentFlow enables teams to create, manage, and publish content with subscription-based access control.

## Features

- **Authentication**: Secure auth with Supabase (email/password)
- **Content Management**: Full CRUD operations via Sanity CMS
- **Subscription Billing**: Stripe integration with Pro/Free tiers
- **Live Preview**: Draft mode for viewing unpublished content
- **Admin Panel**: Role-based access control for user management
- **Analytics**: PostHog event tracking and feature flags
- **Responsive UI**: Dark theme with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **CMS**: Sanity
- **Payments**: Stripe
- **Analytics**: PostHog
- **State**: Zustand + TanStack Query

## Quick Start

### Prerequisites

- Node.js 20+
- Supabase account
- Sanity account
- Stripe account
- PostHog account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/contentflow.git
cd contentflow
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in all environment variables in `.env.local`

5. Set up Supabase:
   - Run the migrations in `supabase/migrations/`
   - Enable Row Level Security (RLS)
   - Set up storage bucket for avatars

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Stripe
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
```

### Sanity
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_PREVIEW_SECRET=
```

### PostHog
```env
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### App
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
contentflow/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group (login)
│   ├── (dashboard)/       # Dashboard group
│   ├── (admin)/           # Admin group
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # UI components
│   ├── ui/               # shadcn/ui components
│   └── shared/           # Shared components
├── features/             # Feature modules
│   ├── auth/
│   ├── posts/
│   ├── settings/
│   ├── billing/
│   └── admin/
├── lib/                  # Utilities
│   ├── supabase/
│   ├── sanity/
│   └── stripe.ts
├── hooks/                # Custom hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── supabase/             # Database migrations
```

## Features

### 1. Authentication
- Email/password authentication via Supabase
- Protected routes with middleware
- Automatic profile creation on signup
- Logout functionality

### 2. Posts Management
- View all posts with TanStack Query
- Featured banner with PostHog feature flag
- Search and filter posts
- Create new posts directly in-app
- View individual posts with Portable Text rendering
- Draft mode for previewing unpublished content

### 3. Settings
- Update profile (display name, bio, website)
- Avatar upload with Supabase Storage
- Account deletion with confirmation
- Profile completion tracking

### 4. Billing
- View current subscription plan
- Upgrade to Pro via Stripe Checkout
- Manage subscription via Stripe Portal
- Plan comparison table
- Webhook handling for subscription updates

### 5. Admin Panel
- View all registered users
- Role-based access control
- User subscription and role badges
- Admin-only route protection

### 6. Live Preview (Draft Mode)
- Enable draft mode with secret key
- View unpublished posts
- Preview banner in UI
- Exit preview mode

## API Routes

- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/create-portal-session` - Create Stripe portal
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/posts/create` - Create new post
- `POST /api/toggle-featured` - Toggle featured status
- `GET /api/draft/enable` - Enable draft mode
- `GET /api/draft/disable` - Disable draft mode

## Database Schema

### Profiles Table
```sql
- id (UUID, PK)
- email (TEXT)
- display_name (TEXT)
- bio (TEXT)
- website (TEXT)
- avatar_url (TEXT)
- subscription_tier (TEXT: 'free' | 'pro')
- role (TEXT: 'user' | 'admin')
- stripe_customer_id (TEXT)
- stripe_subscription_id (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## PostHog Events

- `identify` - User login
- `posts_page_viewed` - Posts list viewed
- `post_viewed` - Individual post viewed
- `post_created` - New post created
- `upgrade_intent` - Upgrade button clicked
- `upgrade_completed` - Payment successful (server-side)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production domain
- `NEXT_PUBLIC_SUPABASE_URL` to production Supabase
- Stripe keys to production mode
- PostHog key to production project

### Stripe Webhook

For production, set up webhook endpoint:
```
https://yourdomain.com/api/webhooks/stripe
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.deleted`

## Development

### Running Tests
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Dev server
npm run dev
```

### Code Standards

- TypeScript strict mode - no `any` types
- PascalCase components
- camelCase hooks with `use` prefix
- UPPER_SNAKE_CASE constants
- All conditional classes use `cn()` from lib/utils
- All images use `next/image`
- All toasts use Sonner (not shadcn toast)

## License

MIT License - Weframetech

## Support

For support, email support@weframetech.com or open an issue on GitHub.
