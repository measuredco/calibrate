import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "**/build/**",
      "tokens/dist/**",
      "tokens/schemas/**",
    ],
  },
  {
    files: ["**/*.mjs"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.json"],
    ...json.configs.recommended,
    language: "json/json",
  },
];
