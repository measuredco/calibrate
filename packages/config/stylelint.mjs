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
  "border-end-end-radius",
  "border-end-start-radius",
  "border-radius",
  "border-start-end-radius",
  "border-start-start-radius",
  "column-gap",
  "font-size",
  "gap",
  "line-height",
  "margin-block-end",
  "margin-block-start",
  "margin-block",
  "margin-bottom",
  "margin-inline-end",
  "margin-inline-start",
  "margin-inline",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin",
  "padding-block-end",
  "padding-block-start",
  "padding-block",
  "padding-bottom",
  "padding-inline-end",
  "padding-inline-start",
  "padding-inline",
  "padding-left",
  "padding-right",
  "padding-top",
  "padding",
  "row-gap",
];

const DIMENSION_UNITS_ALLOWED = ["em", "ch", "lh", "%"];

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
