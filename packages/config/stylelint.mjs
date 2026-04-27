import { createRequire } from "node:module";

// Stylelint resolves `extends`/`plugins` strings from the consumer's config
// directory, not from the package that declared them. Resolve to absolute
// paths here so consumers don't need to install our internals themselves.
const require = createRequire(import.meta.url);

const UNITS_DISALLOWED = ["cm", "in", "mm", "ms", "pc", "pt", "px", "Q", "s"];

const COLOR_FUNCTIONS_DISALLOWED = [
  "color-mix",
  "color",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "rgb",
  "rgba",
];

const stylelintConfig = {
  extends: [
    require.resolve("stylelint-config-standard"),
    require.resolve("stylelint-plugin-logical-css/configs/recommended"),
  ],
  plugins: [require.resolve("stylelint-order")],
  rules: {
    "order/properties-alphabetical-order": true,
    "color-named": "never",
    "color-no-hex": true,
    "declaration-no-important": true,
    "function-disallowed-list": COLOR_FUNCTIONS_DISALLOWED,
    "no-descending-specificity": null,
    "unit-disallowed-list": UNITS_DISALLOWED,
  },
};

export default stylelintConfig;
