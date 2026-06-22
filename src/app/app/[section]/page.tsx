import { notFound } from "next/navigation";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardEyebrow, CardTitle } from "@/components/ui/card";
import { sectionContent, type SectionKey } from "@/lib/data";

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(sectionContent).map((section) => ({ section }));
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;

  if (!isSectionKey(section)) {
    notFound();
  }

  const content = sectionContent[section];
  const isConcierge = section === "concierge";
  const isAccount = section === "account";

  return (
    <div className="px-5 py-8 sm:px-8 lg:px-12">
      <main className="mx-auto max-w-6xl">
        <div className="grid gap-6 border-b border-neutral-200 pb-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">{content.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-semibold leading-none tracking-[-0.07em]">{content.title}</h1>
          </section>
          <p className="text-lg leading-8 text-neutral-600 lg:pt-8">{content.description}</p>
        </div>

        {isConcierge ? <ConciergePanel /> : null}
        {isAccount ? <AccountPanel /> : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item) => (
            <Card key={getItemTitle(item)}>
              {"category" in item ? <CardEyebrow>{item.category}</CardEyebrow> : null}
              {"type" in item ? <CardEyebrow>{item.type}</CardEyebrow> : null}
              {"meta" in item ? <CardEyebrow>{item.meta}</CardEyebrow> : null}
              {"code" in item ? <CardEyebrow>{item.code}</CardEyebrow> : null}
              <CardTitle className="mt-3">{getItemTitle(item)}</CardTitle>
              <CardDescription className="mt-3">
                {"description" in item
                  ? item.description
                  : "excerpt" in item
                    ? item.excerpt
                    : "bio" in item
                      ? item.bio
                      : ""}
              </CardDescription>
              {"location" in item ? <p className="mt-4 text-sm text-neutral-500">{item.location}</p> : null}
              {"interests" in item ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.interests.map((interest) => (
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600" key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function ConciergePanel() {
  return (
    <Card className="mt-8 bg-neutral-950 text-white">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Sparkles className="h-8 w-8" />
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.06em]">Ask for something considered.</h2>
          <p className="mt-4 text-sm leading-6 text-white/60">
            V1 stores a member request, drafts an AI response, and sends it to admin review before the final answer is returned.
          </p>
        </div>
        <form action="/api/concierge" className="space-y-4" method="post">
          <textarea
            className="field min-h-32 border-white/10 bg-white/[0.06] text-white placeholder:text-white/35"
            name="request"
            placeholder="I need a beautiful but relaxed place for lunch near Coal Drops Yard with a pram..."
            required
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="field border-white/10 bg-white/[0.06] text-white" name="category" placeholder="Category" />
            <input className="field border-white/10 bg-white/[0.06] text-white" name="location" placeholder="Location" />
            <input className="field border-white/10 bg-white/[0.06] text-white" name="budget" placeholder="Budget" />
          </div>
          <Button type="submit" variant="outline">
            Submit request
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

function AccountPanel() {
  return (
    <Card className="mt-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <CardEyebrow>Billing</CardEyebrow>
          <CardTitle className="mt-2">Open Stripe Customer Portal</CardTitle>
          <CardDescription className="mt-2">
            Members can manage payment methods, invoices, renewals, and cancellations in Stripe.
          </CardDescription>
        </div>
        <form action="/api/stripe/create-portal-session" method="post">
          <Button type="submit">
            Manage billing
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

function isSectionKey(section: string): section is SectionKey {
  return section in sectionContent;
}

function getItemTitle(item: (typeof sectionContent)[SectionKey]["items"][number]) {
  return "title" in item ? item.title : item.name;
}
