# @measured/calibrate-config

## 0.2.0-alpha.5

## 0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 2ba877c: Add `@measured/calibrate-config/eslint` and `@measured/calibrate-config/stylelint` subpath presets.

  The ESLint preset is a focused flat-config block that adds Calibrate's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

  The Stylelint preset extends `stylelint-config-standard` and adds alphabetical property ordering via `stylelint-order`. Import the default export from `.stylelintrc.mjs`.

  `eslint` and `stylelint` are now `peerDependencies` of this package — install them alongside.

- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/calibrate-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/calibrate-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--clbr-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--clbr-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--clbr-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.

## 0.2.0-alpha.2

## 0.1.1-alpha.1

## 0.1.1-alpha.0
