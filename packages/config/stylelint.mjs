import { createRequire } from "node:module";

// Stylelint resolves `extends`/`plugins` strings from the consumer's config
// directory, not from the package that declared them. Resolve to absolute
// paths here so consumers don't need to install our internals themselves.
const require = createRequire(import.meta.url);

// rem and rlh are deliberately allowed: documented escape hatch for ad-hoc
// dimensions, and the right unit for @container breakpoints (em in @container
// is relative to the container's font-size).
const UNITS_DISALLOWED = ["px", "pt", "pc", "in", "cm", "mm", "Q"];

const COLOR_FUNCTIONS_DISALLOWED = [
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "color",
  "color-mix",
];

const stylelintConfig = {
  extends: [require.resolve("stylelint-config-standard")],
  plugins: [require.resolve("stylelint-order")],
  rules: {
    "order/properties-alphabetical-order": true,
    "no-descending-specificity": null,
    "color-no-hex": true,
    "color-named": "never",
    "function-disallowed-list": COLOR_FUNCTIONS_DISALLOWED,
    "unit-disallowed-list": UNITS_DISALLOWED,
  },
};

export default stylelintConfig;
