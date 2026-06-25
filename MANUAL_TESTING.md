# Manual membership-flow testing

Use this checklist when testing the Well Nice Club membership flow locally or in Vercel preview.

## Required environment variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/app
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_FOUNDING=price_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...

DATABASE_URL=postgresql://...
PAYLOAD_SECRET=long-random-secret
```

Set `PAYLOAD_DB_PUSH=true` only when intentionally pushing Payload schema changes.

If you pull Vercel env vars locally, check `NEXT_PUBLIC_APP_URL`. For local testing it should point at your local app URL, for example `http://localhost:3000`.

## Stripe webhook forwarding

In one terminal:

```bash
npm run dev
```

In another terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` for the local app, then restart `npm run dev`.

## Test card

Use Stripe test card:

```txt
4242 4242 4242 4242
```

Use any future expiry date, any CVC, and any postal code.

## Expected redirects

- Signed out user visiting `/app`
  - redirects to `/sign-in?redirect_url=/app`
- Signed out user selecting a plan on `/join`
  - redirects to `/sign-up?redirect_url=/join?plan=<plan>`
  - selected plan should still be highlighted after returning to `/join`
- Signed in but unpaid/inactive user visiting `/app`
  - redirects to `/join`
- Active member with `onboardingComplete=false`
  - redirects to `/onboarding`
- Active member with `onboardingComplete=true`
  - can access `/app`

## Full flow checklist

> Note: Clerk may render a Cloudflare Turnstile challenge on the sign-up screen. If you are using headless automation, sign-up can stall with an empty `cf-turnstile-response`. Complete this step in a real browser session.

1. Visit `/sign-up`.
2. Create a Clerk user.
3. Visit `/join`.
4. Select Founding, Monthly, or Annual.
5. Complete Stripe Checkout with the test card.
6. Confirm Stripe CLI forwards webhook events to `/api/stripe/webhook`.
7. Open Payload admin at `/admin`.
8. Check the member record in `members`.

Expected member state after a successful subscription webhook:

```txt
clerkUserId: Clerk user ID
email: Clerk/Stripe customer email
name: Clerk/Stripe customer name or fallback
stripeCustomerId: cus_...
stripeSubscriptionId: sub_...
plan: founding | monthly | annual
membershipStatus: active
onboardingComplete: false
```

9. Visit `/onboarding`.
10. Submit profile, location, bio, and interests.
11. Confirm Payload member has:

```txt
onboardingComplete: true
location: filled
bio: filled
interests: filled
```

12. Visit `/app`.
13. Confirm the member area unlocks.

## Failure cases to verify

- Unsigned Stripe webhook requests should return `400`.
- Subscription or invoice webhook events with a Stripe customer/subscription that cannot map to a Payload member should return `500` so Stripe retries.
- `checkout.session.completed` should not downgrade an existing `active`, `past_due`, or `cancelled` member to `pending`.
- Onboarding should not create a member record by itself.
- Onboarding should only complete for members with `membershipStatus=active`.
