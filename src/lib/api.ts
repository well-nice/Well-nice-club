import { NextResponse } from "next/server";
import { z } from "zod";

const stringArray = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return value;
}, z.array(z.string()).min(1));

export const waitlistSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  location: z.string().min(2),
  instagram: z.string().optional(),
  interests: stringArray,
  reason: z.string().min(10)
});

export const onboardingSchema = z.object({
  name: z.string().min(2),
  bio: z.string().min(10),
  location: z.string().min(2),
  interests: stringArray,
  firstPost: z.string().optional()
});

export const postSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  space: z.string().min(2),
  images: z.array(z.string().url()).optional()
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(2),
  parentCommentId: z.string().optional()
});

export const reportSchema = z.object({
  contentType: z.enum(["post", "comment", "recommendation", "member"]),
  contentId: z.string().min(1),
  reason: z.string().min(5)
});

export const conciergeSchema = z.object({
  request: z.string().min(10),
  category: z.string().optional(),
  location: z.string().optional(),
  budget: z.string().optional()
});

export function parseJson<T>(schema: z.Schema<T>, value: unknown) {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten()
        },
        { status: 400 }
      )
    };
  }

  return { ok: true as const, data: parsed.data };
}

export async function readRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  const body: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  formData.forEach((value, key) => {
    if (key in body) {
      const existing = body[key];
      body[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      return;
    }

    body[key] = value;
  });

  return body;
}

export function acceptedResponse(resource: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    {
      status: "accepted",
      resource,
      ...extra
    },
    { status: 202 }
  );
}
