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

const DIMENSION_PROPS = [
  "block-size",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-radius",
  "border-start-end-radius",
  "border-start-start-radius",
  "column-gap",
  "font-size",
  "gap",
  "height",
  "inline-size",
  "line-height",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "outline-offset",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "row-gap",
  "width",
];

// Typography-relative + percent + viewport-relative units. Viewport units are
// allowed because they represent the viewport itself (a context value, not a
// design value) — useful for full-viewport sizing patterns that can't be
// tokenized. Raw absolute units (px, pt, cm, in) and root-relative `rem` are
// excluded so authors reach for tokens.
const DIMENSION_UNITS_ALLOWED = [
  "em",
  "ch",
  "lh",
  "%",
  "vw",
  "vh",
  "vi",
  "vb",
  "vmin",
  "vmax",
  "svw",
  "svh",
  "svi",
  "svb",
  "svmin",
  "svmax",
  "lvw",
  "lvh",
  "lvi",
  "lvb",
  "lvmin",
  "lvmax",
  "dvw",
  "dvh",
  "dvi",
  "dvb",
  "dvmin",
  "dvmax",
];

const dimensionUnitsAllowed = Object.fromEntries(
  DIMENSION_PROPS.map((p) => [p, DIMENSION_UNITS_ALLOWED]),
);

const stylelintConfig = {
  extends: [require.resolve("stylelint-config-standard")],
  plugins: [require.resolve("stylelint-order")],
  rules: {
    "order/properties-alphabetical-order": true,
    "no-descending-specificity": null,
    "declaration-property-value-allowed-list": colorAllowedList,
    "declaration-property-unit-allowed-list": dimensionUnitsAllowed,
  },
};

export default stylelintConfig;
