import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const interests = ["Food", "Home", "Style", "Travel", "Family", "Culture", "Music", "Objects", "Creativity"];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Waitlist</p>
          <h1 className="mt-4 text-5xl font-semibold leading-none tracking-[-0.07em] sm:text-6xl">
            Apply for a quieter club.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">
            Tell us where you are, what you care about, and why Well Nice feels like a fit.
          </p>
          <Button asChild className="mt-8" variant="outline">
            <Link href="/join">Ready to join instead?</Link>
          </Button>
        </section>

        <Card>
          <form action="/api/waitlist" className="space-y-5" method="post">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Name
                <input className="field" name="name" placeholder="Your name" required />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Email
                <input className="field" name="email" placeholder="you@example.com" required type="email" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Location
                <input className="field" name="location" placeholder="London, Bristol, Glasgow..." required />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Instagram
                <input className="field" name="instagram" placeholder="@wellnice" />
              </label>
            </div>
            <fieldset>
              <legend className="mb-3 text-sm font-medium">Interests</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {interests.map((interest) => (
                  <label
                    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-3 text-sm"
                    key={interest}
                  >
                    <input name="interests" type="checkbox" value={interest} />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="space-y-2 text-sm font-medium">
              Why do you want to join?
              <textarea className="field min-h-36" name="reason" placeholder="A few sentences is enough." required />
            </label>
            <Button className="w-full" size="lg" type="submit">
              Submit application
            </Button>
            <p className="text-xs leading-5 text-neutral-500">
              Submissions enter Payload with status "new" for admin review, approval, invitation, joining, or rejection.
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
}
