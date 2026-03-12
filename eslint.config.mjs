import js from "@eslint/js";
import json from "@eslint/json";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

const nodeGlobalsOff = Object.fromEntries(
  Object.keys(globals.node).map((name) => [name, "off"]),
);

export default [
  {
    ignores: [
      "node_modules/**",
      "**/build/**",
      "**/dist/**",
      "**/storybook-static/**",
      "packages/system/schemas/**",
    ],
  },
  {
    files: ["**/*.json"],
    ...json.configs.recommended,
    language: "json/json",
  },
  {
    files: ["**/*.mjs"],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.node } },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      globals: { ...globals.node },
    },
  })),
  {
    files: ["packages/core/src/**/*.ts"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  },
  ...storybook.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.stories.ts"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  })),
];
