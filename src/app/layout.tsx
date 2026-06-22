import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Well Nice Club",
  description: "A quieter kind of community for people who care about how things are made.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = <body>{children}</body>;

  if (publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <html lang="en">{content}</html>
      </ClerkProvider>
    );
  }

  return <html lang="en">{content}</html>;
}
