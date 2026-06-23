import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/member-access";
import { getCheckoutUrls, getPriceId, getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/utils";

const checkoutSchema = z.object({
  planId: z.enum(["founding", "monthly", "annual"])
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid membership plan." }, { status: 400 });
  }

  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Clerk is required for checkout.", next: "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY." },
      { status: 503 }
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${getAppUrl()}/sign-up?redirect_url=/join`, 303);
  }

  const stripe = getStripe();
  const priceId = getPriceId(parsed.data.planId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: userId,
    metadata: {
      clerkUserId: userId,
      plan: parsed.data.planId
    },
    subscription_data: {
      metadata: {
        clerkUserId: userId,
        plan: parsed.data.planId
      }
    },
    ...getCheckoutUrls()
  });

  if (!session.url) {
    return NextResponse.json({ error: "Unable to create Stripe Checkout session." }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
