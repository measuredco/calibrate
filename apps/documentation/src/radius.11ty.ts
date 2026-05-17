import { createRequire } from "node:module";

import type { RadiusData } from "./_data/radius";
import radiusData from "./_data/radius";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  radius: RadiusData;
}

interface RadiusToken {
  $description?: string;
  layer?: string;
}

const require = createRequire(import.meta.url);
const msrdTokens =
  require("@measured/calibrate-tokens/msrd") as TokenDocument<RadiusToken>;

const RADIUS_BOX = "var(--clbr-spacing-vertical-1000)";

const radiusTokens = Object.entries(msrdTokens.tokens)
  .filter(
    ([name, token]) => name.startsWith("radius.") && token.layer === "semantic",
  )
  .map(([name, token]) => {
    const cssVariable = tokenNameToCssVariable(name);
    const isRatio = /^radius\.ratio\./.test(name);

    return {
      borderRadius: isRatio
        ? `calc(${RADIUS_BOX} * var(${cssVariable}))`
        : `var(${cssVariable})`,
      cssVariable,
      description: token.$description ?? "",
    };
  });

// Single unlabelled section (the heading would just repeat the page title).
const groups: FoundationsGroup[] = [
  {
    rows: radiusTokens.map((token) => ({
      entries: [
        { cssVariable: token.cssVariable, description: token.description },
      ],
      preview: `<div class="preview">
        <span
          class="radius-box"
          style="border-radius: ${escapeHtml(token.borderRadius)}"
        ></span>
      </div>`,
    })),
  },
];

export default class Radius {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/radius/",
      title: radiusData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-radius",
      groups,
      strapline: data.radius.strapline,
      title: data.radius.title,
    });
  }
}
