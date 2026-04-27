---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to the Stylelint preset (`@measured/calibrate-config/stylelint`):

- Raw color values are disallowed. Use a `var(--clbr-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
- Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
- `!important` is disallowed.

Two new tokens land alongside the rule additions:

- `--clbr-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
- `--clbr-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.
