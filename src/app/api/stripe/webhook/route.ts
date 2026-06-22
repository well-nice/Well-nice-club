import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getMemberByClerkUserId, getMemberByStripeIds } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";
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
    try {
      const member = await upsertMembershipFromStripe(membershipUpdate);
      return NextResponse.json({ received: true, memberId: member?.id ?? null, membershipUpdate });
    } catch (error) {
      if (error instanceof PayloadNotConfiguredError) {
        return NextResponse.json(
          { error: "Payload is not configured.", next: "Set DATABASE_URL and PAYLOAD_SECRET." },
          { status: 503 }
        );
      }

      throw error;
    }
  }

  return NextResponse.json({ received: true });
}

type MembershipUpdate = NonNullable<ReturnType<typeof deriveMembershipUpdate>>;

async function upsertMembershipFromStripe(update: MembershipUpdate) {
  const payload = await getPayloadClient();
  const existing = update.clerkUserId
    ? await getMemberByClerkUserId(update.clerkUserId)
    : await getMemberByStripeIds({
        stripeCustomerId: update.stripeCustomerId,
        stripeSubscriptionId: update.stripeSubscriptionId
      });

  if (existing) {
    return payload.update({
      collection: "members",
      id: existing.id,
      data: {
        stripeCustomerId: update.stripeCustomerId,
        stripeSubscriptionId: update.stripeSubscriptionId,
        plan: update.plan,
        membershipStatus: update.membershipStatus
      },
      overrideAccess: true
    });
  }

  if (!update.clerkUserId) {
    return null;
  }

  return payload.create({
    collection: "members",
    data: {
      clerkUserId: update.clerkUserId,
      email: update.email || `${update.clerkUserId}@wellnice.local`,
      name: update.name || "Well Nice Member",
      stripeCustomerId: update.stripeCustomerId,
      stripeSubscriptionId: update.stripeSubscriptionId,
      plan: update.plan,
      membershipStatus: update.membershipStatus,
      role: "member",
      directoryVisible: false,
      onboardingComplete: false,
      banned: false
    },
    overrideAccess: true
  });
}

function deriveMembershipUpdate(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    return {
      clerkUserId: session.metadata?.clerkUserId || session.client_reference_id,
      email: session.customer_details?.email || undefined,
      name: session.customer_details?.name || undefined,
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
