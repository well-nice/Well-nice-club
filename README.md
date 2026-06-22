# Well Nice Club

A Next.js 15 prototype and implementation scaffold for `club.wellnice.com`: a premium paid members club combining membership, community, editorial content, events, recommendations, an AI-powered Concierge, member benefits, and Payload CMS operations.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style local UI components, Lucide icons
- Clerk-ready authentication
- Stripe Billing, Checkout Sessions, Customer Portal, and verified webhooks
- Payload CMS collection schema for the operational back office
- Supabase PostgreSQL-ready Payload database adapter

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the environment values in `.env.local` before enabling live auth, billing, CMS, or Concierge behavior.

## Key routes

- `/` - editorial landing page based on the prototype direction
- `/waitlist` - waitlist application form
- `/join` - Founding, Monthly, and Annual membership plans
- `/sign-in` and `/sign-up` - Clerk auth surfaces
- `/onboarding` - profile, interests, and optional introduction
- `/app` - member home feed
- `/app/spaces`, `/app/journal`, `/app/recommendations`, `/app/concierge`, `/app/events`, `/app/members`, `/app/drops`, `/app/account`

## API routes

- `POST /api/waitlist`
- `POST /api/onboarding`
- `POST /api/posts`
- `POST /api/comments`
- `POST /api/reports`
- `POST /api/concierge`
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/create-portal-session`
- `POST /api/stripe/webhook`

## Stripe notes

Checkout uses `mode: "subscription"` with Stripe Prices and intentionally does not pass `payment_method_types`, allowing Stripe dynamic payment methods to apply. Member access should only become active from verified Stripe webhook events, never from the Checkout success URL.

Prefer restricted API keys for production Stripe server routes and keep all secrets outside source control.

## Payload notes

`payload.config.ts` and `src/lib/payload/collections.ts` define the CMS schema from the specification: waitlist, members, spaces, posts, comments, journal, events, recommendations, Concierge requests, Concierge knowledge base, drops, reports, and media.

The current UI/API scaffold returns accepted responses until database credentials are connected. Once Supabase PostgreSQL and Payload are configured, wire the route handlers to the relevant collections and use the Member record to enforce:

- authenticated Clerk user
- active Stripe-confirmed membership
- onboarding complete
- not banned
