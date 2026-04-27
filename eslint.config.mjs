import calibrateEslint from "@measured/calibrate-config/eslint";
import storybook from "eslint-plugin-storybook";
import globals from "globals";

const nodeGlobalsOff = Object.fromEntries(
  Object.keys(globals.node).map((name) => [name, "off"]),
);

export default [
  ...calibrateEslint,
  {
    ignores: [
      "**/build/**",
      "**/dist/**",
      "**/storybook-static/**",
      "packages/system/schemas/**",
    ],
  },
  {
    files: ["packages/core/src/**/*.ts", "packages/react/src/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  },
  ...storybook.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.stories.ts"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  })),
];
