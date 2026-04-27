---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to `@measured/calibrate-config/stylelint`:

- **Color**: ban raw color values repo-wide via `color-no-hex`, `color-named: never`, and `function-disallowed-list` for `rgb`/`hsl`/`hwb`/`lab`/`lch`/`oklab`/`oklch`/`color`/`color-mix`. System colors used in forced-colors blocks (`ButtonText`, `GrayText`, etc.) pass cleanly. Catches violations in shorthand contexts (`background`, `border`, `outline`) too.
- **Length / time**: disallow absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) repo-wide. `rem` and `rlh` stay allowed as a tokenization escape hatch and the right unit for `@container` breakpoints. Everything else (`em`, `ch`, `lh`, `%`, viewport units, container-query units, future units) is allowed by default.
- **No `!important`**: zero usages today; preventing the most common escape hatch from cascade design.

A new `--clbr-motion-duration-0` token (primitive + semantic) lands alongside the rule additions so that explicit zero-duration legs in `transition` shorthands have a token reference instead of needing a typed-zero `0s` literal.

Core CSS dogfooded alongside: token negations refactored to `calc(-1 * var(...))`, sr-only / sidebar backdrop hex / root tap-highlight `color-mix` / spinner `transform-origin` get inline disables (with TODOs where a future system token is the right answer), sidebar transitions adopt the new `--clbr-motion-duration-0` token in place of `0s` literals, `48rem` breakpoints normalize to `48em`, and demo-style `.example-content*` blocks move out of core and into `apps/storybook/.storybook/examples.css`.
