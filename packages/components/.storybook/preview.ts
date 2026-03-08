import type { Preview } from "@storybook/web-components-vite";

import { renderClbrRoot } from "../src/components/root/root";
import "../src/styles.css";

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
        return `<div style="padding: ${padding}; width: 100%;">
          ${storyHtml}
        </div>`;

      return renderClbrRoot({
        brand: context.globals.brand,
        children: `<div style="padding: ${padding}; width: 100%;">
          ${storyHtml}
        </div>`,
        dir: context.globals.direction,
      });
    },
  ],
  globalTypes: {
    brand: {
      description: "Brand",
      defaultValue: "msrd",
      toolbar: {
        title: "Brand",
        icon: "transfer",
        items: ["msrd", "wrfr"],
      },
    },
    direction: {
      description: "Direction",
      defaultValue: "ltr",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: ["ltr", "rtl"],
      },
    },
  },
  parameters: {
    backgrounds: {
      disable: true,
      grid: { disable: true },
    },
    layout: "fullscreen",
    withRoot: true,
  },
};

export default preview;
