---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to `@measured/calibrate-config/stylelint`:

- Color properties (`color`, `background-color`, `border-*-color`, `outline-color`, `fill`, `stroke`, etc.) must use a `var(--clbr-*)` token, a standard CSS keyword, or a CSS Color Module Level 4 system color (for forced-colors mode). Errors on raw hex / `rgb()` / `hsl()` / named colors.
- Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) are disallowed repo-wide. `rem` and `rlh` stay allowed as a tokenization escape hatch and the right unit for `@container` breakpoints. Everything else (`em`, `ch`, `lh`, `%`, viewport units, container-query units, future units) is allowed by default.

Composite-value properties (`transition`, `box-shadow`, shorthand `background`/`border`/`outline`) are excluded — defer to a custom rule.

Core CSS dogfooded alongside: token negations refactored to `calc(-1 * var(...))`, sr-only / sidebar backdrop / spinner `transform-origin` get inline disables, `48rem` breakpoints normalize to `48em`, and demo-style `.example-content*` blocks move out of core and into `apps/storybook/.storybook/examples.css`.
