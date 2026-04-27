# @measured/calibrate-config

Shared quality/tooling config for Calibrate. Subpath presets for ESLint, Stylelint, and Browserslist/esbuild — install once, plug in via subpath imports.

## ESLint

Flat-config preset that adds Calibrate's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

```js
// eslint.config.mjs
import calibrateEslint from "@measured/calibrate-config/eslint";

export default [
  // your TypeScript / JSON / JS configs here
  ...calibrateEslint,
  // your local rules / overrides
];
```

`eslint` itself is a peer dependency — install it alongside.

## Stylelint

Stylelint config — alphabetical property order via `stylelint-order`, `stylelint-config-standard` baseline.

```js
// .stylelintrc.mjs
import calibrateStylelint from "@measured/calibrate-config/stylelint";

export default calibrateStylelint;
```

Or extend it and override per project:

```js
import calibrateStylelint from "@measured/calibrate-config/stylelint";

export default {
  ...calibrateStylelint,
  rules: {
    ...calibrateStylelint.rules,
    // your overrides
  },
};
```

`stylelint` itself is a peer dependency — install it alongside.

## Browserslist query

```ts
import browserslist from "@measured/calibrate-config/browserslist";
```

Use the query directly in tools that accept query arrays (for example Autoprefixer `overrideBrowserslist`).

For plain `package.json` `browserslist` fields, use the equivalent query:

```json
{
  "browserslist": ["baseline widely available"]
}
```

## Vite/esbuild target

```ts
import target from "@measured/calibrate-config/browserslist/esbuild";
```
