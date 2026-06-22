import { NextResponse } from "next/server";
import { onboardingSchema, parseJson, readRequestBody } from "@/lib/api";
import { ensureMemberForCurrentUser } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";
import { toPayloadArray } from "@/lib/payload/format";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(onboardingSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const payload = await getPayloadClient();
    const result = await ensureMemberForCurrentUser(parsed.data);

    if ("error" in result) {
      return result.error;
    }

    const member = await payload.update({
      collection: "members",
      id: result.member.id,
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
