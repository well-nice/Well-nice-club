import Link from "next/link";
import { desktopNav, mobileNav } from "@/lib/data";

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f4f1] text-neutral-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-neutral-200 bg-[#fbfaf7] px-6 py-7 lg:block">
        <Link className="text-xl font-semibold tracking-[-0.06em]" href="/app">
          w/n
        </Link>
        <p className="mt-3 max-w-44 text-sm leading-6 text-neutral-500">Well Nice Club. A quieter kind of community.</p>
        <nav className="mt-10 space-y-1">
          {desktopNav.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-full px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
              href={item.href}
              key={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="pb-28 lg:ml-72 lg:pb-0">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-neutral-200 bg-[#fbfaf7]/95 px-2 py-2 backdrop-blur lg:hidden">
        {mobileNav.map((item) => (
          <Link
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] text-neutral-600"
            href={item.href}
            key={item.href}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
