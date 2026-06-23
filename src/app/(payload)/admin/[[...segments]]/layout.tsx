import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import configPromise from "../../../../../payload.config";
import { importMap } from "../importMap.js";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap
  });
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
