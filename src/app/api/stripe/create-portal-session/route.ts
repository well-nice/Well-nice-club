import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMemberByClerkUserId, isClerkConfigured } from "@/lib/member-access";
import { PayloadNotConfiguredError } from "@/lib/payload/client";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/utils";

export async function POST() {
  const { userId } = isClerkConfigured() ? await auth() : { userId: "local-preview-user" };

  if (!userId) {
    return NextResponse.redirect(`${getAppUrl()}/sign-in?redirect_url=/app/account`, 303);
  }

  let customerId: unknown = process.env.STRIPE_PREVIEW_CUSTOMER_ID;

  try {
    const member = await getMemberByClerkUserId(userId);
    customerId = member?.stripeCustomerId || customerId;
  } catch (error) {
    if (error instanceof PayloadNotConfiguredError && !customerId) {
      return NextResponse.json(
        { error: "Payload is not configured.", next: "Set DATABASE_URL and PAYLOAD_SECRET." },
        { status: 503 }
      );
    }

    if (!(error instanceof PayloadNotConfiguredError)) {
      throw error;
    }
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
