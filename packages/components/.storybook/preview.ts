import type { Preview } from "@storybook/web-components-vite";
import { renderClbrRoot } from "../src/components/root/root";
import "../src/styles.css";

const decodeHtmlEntities = (source: string): string =>
  source
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

const formatSourceForDocs = async (source: string): Promise<string> => {
  const decoded = decodeHtmlEntities(source);
  const prettier = await import("prettier/standalone");
  const prettierHtml = await import("prettier/plugins/html");

  return await prettier.format(decoded, {
    parser: "html",
    plugins: [prettierHtml],
  });
};

const toTheme = (value: unknown): "dark" | "light" | undefined =>
  value === "dark" || value === "light" ? value : undefined;

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const padding =
        typeof context.parameters.padding !== "undefined"
          ? context.parameters.padding
          : "1em";
      const storyHtml = String(Story());
      const withRoot = context.parameters?.withRoot !== false;

      if (!withRoot)
        return `<div style="padding: ${padding}">
          ${storyHtml}
        </div>`;

      return renderClbrRoot({
        brand: context.globals.brand,
        children: `<div style="padding: ${padding}; width: 100%;">
          ${storyHtml}
        </div>`,
        dir: context.globals.direction,
        theme: toTheme(context.globals.theme),
      });
    },
  ],
  globalTypes: {
    brand: {
      description: "Brand",
      defaultValue: "msrd",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { title: "measured", value: "msrd" },
          { title: "wireframe", value: "wrfr" },
        ],
      },
    },
    theme: {
      description: "Theme",
      defaultValue: undefined,
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { title: "auto", value: undefined },
          { title: "light", value: "light" },
          { title: "dark", value: "dark" },
        ],
      },
    },
    direction: {
      description: "Direction",
      defaultValue: undefined,
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { title: "inherit", value: undefined },
          { title: "ltr", value: "ltr" },
          { title: "rtl", value: "rtl" },
        ],
      },
    },
  },
  parameters: {
    backgrounds: {
      disable: true,
      grid: { disable: true },
    },
    docs: {
      source: {
        excludeDecorators: true,
        transform: (source: string) => formatSourceForDocs(source),
      },
    },
    layout: "fullscreen",
    withRoot: true,
  },
  tags: ["autodocs"],
};

export default preview;
