import { acceptedResponse, parseJson, readRequestBody, waitlistSchema } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(waitlistSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  return acceptedResponse("waitlist", {
    statusForPayload: "new",
    next: "Persist to Payload Waitlist and notify admins for approval."
  });
}
