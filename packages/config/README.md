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

`stylelint` itself is a peer dependency — install it alongside.

### Authoring stance

This preset is opinionated. It encodes Calibrate's compose-first / custom-with-tokens authoring discipline rather than a generic Stylelint baseline. Two defaults are worth highlighting because they often surface in consumer projects:

- **Same-file custom-property scope.** The `calibrate/clbr-known-tokens` rule rejects `var(--*)` references that aren't defined in the same file — including consumers' own organisation across CSS files (`theme.css` defining vars, `card.css` consuming them). Define within the file you use it in. Catalog tokens (`--clbr-*` from the catalog) and same-file definitions both pass; everything else fails.
- **Tight value lists.** `border-radius`, `border-width`, `box-shadow`, `font`, `font-weight`, `line-height`, `opacity`, and the timing-function properties only accept `var()`, function calls (`calc()`, `cubic-bezier()`, etc.), `0`/`1`/keywords, and percentages.

If your project organises tokens across files and you want catalog enforcement without same-file scope, opt out:

```js
export default {
  extends: ["@measured/calibrate-config/stylelint"],
  rules: {
    "calibrate/clbr-known-tokens": [true, { allowCrossFile: true }],
  },
};
```

Catalog enforcement for `--clbr-*` references is preserved; non-`--clbr-` customs pass through. Any individual rule can be turned off the usual way (`"rule-name": null`) — overrides are normal.

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
