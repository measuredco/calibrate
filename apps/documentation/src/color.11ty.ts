import { createRequire } from "node:module";

import type { ColorData } from "./_data/color";
import colorData from "./_data/color";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  reportDroppedTokens,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

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

interface ColorTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  hexByContext: Record<string, string>;
  name: string;
}

interface ColorContext {
  contentTheme: "dark" | "light";
  themeKey: string;
  variant: "brand" | "default";
}

const require = createRequire(import.meta.url);
const msrdTokens =
  require("@measured/calibrate-tokens/msrd") as TokenDocument<ColorToken>;

const colorContexts: ColorContext[] = [
  {
    contentTheme: "light",
    themeKey: "contentLightDefault",
    variant: "default",
  },
  { contentTheme: "light", themeKey: "contentLightBrand", variant: "brand" },
  { contentTheme: "dark", themeKey: "contentDarkDefault", variant: "default" },
  { contentTheme: "dark", themeKey: "contentDarkBrand", variant: "brand" },
];

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

// Semantic color tokens are dropped if they have no renderable `$value.hex`
// (e.g. a new non-hex color group) — surface that instead of vanishing.
reportDroppedTokens(
  "color",
  msrdTokens,
  (name, token) => name.startsWith("color.") && token.layer === "semantic",
  new Set(colorTokens.map((token) => token.name)),
);

const colorTokenGroups = Array.from(
  colorTokens.reduce<Map<string, ColorTokenRow[]>>((groups, token) => {
    const group = groups.get(token.group);

    if (group) group.push(token);
    else groups.set(token.group, [token]);

    return groups;
  }, new Map()),
  ([group, tokens]) => ({ label: formatColorGroupLabel(group), tokens }),
);

const renderSwatch = (token: ColorTokenRow, context: ColorContext): string =>
  `
  <div
    class="swatch"
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
  </div>`;

const renderPreview = (token: ColorTokenRow): string =>
  `<div class="preview">
      ${colorContexts.map((context) => renderSwatch(token, context)).join("")}
    </div>`;

const groups: FoundationsGroup[] = colorTokenGroups.map((group) => ({
  label: group.label,
  rows: group.tokens.map((token) => ({
    entries: [
      { cssVariable: token.cssVariable, description: token.description },
    ],
    preview: renderPreview(token),
  })),
}));

export default class Color {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/color/",
      title: colorData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-color",
      groups,
      strapline: data.color.strapline,
      title: data.color.title,
    });
  }
}
