import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <Link className="text-lg font-semibold tracking-[-0.05em]" href="/">
        w/n
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
        <Link href="/waitlist">Waitlist</Link>
        <Link href="/join">Membership</Link>
        <Link href="/app">Preview app</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/join">Join</Link>
        </Button>
      </div>
    </header>
  );
}
