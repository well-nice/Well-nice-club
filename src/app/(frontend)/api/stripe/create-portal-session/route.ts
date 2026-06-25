import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMemberByClerkUserId, isClerkConfigured } from "@/lib/member-access";
import { PayloadNotConfiguredError } from "@/lib/payload/client";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/utils";

export async function POST() {
  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Clerk is required for billing portal access.", next: "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY." },
      { status: 503 }
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${getAppUrl()}/sign-in?redirect_url=/app/account`, 303);
  }

  let customerId: unknown;

  try {
    const member = await getMemberByClerkUserId(userId);

    if (!member) {
      return NextResponse.json(
        { error: "Member record not found.", next: "Complete checkout and allow the Stripe webhook to sync membership first." },
        { status: 404 }
      );
    }

    customerId = member.stripeCustomerId;
  } catch (error) {
    if (error instanceof PayloadNotConfiguredError) {
      return NextResponse.json(
        { error: "Payload is not configured.", next: "Set DATABASE_URL and PAYLOAD_SECRET." },
        { status: 503 }
      );
    }

    throw error;
  }

  if (typeof customerId !== "string" || !customerId) {
    return NextResponse.json(
      {
        error: "Stripe customer id is required.",
        next: "Store stripeCustomerId on the Payload Member record from the Stripe webhook."
      },
      { status: 409 }
    );
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getAppUrl()}/app/account`
  });

  return NextResponse.redirect(session.url, 303);
}
