import { addons } from "storybook/manager-api";

import { darkTheme, lightTheme } from "./themes";

const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: prefersDark ? darkTheme : lightTheme,
});
