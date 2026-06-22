import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { collections } from "@/lib/payload/collections";

export default buildConfig({
  admin: {
    user: "members",
    meta: {
      titleSuffix: " - Well Nice Club"
    }
  },
  collections,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "postgres://wellnice:wellnice@localhost:5432/wellnice"
    }
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "development-only-payload-secret",
  typescript: {
    outputFile: "src/payload-types.ts"
  }
});
