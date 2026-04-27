---
"@measured/calibrate-config": minor
---

Add `@measured/calibrate-config/eslint` and `@measured/calibrate-config/stylelint` subpath presets.

The ESLint preset is a flat-config array covering `.mjs`/`.ts`/`.tsx` with alphabetical import/export sort (`simple-import-sort`), TypeScript recommended, and `js.configs.recommended` for `.mjs`. JSON files are linted via `@eslint/json`. Spread the array into your local config and add overrides as needed.

The Stylelint preset extends `stylelint-config-standard` and adds alphabetical property ordering via `stylelint-order`. Import the default export from `.stylelintrc.mjs`.

`eslint` and `stylelint` are now `peerDependencies` of this package — install them alongside.
