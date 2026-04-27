---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add token-discipline rules to `@measured/calibrate-config/stylelint`.

Two cooperating rules surface raw-value violations that should reference design tokens:

- `declaration-property-value-allowed-list` for color properties (`color`, `background-color`, `border-*-color`, `outline-color`, `fill`, `stroke`, etc.). Allows `var(--clbr-*)` token references, the standard CSS keyword set (`transparent`, `currentcolor`, `inherit`, etc.), and the full CSS Color Module Level 4 system color palette (`ButtonText`, `GrayText`, `Highlight`, etc.) for forced-colors mode. Errors on raw hex / `rgb()` / `hsl()` / named colors.
- `unit-disallowed-list` applied repo-wide. Disallows absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) — these don't scale with user font-size preference and bypass the design system's spacing scale entirely. Applied globally (not per-property): there's no property where a raw absolute length is the right answer; properties that don't take lengths (color, content, etc.) are unaffected because the rule scans unit suffixes on numeric literals. Everything else is allowed: typography-relative (`em`, `ch`, `lh`), `%`, viewport-relative (`vw`/`vh`/`vi`/`vb` plus the `s*`/`l*`/`d*` variants), container-query units, and root-relative `rem` / `rlh`. `rem` is intentionally allowed as a tokenization escape hatch for ad-hoc dimensions the system doesn't tokenize, and as the right unit for container query breakpoints (em in `@container` is relative to the container's font-size, which is unpredictable; rem stays anchored to root). Reach for tokens first; rem is the documented out. `var()` and `calc()` pass through; unitless `0` is always allowed.

Composite-value properties (`transition`, `box-shadow`, `background`/`border`/`outline` shorthand, etc.) are intentionally excluded — `allowed-list` is regex against the full value string and becomes unwieldy on multi-part values. Revisit with a custom rule once a clean shape emerges.

Core CSS dogfooding alongside this change:

- 8 token-negation sites refactored from `calc(0rem - var(--clbr-…))` to `calc(-1 * var(--clbr-…))` — the latter is spec-correct (number × length is valid; number − length is not), works in every browser, and is cleaner CSS independent of any lint rule.
- 5 visually-hidden / sr-only blocks (`block-size: 1px` / `inline-size: 1px` / `margin: -1px`) get inline disable/enable pairs explaining the canonical accessibility hack pattern.
- 8 `@media (width < 48rem)` / `(width >= 48rem)` breakpoints normalize to `48em` — the codebase already used `em` in most `@media` queries; rem variants were just inconsistent.
- Sidebar backdrop `#00000092` gets an inline disable with a TODO pointing at a future overlay/scrim token.
- 1 spinner `transform-origin: 272px` gets an inline disable — it's an SVG coordinate-space value intrinsic to the viewBox geometry, not a design-system dimension.
- 2 demo-style placeholder blocks (`.example-content*` in root.css and `.example-content-grid` in grid.css) move out of core and into `apps/storybook/.storybook/examples.css` — they were intended for stories from the start, not for production consumers, and used raw hot-pink hex values that aren't part of the design language.
