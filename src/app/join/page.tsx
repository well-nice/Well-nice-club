import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";
import { membershipPlans } from "@/lib/data";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Membership</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none tracking-[-0.07em] sm:text-7xl">
            Join the club, then enter the members&apos; app.
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Access is granted only after Stripe confirms the subscription through a verified webhook.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {membershipPlans.map((plan) => (
            <Card className="flex flex-col" key={plan.id}>
              <CardEyebrow>{plan.name}</CardEyebrow>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.08em]">{plan.price}</span>
                <span className="pb-2 text-sm text-neutral-500">{plan.cadence}</span>
              </div>
              <CardDescription className="mt-5">{plan.description}</CardDescription>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex items-center gap-3 text-sm text-neutral-700" key={feature}>
                    <Check className="h-4 w-4 text-neutral-950" />
                    {feature}
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/create-checkout-session" className="mt-8" method="post">
                <input name="planId" type="hidden" value={plan.id} />
                <Button className="w-full" type="submit">
                  Select {plan.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          ))}
        </div>

        <Card className="mt-8 flex flex-col gap-4 bg-neutral-950 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <CardEyebrow className="text-white/45">Already invited?</CardEyebrow>
            <CardTitle className="mt-2 text-white">Create your account before checkout.</CardTitle>
            <CardDescription className="mt-2 text-white/60">
              Clerk handles email signup, login, password reset, sessions, and protected routes.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}
