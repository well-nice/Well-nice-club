import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { collections } from "./src/lib/payload/collections.ts";

export default buildConfig({
  admin: {
    components: {
      views: {
        dashboard: {
          Component: {
            path: "/src/components/payload/well-nice-dashboard.tsx"
          }
        }
      }
    },
    dateFormat: "dd MMM yyyy",
    user: "admins",
    meta: {
      titleSuffix: " - Well Nice Club"
    }
  },
  collections,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "postgres://wellnice:wellnice@localhost:5432/wellnice"
    },
    push: process.env.PAYLOAD_DB_PUSH === "true"
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "development-only-payload-secret",
  typescript: {
    outputFile: "src/payload-types.ts"
  }
});
