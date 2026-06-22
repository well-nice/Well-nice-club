import { NextResponse } from "next/server";
import { commentSchema, parseJson, readRequestBody } from "@/lib/api";
import { requireApiMember } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(commentSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  const memberResult = await requireApiMember({ active: true, onboarded: true });

  if ("error" in memberResult) {
    return memberResult.error;
  }

  try {
    const payload = await getPayloadClient();
    const comment = await payload.create({
      collection: "comments",
      data: {
        body: parsed.data.body,
        author: memberResult.member.id,
        post: parsed.data.postId,
        parent: parsed.data.parentCommentId,
        status: "visible"
      },
      overrideAccess: true
    });

    return NextResponse.json(
      {
        status: "created",
        commentId: comment.id,
        nesting: Boolean(parsed.data.parentCommentId)
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
