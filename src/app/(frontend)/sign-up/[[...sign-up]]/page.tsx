import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";
import { PublicHeader } from "@/components/public-header";

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <PublicHeader />
      <AuthShell
        body="A private members' club for people who care about how things are made. Start with an account, then choose the plan that feels right."
        eyebrow="Create account"
        footerHref="/sign-in"
        footerLabel="Sign in"
        footerText="Already have an account?"
        title="A quieter kind of community."
      >
        {hasClerk ? <SignUp fallbackRedirectUrl="/onboarding" routing="path" path="/sign-up" /> : null}
      </AuthShell>
    </div>
  );
}
