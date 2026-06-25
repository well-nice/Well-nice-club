import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";

const interests = ["Food", "Home", "Style", "Travel", "Family", "Culture", "Music", "Objects", "Creativity"];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] px-5 py-10 text-neutral-950 sm:px-8">
      <main className="mx-auto max-w-5xl">
        <p className="text-lg font-semibold tracking-[-0.06em]">w/n</p>
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Onboarding</p>
            <h1 className="mt-4 text-5xl font-semibold leading-none tracking-[-0.07em]">
              Set the tone before you enter.
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Profile, interests, optional introduction, then redirect to the member area.
            </p>
          </section>

          <Card>
            <form action="/api/onboarding" className="space-y-8" method="post">
              <section>
                <CardEyebrow>Step 1 · Profile</CardEyebrow>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input className="field" name="name" placeholder="Name" required />
                  <input className="field" name="location" placeholder="Location" required />
                </div>
                <textarea className="field mt-4 min-h-28" name="bio" placeholder="Short bio" required />
                <input className="field mt-4" name="photo" placeholder="Photo URL, for now" />
              </section>

              <section>
                <CardEyebrow>Step 2 · Interests</CardEyebrow>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
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
              </section>

              <section>
                <CardEyebrow>Step 3 · Introduction</CardEyebrow>
                <CardTitle className="mt-3">Say hello, if you like.</CardTitle>
                <CardDescription className="mt-2">The first post is optional and can be published into Start Here.</CardDescription>
                <textarea className="field mt-4 min-h-28" name="firstPost" placeholder="A small introduction..." />
              </section>

              <Button className="w-full" size="lg" type="submit">
                Complete onboarding
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
