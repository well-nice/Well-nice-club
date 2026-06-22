import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { PublicHeader } from "@/components/public-header";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <main className="mx-auto flex max-w-4xl justify-center px-5 py-12 sm:px-8">
        <Card className="w-full max-w-md">
          {hasClerk ? (
            <SignIn routing="path" path="/sign-in" />
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Sign in</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">Clerk is ready to connect.</h1>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Add Clerk keys to your environment to enable email login, password reset, sessions, and protected access.
              </p>
              <Link className="mt-6 inline-block text-sm font-medium underline" href="/join">
                Back to membership
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
