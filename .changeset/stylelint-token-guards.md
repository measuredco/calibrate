---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to `@measured/calibrate-config/stylelint`.

Two cooperating rules surface raw-value violations that should reference design tokens:

- `declaration-property-value-allowed-list` for color properties (`color`, `background-color`, `border-*-color`, `outline-color`, `fill`, `stroke`, etc.). Allows `var(--clbr-*)` token references, the standard CSS keyword set (`transparent`, `currentcolor`, `inherit`, etc.), and the full CSS Color Module Level 4 system color palette (`ButtonText`, `GrayText`, `Highlight`, etc.) for forced-colors mode. Errors on raw hex / `rgb()` / `hsl()` / named colors.
- `declaration-property-unit-allowed-list` for spacing/sizing/font-size properties (`padding*`, `margin*`, `gap`, `font-size`, `line-height`, `border-radius*`). Allows `em`, `ch`, `lh`, `%` for typography-relative authoring; errors on raw `px`, `rem`, `pt`, `vw`, `vh`, etc. `var()` and `calc()` pass through (no raw unit at this layer); unitless `0` is always allowed.

Composite-value properties (`transition`, `box-shadow`, `border` shorthand, etc.) are intentionally excluded — `allowed-list` is regex against the full value string and becomes unwieldy on multi-part values. Revisit with a custom rule once a clean shape emerges.

Core CSS dogfooding alongside this change:

- 8 token-negation sites refactored from `calc(0rem - var(--clbr-…))` to `calc(-1 * var(--clbr-…))` — the latter is spec-correct (number × length is valid; number − length is not), works in every browser, and passes the new rule.
- 5 visually-hidden / sr-only `margin: -1px` sites get inline disables explaining the canonical accessibility hack pattern.
- Sidebar backdrop `#00000092` and 2 expander icon-rounding `calc(0.5rem / 16)` sites get inline disables with TODOs pointing at future system tokens (overlay/scrim color and small-rounding precision).
