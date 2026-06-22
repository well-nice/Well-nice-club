import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";
import { feedCards, publicPrinciples, spaces, upcomingEvents } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-neutral-950">
      <PublicHeader />

      <main>
        <section className="mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-6 text-lg font-semibold tracking-[-0.06em]">w/n</p>
            <h1 className="max-w-3xl text-6xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl lg:text-8xl">
              A quieter kind of community.
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-8 text-neutral-600">
              Well Nice is a members' club for people who care about how things are made. Clarity, not complexity.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/join">
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-in">I already have an account</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-neutral-200 bg-[#111] p-4 text-white shadow-2xl shadow-neutral-300/60">
            <div className="rounded-[2rem] border border-white/10 bg-[#181818] p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-sm font-medium tracking-[-0.03em]">Well Nice Club</span>
                <span className="text-xs text-white/50">9:41</span>
              </div>
              <div className="space-y-4 py-8">
                {feedCards.map((card) => (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5" key={card.title}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{card.label}</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">{card.body}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950">
                Ask the Concierge for something good...
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-white/55">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-3">
            {publicPrinciples.map((principle) => (
              <div className="flex items-start gap-3 text-sm text-neutral-700" key={principle}>
                <Check className="mt-0.5 h-4 w-4 text-neutral-950" />
                {principle}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Inside the club</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Community with an editorial point of view.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {spaces.slice(0, 6).map((space) => (
                <Card key={space.slug}>
                  <CardEyebrow>{space.meta}</CardEyebrow>
                  <CardTitle className="mt-3">{space.title}</CardTitle>
                  <CardDescription className="mt-3">{space.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <Card className="grid gap-8 bg-neutral-950 p-8 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <Sparkles className="h-8 w-8" />
              <h2 className="mt-8 text-4xl font-semibold tracking-[-0.06em]">The Concierge is the club's tastemaker.</h2>
              <p className="mt-5 text-white/65">
                Ask for places, products, experiences, travel, food, independent brands, gifts, family ideas, and creative inspiration.
              </p>
            </div>
            <div className="grid gap-3">
              {upcomingEvents.map((event) => (
                <div className="rounded-[1.5rem] border border-white/10 p-5" key={event.title}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{event.type}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">{event.title}</h3>
                  <p className="mt-2 text-sm text-white/60">
                    {event.date} · {event.location} · {event.capacity}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
