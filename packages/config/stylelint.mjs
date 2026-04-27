import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const stylelintConfig = {
  extends: [require.resolve("stylelint-config-standard")],
  plugins: [require.resolve("stylelint-order")],
  rules: {
    "order/properties-alphabetical-order": true,
    "no-descending-specificity": null,
  },
};

export default stylelintConfig;
