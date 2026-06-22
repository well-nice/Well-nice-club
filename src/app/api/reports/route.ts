import { acceptedResponse, parseJson, readRequestBody, reportSchema } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(reportSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  return acceptedResponse("report", {
    reportStatus: "new",
    next: "Persist to Payload Reports for moderator review."
  });
}
