import js from "@eslint/js";
import json from "@eslint/json";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    files: ["**/*.json"],
    ...json.configs.recommended,
    language: "json/json",
  },
  {
    files: ["**/*.mjs", "**/*.ts", "**/*.tsx"],
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.mjs"],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.node } },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      globals: { ...globals.node },
    },
  })),
];

export default eslintConfig;
