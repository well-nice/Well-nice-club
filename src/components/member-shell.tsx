import Link from "next/link";
import Image from "next/image";
import { desktopNav, mobileNav } from "@/lib/data";

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#efefed] text-neutral-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-white/70 px-6 py-7 backdrop-blur lg:block">
        <Link className="flex items-center" href="/app">
          <Image alt="Well Nice" height={29} priority src="/brand/well-nice-short-mark.png" width={72} />
        </Link>
        <p className="mt-3 max-w-44 text-sm leading-6 text-neutral-500">Well Nice Club. A quieter kind of community.</p>
        <nav className="mt-10 space-y-1">
          {desktopNav.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-white hover:text-neutral-950"
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

      <nav className="fixed inset-x-0 bottom-0 z-20 grid h-[88px] grid-cols-5 border-t border-black/10 bg-white px-2 pt-3 shadow-[0_-8px_30px_-24px_rgba(0,0,0,0.45)] lg:hidden">
        {mobileNav.map((item) => (
          <Link
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold lowercase text-neutral-400"
            href={item.href}
            key={item.href}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        <div className="absolute bottom-[9px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-neutral-950" />
      </nav>
    </div>
  );
}
