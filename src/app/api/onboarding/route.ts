import { acceptedResponse, onboardingSchema, parseJson, readRequestBody } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readRequestBody(request);
  const parsed = parseJson(onboardingSchema, body);

  if (!parsed.ok) {
    return parsed.response;
  }

  return acceptedResponse("onboarding", {
    onboardingComplete: true,
    redirectTo: "/app",
    next: "Update Payload Member profile and create optional introduction post."
  });
}
