# @measured/calibrate-config

Shared developer-tooling config for Calibrate. ESLint, Stylelint, Prettier, browserslist presets plus the `--clbr-*` token catalog for editor autocomplete and tooling — install once, plug in via subpath imports.

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

## Token catalog

`@measured/calibrate-config/clbr.catalog.css` is a `:root` block listing every published `--clbr-*` token with its resolved value and `$description`. Used two ways:

- **Editor autocomplete.** For VS Code, drop a copy or symlink into your project's `.vscode/` directory — VS Code's CSS workspace scan picks up the declarations and surfaces typeahead and value hover for every `var(--clbr-*)` when authoring CSS. Other editors with custom-CSS-data support can consume the same file via their own configuration.

  ```sh
  cp node_modules/@measured/calibrate-config/clbr.catalog.css .vscode/
  ```

- **Stylelint validation.** The Stylelint preset's `calibrate/clbr-known-tokens` rule reads the catalog automatically to validate `var(--clbr-*)` references. No setup required beyond extending the preset.

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
