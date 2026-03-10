# @measured/calibrate-config

Shared quality/tooling config package for Calibrate.

Current scope: Browserslist baseline + Vite/esbuild target helper.

## Browserslist query

This package exports the shared query list:

```ts
import browserslist from "@measured/calibrate-config/browserslist";
```

Use the query directly in tools that accept query arrays (for example Autoprefixer `overrideBrowserslist`).

For plain `package.json` `browserslist` fields, use the equivalent query:

```json
{
  "browserslist": [
    "baseline widely available"
  ]
}
```

## Vite/esbuild target

```ts
import target from "@measured/calibrate-config/browserslist/esbuild";
```
