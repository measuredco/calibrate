import calibrateStylelint from "@measured/calibrate-config/stylelint";

export default {
  ...calibrateStylelint,
  ignoreFiles: ["**/build/**", "**/dist/**", "**/storybook-static/**"],
};
