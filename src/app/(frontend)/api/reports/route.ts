import { NextResponse } from "next/server";
import { parseJson, readRequestBody, reportSchema } from "@/lib/api";
import { requireApiMember } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(reportSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  const memberResult = await requireApiMember({ active: true, onboarded: true });

  if ("error" in memberResult) {
    return memberResult.error;
  }

  try {
    const payload = await getPayloadClient();
    const report = await payload.create({
      collection: "reports",
      data: {
        reporter: memberResult.member.id,
        contentType: parsed.data.contentType,
        contentId: parsed.data.contentId,
        reason: parsed.data.reason,
        status: "new"
      },
      overrideAccess: true
    });

    return NextResponse.json({ status: "created", reportId: report.id, reportStatus: "new" }, { status: 201 });
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
