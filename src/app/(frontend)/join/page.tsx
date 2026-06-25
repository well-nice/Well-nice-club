import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";
import { membershipPlans } from "@/lib/data";

type JoinPageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { plan: selectedPlanId } = await searchParams;

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="wn-screen">
            <div className="mb-8 flex h-[72px] w-[72px] items-center justify-center rounded-[1.25rem] bg-neutral-950 p-4">
              <Image alt="Well Nice" className="invert" height={29} priority src="/brand/well-nice-short-mark.png" width={72} />
            </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Membership</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none tracking-[-0.07em] sm:text-7xl">
            Join the club, then enter the members&apos; app.
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
              Create your account, choose a plan, and checkout securely. Access opens once membership is confirmed.
          </p>
          {selectedPlanId ? (
            <p className="mt-4 rounded-full bg-white px-4 py-2 text-sm text-neutral-600">
              Continue with your selected plan below.
            </p>
          ) : null}
          </div>
          <Card className="wn-screen bg-neutral-950 p-7 text-white">
            <CardEyebrow className="text-white/45">How it works</CardEyebrow>
            <div className="mt-5 grid gap-4 text-sm leading-6 text-white/70">
              <p>1. Create an account so the club knows who you are.</p>
              <p>2. Choose a membership and checkout securely.</p>
              <p>3. Complete onboarding once payment is confirmed.</p>
              <p>4. Enter the members&apos; app.</p>
            </div>
          </Card>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {membershipPlans.map((plan) => (
            <Card
              className={plan.id === selectedPlanId ? "flex flex-col border-2 border-neutral-950" : "flex flex-col"}
              key={plan.id}
            >
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
              <form action="/api/stripe/create-checkout-session" className="mt-auto pt-8" method="post">
                <input name="planId" type="hidden" value={plan.id} />
                <Button className="w-full" type="submit">
                  {plan.id === selectedPlanId ? `Continue with ${plan.name}` : `Select ${plan.name}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          ))}
        </div>

        <Card className="mt-8 flex flex-col gap-4 bg-white/80 md:flex-row md:items-center md:justify-between">
          <div>
            <CardEyebrow>Already invited?</CardEyebrow>
            <CardTitle className="mt-2">Create your account before checkout.</CardTitle>
            <CardDescription className="mt-2">
              We may ask for a quick verification to keep the room private.
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
