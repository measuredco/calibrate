import type { Preview } from "@storybook/web-components-vite";
import { renderClbrRoot } from "../../../packages/core/src/components/root/root";
import { renderClbrSurface } from "../../../packages/core/src/components/surface/surface";
import "../../../packages/core/src/styles.css";

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

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const padding =
        typeof context.parameters.padding !== "undefined"
          ? context.parameters.padding
          : "1.75rem 1.25rem";
      const storyHtml = String(Story());
      const withRoot = context.parameters?.withRoot !== false;
      const withSurface = context.parameters?.withSurface !== false;

      if (!withRoot) return storyHtml;

      if (!withSurface)
        return renderClbrRoot({
          brand: context.globals.brand,
          children: storyHtml,
          dir: context.globals.direction,
          theme: context.globals.theme,
        });

      return renderClbrRoot({
        brand: context.globals.brand,
        children: `
          ${renderClbrSurface({
            children: `
              <div style="padding: ${padding}">
                ${storyHtml}
              </div>
            `,
            variant: context.globals.surface,
          })}
        `,
        dir: context.globals.direction,
        theme: context.globals.theme,
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
    surface: {
      description: "Surface",
      defaultValue: "default",
      toolbar: {
        title: "Surface",
        icon: "stacked",
        items: [
          { title: "default", value: "default" },
          { title: "brand", value: "brand" },
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
    withSurface: true,
  },
  tags: ["autodocs"],
};

export default preview;
