# @measured/calibrate-browserslist

Shared browser support baseline for Calibrate packages and downstream consumers.

## Browserslist

Use in `package.json`:

```json
{
  "browserslist": [
    "extends @measured/calibrate-browserslist/browserslist-config"
  ]
}
```

## Vite/esbuild target

```ts
import target from "@measured/calibrate-browserslist/esbuild";
```
