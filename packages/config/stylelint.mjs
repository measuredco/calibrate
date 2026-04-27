import { createRequire } from "node:module";

// Stylelint resolves `extends`/`plugins` strings from the consumer's config
// directory, not from the package that declared them. Resolve to absolute
// paths here so consumers don't need to install our internals themselves.
const require = createRequire(import.meta.url);

// -----------------------------------------------------------------------------
// Two cooperating rules:
//   - `declaration-property-value-allowed-list` for color properties: the value
//     must be a `var(--clbr-...)` token, a small set of CSS keywords, or a
//     standardized system color (forced-colors mode).
//   - `declaration-property-unit-allowed-list` for dimension/spacing/font-size
//     properties: numeric literals may only carry typography-relative units.
//     `var()` and `calc()` pass through (no raw unit at this layer); unitless
//     `0` is always allowed by stylelint.
//
// Composite-value properties (transition, box-shadow, border/font shorthand,
// background, outline) are intentionally excluded — `allowed-list` is regex
// against the full value string, which becomes unwieldy on multi-part values.
// Revisit with a custom rule once a clean shape emerges.
// -----------------------------------------------------------------------------

const COLOR_PROPS = [
  "accent-color",
  "background-color",
  "border-block-color",
  "border-block-end-color",
  "border-block-start-color",
  "border-bottom-color",
  "border-color",
  "border-inline-color",
  "border-inline-end-color",
  "border-inline-start-color",
  "border-left-color",
  "border-right-color",
  "border-top-color",
  "caret-color",
  "color",
  "column-rule-color",
  "fill",
  "outline-color",
  "stroke",
  "text-decoration-color",
];

// Allow whitespace inside the var() call
const COLOR_TOKEN_REF = /^var\(\s*--clbr-/;
const COLOR_KEYWORDS =
  /^(transparent|currentcolor|inherit|initial|unset|revert|revert-layer|none)$/;
const SYSTEM_COLORS =
  /^(ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|VisitedText|Mark|MarkText|AccentColor|AccentColorText|SelectedItem|SelectedItemText)$/i;

const colorAllowedList = Object.fromEntries(
  COLOR_PROPS.map((p) => [p, [COLOR_TOKEN_REF, COLOR_KEYWORDS, SYSTEM_COLORS]]),
);

// Disallow absolute lengths repo-wide. These don't scale with user font-size
// preference and bypass the design system's spacing scale entirely. Applied
// globally rather than per-property: there's no property where a raw absolute
// length is the right answer; properties that don't take lengths (color,
// content, etc.) are unaffected because the rule scans unit suffixes on
// numeric literals.
//
// rem and rlh are intentionally NOT disallowed — they're root-relative and
// accessibility-aware, useful as a tokenization escape hatch for ad-hoc
// dimensions the system doesn't tokenize. They're also the right unit for
// container query breakpoints (em in @container is relative to the container's
// font-size, which is unpredictable; rem stays anchored to root). Reach for
// tokens first; rem is the documented out.
//
// var() and calc() pass through; unitless 0 is always allowed.
const UNITS_DISALLOWED = ["px", "pt", "pc", "in", "cm", "mm", "Q"];

const stylelintConfig = {
  extends: [require.resolve("stylelint-config-standard")],
  plugins: [require.resolve("stylelint-order")],
  rules: {
    "order/properties-alphabetical-order": true,
    "no-descending-specificity": null,
    "declaration-property-value-allowed-list": colorAllowedList,
    "unit-disallowed-list": UNITS_DISALLOWED,
  },
};

export default stylelintConfig;
