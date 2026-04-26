import target from "@measured/calibrate-config/browserslist/esbuild";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "@measured/calibrate-core",
      ],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
