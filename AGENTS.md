# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 15 (App Router) product — **Well Nice Club** — a paid digital
members club. There is one runnable process (the Next.js server). Payload CMS runs
in-process with Next.js (mounted under `/admin` and `/api/*`), so there is no separate
backend service. Clerk (auth), Stripe (billing) and OpenAI (Concierge) are hosted
third-party APIs configured purely via env vars; there is no local container for them.

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`, `typecheck`).
There is no test script/framework in this repo, so "running tests" means `npm run lint`
and `npm run typecheck`.

### Running the app

- Dev server: `npm run dev` → http://localhost:3000 (port 3000). Use a long-lived
  tmux session for it.
- Env file: copy `.env.example` to `.env.local` (gitignored). The app is designed to
  boot and render in **preview mode** with empty values, so an unfilled `.env.local`
  is enough to start the server and view public pages.

### Preview mode vs. end-to-end (non-obvious)

- Without `DATABASE_URL` + `PAYLOAD_SECRET`, Payload is not configured: `/admin` and any
  data-writing API (`/api/waitlist`, `/api/onboarding`, `/api/posts`, `/api/concierge`,
  etc.) return **HTTP 503** rather than crashing. The site still renders.
- Without Clerk keys, `middleware.ts` skips auth protection, so `/app/*` is reachable
  in preview mode (member gating is effectively disabled).
- To exercise data persistence end-to-end you only need a Postgres database — Clerk,
  Stripe and OpenAI are not required for the waitlist/CMS data flow.

### Local Postgres for end-to-end testing

`payload.config.ts` falls back to `postgres://wellnice:wellnice@localhost:5432/wellnice`.
The Payload Postgres adapter auto-creates its schema on first connection (dev push),
so no migrations need to be run by hand. To enable full E2E locally:

1. Ensure a local Postgres is running with a `wellnice` role/db (password `wellnice`).
2. In `.env.local` set:
   - `DATABASE_URL=postgres://wellnice:wellnice@localhost:5432/wellnice`
   - `PAYLOAD_SECRET=<any non-empty string>`
3. Restart `npm run dev` (env changes are read at startup; restart the server after
   editing `.env.local`).

Postgres is a system dependency and is intentionally **not** part of the update script;
install/start it separately when E2E persistence is needed.

### Hello-world / smoke check

`POST /api/waitlist` persists a waitlist application to Payload (Postgres):

```
curl -s -X POST http://localhost:3000/api/waitlist -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","location":"London","interests":["design"],"reason":"I would love to join this community."}'
```

With Postgres configured this returns `{"status":"created","waitlistId":N}` (201). Without
it, expect a 503 with `"Payload is not configured."` — that is preview mode, not a bug.

### Stripe webhooks

E2E billing requires an externally reachable webhook URL or the Stripe CLI
(`stripe listen --forward-to localhost:3000/api/stripe/webhook`). Membership activation
should only come from verified Stripe webhook events, never the Checkout success URL.
