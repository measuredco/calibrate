import { createRequire } from "node:module";

import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrGrid,
  renderClbrGridItem,
  renderClbrHeading,
  renderClbrStack,
  renderClbrSurface,
  renderClbrText,
  type ClbrSurfaceVariant,
  type ClbrTheme,
} from "@measured/calibrate-core";

import type { ColorData } from "./_data/color";
import colorData from "./_data/color";

interface PageData {
  color: ColorData;
}

interface ColorTokenValue {
  hex?: string;
}

interface ColorToken {
  $description?: string;
  $value?: ColorTokenValue;
  layer?: string;
}

interface TokenDocument {
  tokens: Record<string, ColorToken>;
}

interface ColorTokenRow {
  cssVariable: string;
  description: string;
  name: string;
}

interface ColorContext {
  contentTheme: ClbrTheme;
  label: string;
  variant: ClbrSurfaceVariant;
}

const require = createRequire(import.meta.url);
const msrdTokens = require("@measured/calibrate-tokens/msrd") as TokenDocument;

const colorContexts: ColorContext[] = [
  { contentTheme: "light", label: "Light default", variant: "default" },
  { contentTheme: "light", label: "Light brand", variant: "brand" },
  { contentTheme: "dark", label: "Dark default", variant: "default" },
  { contentTheme: "dark", label: "Dark brand", variant: "brand" },
];

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tokenNameToCssVariable = (name: string): string =>
  `--clbr-${name.replaceAll(".", "-")}`;

const colorTokens: ColorTokenRow[] = Object.entries(msrdTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("color.") &&
      token.layer === "semantic" &&
      token.$value?.hex,
  )
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    name,
  }));

const renderSwatch = (token: ColorTokenRow, context: ColorContext): string =>
  renderClbrSurface({
    contentTheme: context.contentTheme,
    variant: context.variant,
    children: `<div class="docs-color-context">
      <span class="docs-color-context-label">${escapeHtml(context.label)}</span>
      <span
        class="docs-color-swatch"
        style="background-color: var(${escapeHtml(token.cssVariable)})"
      ></span>
      <code class="docs-color-context-var">var(${escapeHtml(token.cssVariable)})</code>
    </div>`,
  });

const renderColorToken = (token: ColorTokenRow): string =>
  `<section class="docs-color-row">
    ${colorContexts.map((context) => renderSwatch(token, context)).join("")}
    <div class="docs-color-meta">
      <h2 class="docs-color-meta-name">${escapeHtml(token.name)}</h2>
      <p class="docs-color-meta-description">${escapeHtml(token.description)}</p>
    </div>
  </section>`;

const renderColorHeader = (): string =>
  `<div class="docs-color-header" aria-hidden="true">
    ${colorContexts
      .map(
        (context) =>
          `<span class="docs-color-header-cell">${escapeHtml(context.label)}</span>`,
      )
      .join("")}
    <span class="docs-color-header-cell">Token</span>
  </div>`;

export default class Color {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/color/",
      title: colorData.title,
    };
  }

  render(data: PageData): string {
    const color = data.color;

    return renderClbrContainer({
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderClbrGrid({
          children: [
            renderClbrGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderClbrStack({
                gap: "md",
                children: [
                  renderClbrHeading({
                    level: 1,
                    opticalAlign: true,
                    responsive: true,
                    size: "2xl",
                    text: color.title,
                  }),
                  renderClbrText({
                    as: "p",
                    children: color.strapline,
                    measured: false,
                    responsive: true,
                    size: "lg",
                  }),
                  renderClbrDivider({ tone: "brand" }),
                ].join(""),
              }),
            }),
            renderClbrGridItem({
              colStart: 2,
              colSpan: 11,
              children: `<div class="docs-color-table">
                ${renderColorHeader()}
                ${colorTokens.map(renderColorToken).join("")}
              </div>`,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
