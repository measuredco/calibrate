export default {
  extends: ["@measured/calibrate-config/stylelint"],
  ignoreFiles: [
    "**/build/**",
    "**/dist/**",
    "**/storybook-static/**",
    "packages/config/editor/**",
  ],
};
