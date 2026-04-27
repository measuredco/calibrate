---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to `@measured/calibrate-config/stylelint`:

- **Color**: ban raw color values repo-wide via `color-no-hex`, `color-named: never`, and `function-disallowed-list` for `rgb`/`hsl`/`hwb`/`lab`/`lch`/`oklab`/`oklch`/`color`/`color-mix`. System colors used in forced-colors blocks (`ButtonText`, `GrayText`, etc.) pass cleanly. Catches violations in shorthand contexts (`background`, `border`, `outline`) too.
- **Units**: disallow absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) repo-wide. `rem` and `rlh` stay allowed as a tokenization escape hatch and the right unit for `@container` breakpoints. Everything else (`em`, `ch`, `lh`, `%`, viewport units, container-query units, future units) is allowed by default.

Core CSS dogfooded alongside: token negations refactored to `calc(-1 * var(...))`, sr-only / sidebar backdrop hex / root tap-highlight `color-mix` / spinner `transform-origin` get inline disables (with TODOs where a future system token is the right answer), `48rem` breakpoints normalize to `48em`, and demo-style `.example-content*` blocks move out of core and into `apps/storybook/.storybook/examples.css`.
