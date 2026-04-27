---
"@measured/calibrate-config": minor
---

Add `@measured/calibrate-config/eslint` and `@measured/calibrate-config/stylelint` subpath presets.

The ESLint preset is a focused flat-config block that adds Calibrate's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

The Stylelint preset extends `stylelint-config-standard` and adds alphabetical property ordering via `stylelint-order`. Import the default export from `.stylelintrc.mjs`.

`eslint` and `stylelint` are now `peerDependencies` of this package — install them alongside.
