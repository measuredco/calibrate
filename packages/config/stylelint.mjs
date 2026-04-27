import { createRequire } from "node:module";

// Stylelint resolves `extends`/`plugins` strings from the consumer's config
// directory, not from the package that declared them. Resolve to absolute
// paths here so consumers don't need to install our internals themselves.
const require = createRequire(import.meta.url);

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

const COLOR_TOKEN_REF = /^var\(\s*--clbr-/;
const COLOR_KEYWORDS =
  /^(transparent|currentcolor|inherit|initial|unset|revert|revert-layer|none)$/;
const SYSTEM_COLORS =
  /^(ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|VisitedText|Mark|MarkText|AccentColor|AccentColorText|SelectedItem|SelectedItemText)$/i;

const colorAllowedList = Object.fromEntries(
  COLOR_PROPS.map((p) => [p, [COLOR_TOKEN_REF, COLOR_KEYWORDS, SYSTEM_COLORS]]),
);

// rem and rlh are deliberately allowed: documented escape hatch for ad-hoc
// dimensions, and the right unit for @container breakpoints (em in @container
// is relative to the container's font-size).
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
