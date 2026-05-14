import { createRequire } from "node:module";

import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrGrid,
  renderClbrGridItem,
  renderClbrHeading,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";
import { processMarkdownInline } from "@measured/calibrate-markdown";

import type { ColorData } from "./_data/color";
import colorData from "./_data/color";

interface PageData {
  color: ColorData;
}

interface ColorTokenValue {
  alpha?: number;
  hex?: string;
}

interface ColorToken {
  $description?: string;
  $value?: ColorTokenValue;
  byContext?: Record<string, { $value?: ColorTokenValue }>;
  byTheme?: Record<string, { $value?: ColorTokenValue }>;
  layer?: string;
}

interface TokenDocument {
  tokens: Record<string, ColorToken>;
}

interface ColorTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  hexByContext: Record<string, string>;
  name: string;
}

interface ColorTokenGroup {
  label: string;
  tokens: ColorTokenRow[];
}

interface ColorContext {
  contentTheme: "light" | "dark";
  themeKey: string;
  variant: "default" | "brand";
}

const require = createRequire(import.meta.url);
const msrdTokens = require("@measured/calibrate-tokens/msrd") as TokenDocument;

const colorContexts: ColorContext[] = [
  {
    contentTheme: "light",
    themeKey: "contentLightDefault",
    variant: "default",
  },
  {
    contentTheme: "light",
    themeKey: "contentLightBrand",
    variant: "brand",
  },
  {
    contentTheme: "dark",
    themeKey: "contentDarkDefault",
    variant: "default",
  },
  {
    contentTheme: "dark",
    themeKey: "contentDarkBrand",
    variant: "brand",
  },
];

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tokenNameToCssVariable = (name: string): string =>
  `--clbr-${name.replaceAll(".", "-")}`;

const getColorGroup = (name: string): string => name.split(".")[1] ?? "";

const formatColorGroupLabel = (group: string): string =>
  group.length === 0 ? group : `${group[0].toUpperCase()}${group.slice(1)}`;

const getColorValue = (
  token: ColorToken,
  context: ColorContext,
): ColorTokenValue | undefined =>
  token.byTheme?.[context.themeKey]?.$value ??
  token.byContext?.[`theme=${context.themeKey},forcedColors=off`]?.$value ??
  token.$value;

const formatHexValue = (value: ColorTokenValue | undefined): string => {
  if (!value?.hex) return "";
  if (value.alpha === undefined) return value.hex;

  const alpha = Math.round(value.alpha * 255)
    .toString(16)
    .padStart(2, "0");

  return `${value.hex}${alpha}`;
};

const colorTokens: ColorTokenRow[] = Object.entries(msrdTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("color.") &&
      token.layer === "semantic" &&
      token.$value?.hex,
  )
  .map(([name, token]) => {
    const group = getColorGroup(name);

    if (!group) {
      throw new Error(`Unsupported color token group: ${name}`);
    }

    return {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group,
      hexByContext: Object.fromEntries(
        colorContexts.map((context) => [
          context.themeKey,
          formatHexValue(getColorValue(token, context)),
        ]),
      ),
      name,
    };
  });

const colorTokenGroups: ColorTokenGroup[] = Array.from(
  colorTokens.reduce<Map<string, ColorTokenRow[]>>((groups, token) => {
    const group = groups.get(token.group);

    if (group) group.push(token);
    else groups.set(token.group, [token]);

    return groups;
  }, new Map()),
  ([group, tokens]) => ({
    label: formatColorGroupLabel(group),
    tokens,
  }),
);

const renderSwatch = (token: ColorTokenRow, context: ColorContext): string => {
  return `
  <div class="swatch">
    <div
      class="swatch-surface"
      data-clbr-content-theme="${escapeHtml(context.contentTheme)}"
      data-clbr-surface="${escapeHtml(context.variant)}"
    >
      <span
        class="swatch-color"
        style="background-color: var(${escapeHtml(token.cssVariable)})"
      ></span>
      <span class="swatch-hex">
        ${escapeHtml(token.hexByContext[context.themeKey] ?? "")}
      </span>
    </div>
  </div>`;
};

const renderColorToken = (token: ColorTokenRow): string =>
  `<div class="row">
    <div class="meta">
      <h3 class="title">var(${escapeHtml(token.cssVariable)})</h3>
      ${renderClbrText({
        as: "p",
        children: processMarkdownInline(token.description),
        size: "sm",
      })}
    </div>
    <div class="swatches">
      ${colorContexts.map((context) => renderSwatch(token, context)).join("")}
    </div>
  </div>`;

const renderColorGroup = (group: ColorTokenGroup): string =>
  `<div class="section">
    ${renderClbrHeading({
      level: 2,
      responsive: true,
      size: "lg",
      text: group.label,
    })}
    ${group.tokens.map(renderColorToken).join("")}
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
          children: renderClbrGridItem({
            colStart: 2,
            colSpan: 10,
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
                  responsive: true,
                  size: "lg",
                }),
                renderClbrDivider({ tone: "brand" }),
                `<div class="docs-color">
                  ${colorTokenGroups.map(renderColorGroup).join("")}
                </div>`,
              ].join(""),
            }),
          }),
        }),
      }),
    });
  }
}
