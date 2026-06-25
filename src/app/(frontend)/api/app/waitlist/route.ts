import { NextResponse } from "next/server";
import { parseJson, readRequestBody, waitlistSchema } from "@/lib/api";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";
import { toPayloadArray } from "@/lib/payload/format";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(waitlistSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const payload = await getPayloadClient();
    const application = await payload.create({
      collection: "waitlist",
      data: {
        ...parsed.data,
        interests: toPayloadArray(parsed.data.interests),
        status: "new"
      },
      overrideAccess: true
    });

    return NextResponse.json({ status: "created", waitlistId: application.id }, { status: 201 });
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
