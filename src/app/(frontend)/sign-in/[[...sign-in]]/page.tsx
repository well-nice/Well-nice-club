import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { PublicHeader } from "@/components/public-header";

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <AuthShell
        body="Welcome back. Sign in to continue to your membership, manage your account, or return to the club."
        eyebrow="Returning member"
        footerHref="/join"
        footerLabel="View membership"
        footerText="Not a member yet?"
        title="Good to see you again."
      >
        {hasClerk ? <SignIn fallbackRedirectUrl="/app" routing="path" path="/sign-in" /> : null}
      </AuthShell>
    </div>
  );
}
