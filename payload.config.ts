import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { collections } from "./src/lib/payload/collections.ts";

const databaseURL = process.env.DATABASE_URL;
const payloadSecret = process.env.PAYLOAD_SECRET;

if (!databaseURL) {
  throw new Error("DATABASE_URL is required for Payload.");
}

if (!payloadSecret) {
  throw new Error("PAYLOAD_SECRET is required for Payload.");
}

export default buildConfig({
  admin: {
    dateFormat: "dd MMM yyyy",
    user: "admins",
    meta: {
      titleSuffix: " - Well Nice Club"
    }
  },
  collections,
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL
    },
    push: process.env.PAYLOAD_DB_PUSH === "true"
  }),
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: "src/payload-types.ts"
  }
});
