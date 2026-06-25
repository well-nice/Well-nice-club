import { MemberShell } from "@/components/member-shell";
import { enforceAppAccess, getAppAccessState } from "@/lib/member-access";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const accessState = await getAppAccessState();
  enforceAppAccess(accessState);

  return (
    <MemberShell>
      {accessState.status === "preview" ? (
        <div className="border-b border-neutral-200 bg-neutral-950 px-5 py-3 text-sm text-white sm:px-8 lg:px-12">
          Preview mode: {accessState.reason} Configure Clerk and Payload to enforce paid member access.
        </div>
      ) : null}
      {children}
    </MemberShell>
  );
}
