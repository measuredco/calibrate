import target from "@measured/calibrate-browserslist/esbuild";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target,
    lib: {
      cssFileName: "components",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
