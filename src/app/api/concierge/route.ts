import { acceptedResponse, conciergeSchema, parseJson, readRequestBody } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(conciergeSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);

  return acceptedResponse("concierge-request", {
    conciergeStatus: hasOpenAi ? "needs_review" : "new",
    aiDraftResponse: hasOpenAi ? "queued" : "not_configured",
    next: "Generate an AI draft, route to admin review, then publish approved answers to the recommendation library."
  });
}
