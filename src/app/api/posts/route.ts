import { acceptedResponse, parseJson, postSchema, readRequestBody } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(postSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  return acceptedResponse("post", {
    status: "published",
    moderation: "visible",
    next: "Persist to Payload Posts with author, space, images, likes, savedBy, and moderation fields."
  });
}
