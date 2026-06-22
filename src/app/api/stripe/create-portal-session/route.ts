import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  const { userId } = hasClerk ? await auth() : { userId: "local-preview-user" };

  if (!userId) {
    return NextResponse.redirect(`${getAppUrl()}/sign-in?redirect_url=/app/account`, 303);
  }

  const formData = await request.formData();
  const customerId = formData.get("stripeCustomerId")?.toString() || process.env.STRIPE_PREVIEW_CUSTOMER_ID;

  if (!customerId) {
    return NextResponse.json(
      {
        error: "Stripe customer id is required.",
        next: "Read stripeCustomerId from the Payload Member record for the authenticated Clerk user."
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
