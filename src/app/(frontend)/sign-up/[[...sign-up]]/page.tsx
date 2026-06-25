import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { PublicHeader } from "@/components/public-header";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <main className="mx-auto flex max-w-4xl justify-center px-5 py-12 sm:px-8">
        <Card className="w-full max-w-md">
          {hasClerk ? (
            <SignUp routing="path" path="/sign-up" />
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Create account</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">Clerk signup is ready to connect.</h1>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Add Clerk keys to enable account creation before members choose a Stripe subscription plan.
              </p>
              <Link className="mt-6 inline-block text-sm font-medium underline" href="/join">
                Choose membership
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
