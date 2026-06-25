import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  footerHref: string;
  footerLabel: string;
  footerText: string;
};

export function AuthShell({ children, eyebrow, title, body, footerHref, footerLabel, footerText }: AuthShellProps) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-6xl items-center gap-8 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="wn-screen">
        <div className="mb-8 flex h-[72px] w-[72px] items-center justify-center rounded-[1.25rem] bg-neutral-950 p-4">
          <Image alt="Well Nice" className="invert" height={29} priority src="/brand/well-nice-short-mark.png" width={72} />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">{eyebrow}</p>
        <h1 className="mt-4 max-w-lg text-5xl font-bold leading-[0.98] tracking-[-0.06em] text-neutral-950 sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-neutral-600">{body}</p>
        <div className="mt-8 grid gap-3 text-sm text-neutral-600">
          <p>1. Create your account</p>
          <p>2. Choose membership</p>
          <p>3. Checkout securely</p>
          <p>4. Enter once membership is confirmed</p>
        </div>
        <p className="mt-8 max-w-sm text-sm leading-6 text-neutral-500">
          We may ask for a quick verification to keep the room private.
        </p>
      </section>

      <section className="wn-screen">
        <Card className="mx-auto w-full max-w-md bg-white p-4 sm:p-5">
          {children}
          <div className="mt-5 border-t border-neutral-100 pt-5 text-center text-sm text-neutral-500">
            {footerText}{" "}
            <Link className="font-semibold text-neutral-950 underline-offset-4 hover:underline" href={footerHref}>
              {footerLabel}
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
