import { getPayload, type Payload } from "payload";
import configPromise from "../../../payload.config";

let cachedPayload: Promise<Payload> | null = null;

export class PayloadNotConfiguredError extends Error {
  constructor() {
    super("Payload is not configured. Set DATABASE_URL and PAYLOAD_SECRET.");
    this.name = "PayloadNotConfiguredError";
  }
}

export function isPayloadConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.PAYLOAD_SECRET);
}

export async function getPayloadClient() {
  if (!isPayloadConfigured()) {
    throw new PayloadNotConfiguredError();
  }

  cachedPayload ??= getPayload({ config: configPromise });

  return cachedPayload;
}
