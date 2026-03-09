import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/web-components-vite",
  stories: ["../src/**/*.stories.ts"],
};

export default config;
