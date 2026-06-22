import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, membershipStatusFromSubscription } from "@/lib/stripe";

export const runtime = "nodejs";

const handledEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed"
]);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook signature configuration is missing." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  if (!handledEvents.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const membershipUpdate = deriveMembershipUpdate(event);

  if (membershipUpdate) {
    // This is the only place membership access should become active.
    // Wire this object to the Payload Member collection after database credentials are configured.
    return NextResponse.json({ received: true, membershipUpdate });
  }

  return NextResponse.json({ received: true });
}

function deriveMembershipUpdate(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    return {
      clerkUserId: session.metadata?.clerkUserId || session.client_reference_id,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
      stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
      plan: session.metadata?.plan,
      membershipStatus: "pending"
    };
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;

    return {
      clerkUserId: subscription.metadata.clerkUserId,
      stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      stripeSubscriptionId: subscription.id,
      plan: subscription.metadata.plan,
      membershipStatus: membershipStatusFromSubscription(subscription.status)
    };
  }

  if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;

    return {
      stripeCustomerId: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id,
      stripeSubscriptionId:
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : invoice.parent?.subscription_details?.subscription?.id,
      membershipStatus: event.type === "invoice.payment_succeeded" ? "active" : "past_due"
    };
  }

  return null;
}
