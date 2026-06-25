import { NextResponse } from "next/server";
import { parseJson, postSchema, readRequestBody } from "@/lib/api";
import { requireApiMember } from "@/lib/member-access";
import { PayloadNotConfiguredError, getPayloadClient } from "@/lib/payload/client";
import { plainTextToLexical } from "@/lib/payload/format";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(postSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  const memberResult = await requireApiMember({ active: true, onboarded: true });

  if ("error" in memberResult) {
    return memberResult.error;
  }

  try {
    const payload = await getPayloadClient();
    const space = await payload.find({
      collection: "spaces",
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: parsed.data.space
        }
      }
    });

    const spaceRecord = space.docs[0];

    if (!spaceRecord) {
      return NextResponse.json({ error: "Space not found." }, { status: 404 });
    }

    const post = await payload.create({
      collection: "posts",
      data: {
        title: parsed.data.title,
        body: plainTextToLexical(parsed.data.body),
        author: memberResult.member.id,
        space: spaceRecord.id,
        status: "published",
        featured: false,
        pinned: false,
        commentsLocked: false
      },
      overrideAccess: true
    });

    return NextResponse.json(
      {
        status: "created",
        postId: post.id,
        imageUploadStatus: parsed.data.images?.length ? "media-upload-endpoint-required" : "none"
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
