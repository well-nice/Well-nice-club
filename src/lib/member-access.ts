import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { Where } from "payload";
import { PayloadNotConfiguredError, getPayloadClient, isPayloadConfigured } from "@/lib/payload/client";

type PayloadRecord = Record<string, unknown> & { id: string | number };

export type MemberAccessState =
  | { status: "preview"; reason: string }
  | { status: "ready"; member: PayloadRecord }
  | { status: "redirect"; href: string };

export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export async function getAuthenticatedUserId() {
  if (!isClerkConfigured()) {
    return "local-preview-user";
  }

  const { userId } = await auth();
  return userId;
}

export async function getMemberByClerkUserId(clerkUserId: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "members",
    limit: 1,
    overrideAccess: true,
    where: {
      clerkUserId: {
        equals: clerkUserId
      }
    }
  });

  return (result.docs[0] as PayloadRecord | undefined) ?? null;
}

export async function getMemberByStripeIds(args: { stripeCustomerId?: string | null; stripeSubscriptionId?: string | null }) {
  const payload = await getPayloadClient();
  const or: Where[] = [];

  if (args.stripeCustomerId) {
    or.push({
      stripeCustomerId: {
        equals: args.stripeCustomerId
      }
    });
  }

  if (args.stripeSubscriptionId) {
    or.push({
      stripeSubscriptionId: {
        equals: args.stripeSubscriptionId
      }
    });
  }

  if (or.length === 0) {
    return null;
  }

  const result = await payload.find({
    collection: "members",
    limit: 1,
    overrideAccess: true,
    where: {
      or
    }
  });

  return (result.docs[0] as PayloadRecord | undefined) ?? null;
}

export async function ensureMemberForCurrentUser(profile?: { name?: string; location?: string; bio?: string }) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  const payload = await getPayloadClient();
  const existing = await getMemberByClerkUserId(userId);

  if (existing) {
    return { member: existing };
  }

  const user = isClerkConfigured() ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress;
  const name = profile?.name || user?.fullName || user?.firstName || "Well Nice Member";

  const member = await payload.create({
    collection: "members",
    data: {
      clerkUserId: userId,
      email: email || `${userId}@wellnice.local`,
      name,
      location: profile?.location,
      bio: profile?.bio,
      membershipStatus: "pending",
      role: "member",
      directoryVisible: false,
      onboardingComplete: false,
      banned: false
    },
    overrideAccess: true
  });

  return { member: member as PayloadRecord };
}

export async function requireApiMember(options: { active?: boolean; onboarded?: boolean } = {}) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
    }

    const member = await getMemberByClerkUserId(userId);

    if (!member) {
      return { error: NextResponse.json({ error: "Member record not found." }, { status: 403 }) };
    }

    const blockedReason = getMemberBlockReason(member, options);

    if (blockedReason) {
      return { error: NextResponse.json({ error: blockedReason }, { status: 403 }) };
    }

    return { member };
  } catch (error) {
    if (error instanceof PayloadNotConfiguredError) {
      return {
        error: NextResponse.json(
          { error: "Payload is not configured.", next: "Set DATABASE_URL and PAYLOAD_SECRET." },
          { status: 503 }
        )
      };
    }

    throw error;
  }
}

export async function getAppAccessState(): Promise<MemberAccessState> {
  if (!isClerkConfigured()) {
    return { status: "preview", reason: "Clerk is not configured, so the app is running in local preview mode." };
  }

  if (!isPayloadConfigured()) {
    return { status: "preview", reason: "Payload is not configured, so membership records cannot be checked yet." };
  }

  const { userId } = await auth();

  if (!userId) {
    return { status: "redirect", href: "/sign-in?redirect_url=/app" };
  }

  const member = await getMemberByClerkUserId(userId);

  if (!member) {
    return { status: "redirect", href: "/join?access=missing-member" };
  }

  const blockedReason = getMemberBlockReason(member, { active: true, onboarded: true });

  if (blockedReason === "Onboarding is required.") {
    return { status: "redirect", href: "/onboarding" };
  }

  if (blockedReason) {
    return { status: "redirect", href: `/join?access=${encodeURIComponent(blockedReason)}` };
  }

  return { status: "ready", member };
}

export function enforceAppAccess(state: MemberAccessState) {
  if (state.status === "redirect") {
    redirect(state.href);
  }
}

function getMemberBlockReason(member: PayloadRecord, options: { active?: boolean; onboarded?: boolean }) {
  if (member.banned === true || member.membershipStatus === "banned") {
    return "Member is banned.";
  }

  if (options.active && member.membershipStatus !== "active") {
    return "Active membership is required.";
  }

  if (options.onboarded && member.onboardingComplete !== true) {
    return "Onboarding is required.";
  }

  return null;
}
