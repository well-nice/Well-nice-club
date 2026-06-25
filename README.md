# Well Nice Club

A Next.js 15 prototype and implementation scaffold for `club.wellnice.com`.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style local UI components, Lucide icons
- Clerk-ready authentication
- Stripe Billing, Checkout Sessions, Customer Portal, and verified webhooks
- Payload CMS mounted inside the Next.js app
- Postgres through `@payloadcms/db-postgres`

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `DATABASE_URL` and `PAYLOAD_SECRET` in `.env.local` before running Payload locally.

## Key routes

- `/` - public landing page
- `/waitlist` - waitlist application form
- `/join` - membership plans
- `/admin` - Payload CMS admin

## Payload routes

- `/admin` - Payload admin UI
- `/api/[...slug]` - Payload REST API, including protected collection routes such as `/api/waitlist`
- `/api/graphql` - Payload GraphQL API
- `/api/graphql-playground` - Payload GraphQL Playground
- `POST /api/app/waitlist` - public product waitlist submission endpoint that writes to Payload with server-side access override

## Payload notes

`payload.config.ts` and `src/lib/payload/collections.ts` define the CMS collections the current app and design imply:

- `admins`, `waitlist`, `members`, `spaces`, `posts`, `comments`
- `journal`, `events`, `recommendations`, `concierge-requests`, `concierge-knowledge-base`
- `drops`, `reports`, and `media`

Payload uses `DATABASE_URL` for Postgres and `PAYLOAD_SECRET` for auth/session security. `PAYLOAD_DB_PUSH=true` can be used intentionally when pushing the Payload schema to a database.
