import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/web-components-vite",
  stories: ["../stories/**/*.mdx", "../../../packages/*/src/**/*.stories.ts"],
};

export default config;
