# ContentFlow Sanity Setup & Seed Instructions

## 1. Accessing Sanity Studio
If this project is linked to an existing Sanity Studio deployment:
1. Navigate to your Sanity Studio URL (usually deployed on a subdomain or `/studio` via Next.js).
2. Login with your team credentials.
3. If this is a new project, deploy Sanity Studio securely locally via `npx sanity init` in the `sanity-studio` directory (schema is already completely pre-built for you there) and run `npm run dev`.

## 2. Setting Up Authors
Before adding posts, navigate to the **Authors** tab and create at least 1 author:
- **Name**: e.g., "Avinash Patel"
- **Slug**: "avinash-patel" (Press generate)
- **Image**: Upload any professional portrait.
- **Bio**: "Lead Content Architect scaling Next.js pipelines."

## 3. Dummy Content (Create 5 Posts)
Navigate to the **Posts** tab. You MUST ensure every post has a **Cover Image**, an **Author**, a proper **PublishedAt** date, and specific **Tags**.

### Post 1 (Featured)
- **Title:** Scaling Postgres to 10M requests per second
- **Slug:** scaling-postgres-10m
- **Excerpt:** Deep dive into how our engineering team eliminated bottleneck contention with horizontally federated read replicas.
- **Body:** (Add dummy rich text testing headers, blockquotes, and inline code).
- **Author:** [Select your Author]
- **Cover Image:** [Upload tech/server abstract image]
- **PublishedAt:** (Select today's date)
- **Tags:** `Database`, `Postgres`, `Scaling`, `Performance`
- **Featured:** `True` (Toggled on)

### Post 2
- **Title:** Microservices vs. Monoliths: The 2024 Retrospective
- **Slug:** microservices-vs-monoliths-2024
- **Excerpt:** We migrated our entire core to a monolith last year. Here are the hard metrics nobody talks about.
- **Body:** (Add dummy text).
- **Author:** [Select your Author]
- **Cover Image:** [Upload architecture abstract image]
- **PublishedAt:** (Select yesterday)
- **Tags:** `Architecture`, `Microservices`, `Monolith`, `System Design`
- **Featured:** `False`

### Post 3
- **Title:** Optimizing Rust compilation times for CI/CD
- **Slug:** optimizing-rust-compilation-cicd
- **Excerpt:** How dropping our pipeline times from 45 minutes to 3 minutes saved our release cycles.
- **Body:** (Add dummy text).
- **Author:** [Select your Author]
- **Cover Image:** [Upload code/IDE image]
- **PublishedAt:** (Select 3 days ago)
- **Tags:** `Rust`, `CI/CD`, `DevOps`, `Infrastructure`
- **Featured:** `False`

### Post 4
- **Title:** Why we chose Zustand over Jotai
- **Slug:** why-zustand-over-jotai
- **Excerpt:** An unbiased comparison into atomic state architectures versus monolithic state architectures.
- **Body:** (Add dummy text).
- **Author:** [Select your Author]
- **Cover Image:** [Upload UI abstract image]
- **PublishedAt:** (Select 1 week ago)
- **Tags:** `React`, `Zustand`, `Jotai`, `State Management`
- **Featured:** `False`

### Post 5
- **Title:** Implementing Supabase Row Level Security Patterns
- **Slug:** supabase-rls-patterns
- **Excerpt:** Protecting multi-tenant SaaS environments structurally using Postgres extensions.
- **Body:** (Add dummy text).
- **Author:** [Select your Author]
- **Cover Image:** [Upload secure/lock abstract image]
- **PublishedAt:** (Select 2 weeks ago)
- **Tags:** `Supabase`, `Security`, `Postgres`, `BaaS`
- **Featured:** `False`

After saving these blocks, the Weframetech `app/(dashboard)/dashboard/page.tsx` home page UI will instantly fetch and render the live post-count using the `POSTS_COUNT_QUERY`.
