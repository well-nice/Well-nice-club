import Link from "next/link";
import { ArrowRight, Bookmark, Heart, MessageCircle, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";
import { drops, feedCards, recommendations, upcomingEvents } from "@/lib/data";

export default function MemberHomePage() {
  return (
    <div className="wn-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Member home</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em]">Good things, gently sorted.</h1>
          </div>
          <Button asChild>
            <Link href="/app/concierge">
              Ask the Concierge
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="mt-4 bg-neutral-950 p-5 text-white sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardEyebrow className="text-white/45">Today</CardEyebrow>
              <CardTitle className="mt-2 text-2xl text-white">Ask the concierge for something good.</CardTitle>
              <CardDescription className="mt-2 text-white/60">
                A place, product, trip, gift, family plan, or a more specific version of something useful.
              </CardDescription>
            </div>
            <Button asChild className="bg-white text-neutral-950 hover:bg-neutral-100">
              <Link href="/app/concierge">Start</Link>
            </Button>
          </div>
        </Card>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-5">
            {feedCards.map((card) => (
              <Card key={card.title}>
                <CardEyebrow>{card.label}</CardEyebrow>
                <CardTitle className="mt-3 text-3xl">{card.title}</CardTitle>
                <CardDescription className="mt-3 text-base">{card.body}</CardDescription>
                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Heart className="mr-2 h-4 w-4" />
                      Like
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Comment
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                  <Button aria-label="Report or more actions" size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </section>

          <aside className="space-y-5">
            <Card className="bg-white">
              <CardEyebrow>Concierge prompt</CardEyebrow>
              <CardTitle className="mt-3">What should we find for you?</CardTitle>
              <CardDescription className="mt-3">
                Ask for a place, product, trip, gift, family plan, or a more specific version of &quot;something good&quot;.
              </CardDescription>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/app/concierge">Start a request</Link>
              </Button>
            </Card>

            <Card>
              <CardEyebrow>Upcoming events</CardEyebrow>
              <div className="mt-4 space-y-4">
                {upcomingEvents.slice(0, 2).map((event) => (
                  <div className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0" key={event.title}>
                    <h3 className="font-semibold tracking-[-0.03em]">{event.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {event.date} · {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardEyebrow>Member benefits</CardEyebrow>
              <div className="mt-4 space-y-4">
                {drops.map((drop) => (
                  <div key={drop.title}>
                    <h3 className="font-semibold tracking-[-0.03em]">{drop.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{drop.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardEyebrow>Recommendations</CardEyebrow>
              <div className="mt-4 space-y-4">
                {recommendations.slice(0, 2).map((item) => (
                  <Link className="block rounded-2xl hover:bg-neutral-50" href="/app/recommendations" key={item.title}>
                    <h3 className="font-semibold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {item.category} · {item.location}
                    </p>
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/app/recommendations">
                  Browse library
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
