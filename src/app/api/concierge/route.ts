import { NextResponse } from "next/server";
import { conciergeSchema, parseJson, readRequestBody } from "@/lib/api";
import { requireApiMember } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(conciergeSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);

  const memberResult = await requireApiMember({ active: true, onboarded: true });

  if ("error" in memberResult) {
    return memberResult.error;
  }

  try {
    const payload = await getPayloadClient();
    const conciergeRequest = await payload.create({
      collection: "concierge-requests",
      data: {
        member: memberResult.member.id,
        request: parsed.data.request,
        category: parsed.data.category,
        location: parsed.data.location,
        budget: parsed.data.budget,
        status: hasOpenAi ? "needs_review" : "new",
        aiDraftResponse: hasOpenAi ? "Queued for AI draft generation." : undefined,
        reviewStatus: hasOpenAi ? "in_review" : "not_started",
        publishedToLibrary: false
      },
      overrideAccess: true
    });

    return NextResponse.json(
      {
        status: "created",
        conciergeRequestId: conciergeRequest.id,
        conciergeStatus: hasOpenAi ? "needs_review" : "new",
        aiDraftResponse: hasOpenAi ? "queued" : "not_configured"
      },
      { status: 201 }
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
