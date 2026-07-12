import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/liability-body-injury-workspace/",
  resolve: {
    alias: {
      "#case-data": fileURLToPath(
        new URL(
          process.env.VITE_PUBLIC_DEMO === "1"
            ? "./src/data/publicCaseData.js"
            : "./src/data/caseData.js",
          import.meta.url
        )
      ),
    },
  },
});
