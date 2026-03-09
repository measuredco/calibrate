# Browserslist Baseline (`@calibrate/browserslist-config`)

Shared browser support baseline for Calibrate workspace tooling.

## Browserslist

Use in `package.json`:

```json
{
  "browserslist": ["extends @calibrate/browserslist-config"]
}
```

## Vite/esbuild target

```ts
import target from "@calibrate/browserslist-config/esbuild";
```
