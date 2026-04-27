import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = [
  {
    files: ["**/*.mjs", "**/*.ts", "**/*.tsx"],
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];

export default eslintConfig;
