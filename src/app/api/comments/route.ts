import { acceptedResponse, commentSchema, parseJson, readRequestBody } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(commentSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  return acceptedResponse("comment", {
    status: "visible",
    nesting: Boolean(parsed.data.parentCommentId),
    next: "Persist nested comment and attach it to the parent post."
  });
}
