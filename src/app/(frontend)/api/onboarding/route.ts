import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { onboardingSchema, parseJson, readRequestBody } from "@/lib/api";
import { getMemberByClerkUserId, isClerkConfigured } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";
import { toPayloadArray } from "@/lib/payload/format";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(onboardingSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    if (!isClerkConfigured()) {
      return NextResponse.json(
        { error: "Clerk is required for onboarding.", next: "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY." },
        { status: 503 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect("/sign-in?redirect_url=/onboarding", 303);
    }

    const payload = await getPayloadClient();
    const memberRecord = await getMemberByClerkUserId(userId);

    if (!memberRecord) {
      return NextResponse.json(
        {
          error: "Membership record not found.",
          next: "Join and complete Stripe Checkout before onboarding.",
          redirectTo: "/join"
        },
        { status: 409 }
      );
    }

    const member = await payload.update({
      collection: "members",
      id: memberRecord.id,
      data: {
        name: parsed.data.name,
        bio: parsed.data.bio,
        location: parsed.data.location,
        interests: toPayloadArray(parsed.data.interests),
        onboardingComplete: true
      },
      overrideAccess: true
    });

    return NextResponse.json(
      {
        status: "updated",
        memberId: member.id,
        onboardingComplete: true,
        redirectTo: "/app"
      },
      { status: 200 }
    );
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
