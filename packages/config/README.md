# @measured/calibrate-config

Shared developer-tooling config for Calibrate. ESLint, Stylelint, Prettier, browserslist presets plus editor IntelliSense lookup — install once, plug in via subpath imports.

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

Drop-in shareable config — extends `stylelint-config-standard` and layers on Calibrate's CSS authoring discipline: alphabetical property ordering (`stylelint-order`), token-discipline rules (no raw colors, no absolute lengths, no raw time, no `!important`), and logical-CSS enforcement (`stylelint-plugin-logical-css`) so component CSS stays portable across writing modes.

```js
// .stylelintrc.mjs
export default {
  extends: ["@measured/calibrate-config/stylelint"],
};
```

Or as JSON:

```json
{
  "extends": ["@measured/calibrate-config/stylelint"]
}
```

Add your own overrides alongside as you'd expect from any Stylelint config:

```js
export default {
  extends: ["@measured/calibrate-config/stylelint"],
  rules: {
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
