import { createRequire } from "node:module";

import type { BreakpointData } from "./_data/breakpoint";
import breakpointData from "./_data/breakpoint";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  breakpoint: BreakpointData;
}

interface BreakpointToken {
  $description?: string;
  $value?: string;
  layer?: string;
}

// Breakpoints are brand-independent — they live in the `base` export.
const require = createRequire(import.meta.url);
const baseTokens =
  require("@measured/calibrate-tokens/base") as TokenDocument<BreakpointToken>;

const breakpointTokens = Object.entries(baseTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("breakpoint.") && token.layer === "semantic",
  )
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    px: Number.parseFloat(String(token.$value)) || 0,
  }))
  .sort((a, b) => a.px - b.px);

// Single flat section; preview spans the row capped at the breakpoint —
// same stacked treatment as the layout container max-width preview.
const groups: FoundationsGroup[] = [
  {
    label: "Breakpoint",
    rows: breakpointTokens.map((token) => ({
      entries: [
        { cssVariable: token.cssVariable, description: token.description },
      ],
      preview: `<div
        class="preview"
        data-clbr-surface="inverse"
        style="max-inline-size: var(${escapeHtml(token.cssVariable)})"
      ></div>`,
    })),
  },
];

export default class Breakpoint {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/breakpoint/",
      title: breakpointData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-breakpoint",
      groups,
      strapline: data.breakpoint.strapline,
      title: data.breakpoint.title,
    });
  }
}
