import Stripe from "stripe";
import { membershipPlans } from "@/lib/data";
import { getAppUrl } from "@/lib/utils";

export const stripeApiVersion = "2026-05-27.dahlia";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required for Stripe server routes.");
  }

  return new Stripe(secretKey, {
    apiVersion: stripeApiVersion
  });
}

export function getPriceId(planId: string) {
  const plan = membershipPlans.find((item) => item.id === planId);

  if (!plan) {
    throw new Error("Unknown membership plan.");
  }

  const priceId = process.env[plan.stripeEnv];

  if (!priceId) {
    throw new Error(`${plan.stripeEnv} is required for the ${plan.name} plan.`);
  }

  return priceId;
}

export function getCheckoutUrls() {
  const appUrl = getAppUrl();

  return {
    success_url: `${appUrl}/onboarding?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/join?checkout=cancelled`
  };
}

export type MembershipStatus = "pending" | "active" | "past_due" | "cancelled" | "expired" | "banned";

export function membershipStatusFromSubscription(status: Stripe.Subscription.Status): MembershipStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "incomplete_expired":
      return "expired";
    default:
      return "pending";
  }
}
