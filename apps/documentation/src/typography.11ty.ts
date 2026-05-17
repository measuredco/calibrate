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

import type { TypographyData } from "./_data/typography";
import typographyData from "./_data/typography";

interface PageData {
  typography: TypographyData;
}

interface TypographyToken {
  $description?: string;
  layer?: string;
}

interface TokenDocument {
  tokens: Record<string, TypographyToken>;
}

interface TypographyTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  name: string;
}

interface TypographyTokenGroup {
  label: string;
  tokens: TypographyTokenRow[];
}

const require = createRequire(import.meta.url);
const msrdTokens = require("@measured/calibrate-tokens/msrd") as TokenDocument;

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tokenNameToCssVariable = (name: string): string =>
  `--clbr-${name.replaceAll(".", "-")}`;

const getTypographyGroup = (name: string): string => name.split(".")[1] ?? "";

const formatTypographyGroupLabel = (group: string): string => {
  if (group.length === 0) return group;
  return `${group[0].toUpperCase()}${group.slice(1).replaceAll("-", " ")}`;
};

const SAMPLE_TEXT = "Calibrate";

interface PreviewConfig {
  noSample?: boolean;
  property: string;
}

const previewByGroup: Record<string, PreviewConfig | undefined> = {
  "font-family": { property: "font-family" },
  "font-weight": { property: "font-weight" },
  leading: { noSample: true, property: "line-height" },
  measure: { noSample: true, property: "max-inline-size" },
  paragraph: { noSample: true, property: "line-height" },
  text: { property: "font" },
};

const getPreviewConfig = (group: string): PreviewConfig | undefined =>
  previewByGroup[group];

const typographyTokens: TypographyTokenRow[] = Object.entries(msrdTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("typography.") && token.layer === "semantic",
  )
  .map(([name, token]) => {
    const group = getTypographyGroup(name);

    if (!group) {
      throw new Error(`Unsupported typography token group: ${name}`);
    }

    return {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group,
      name,
    };
  });

const parseTextTokenName = (
  name: string,
): { category: string; isResponsive: boolean; size: string } | undefined => {
  const parts = name.split(".");
  if (parts.length < 4 || parts[0] !== "typography" || parts[1] !== "text")
    return undefined;
  const category = parts[2]!;
  if (parts[3] === "responsive") {
    return { category, isResponsive: true, size: parts[4] ?? "" };
  }
  return { category, isResponsive: false, size: parts[3]! };
};

const sortTextRows = (rows: TypographyTokenRow[]): TypographyTokenRow[] => {
  const categoryOrder = new Map<string, number>();
  const sizeOrderByCategory = new Map<string, Map<string, number>>();

  for (const row of rows) {
    const parsed = parseTextTokenName(row.name);
    if (!parsed) continue;
    if (!categoryOrder.has(parsed.category)) {
      categoryOrder.set(parsed.category, categoryOrder.size);
    }
    const sizes =
      sizeOrderByCategory.get(parsed.category) ??
      sizeOrderByCategory.set(parsed.category, new Map()).get(parsed.category)!;
    if (!sizes.has(parsed.size)) sizes.set(parsed.size, sizes.size);
  }

  return [...rows].sort((a, b) => {
    const ap = parseTextTokenName(a.name);
    const bp = parseTextTokenName(b.name);
    if (!ap || !bp) return 0;
    const aCat = categoryOrder.get(ap.category) ?? Infinity;
    const bCat = categoryOrder.get(bp.category) ?? Infinity;
    if (aCat !== bCat) return aCat - bCat;
    const aSize =
      sizeOrderByCategory.get(ap.category)?.get(ap.size) ?? Infinity;
    const bSize =
      sizeOrderByCategory.get(bp.category)?.get(bp.size) ?? Infinity;
    if (aSize !== bSize) return aSize - bSize;
    return Number(ap.isResponsive) - Number(bp.isResponsive);
  });
};

const typographyTokenGroups: TypographyTokenGroup[] = Array.from(
  typographyTokens.reduce<Map<string, TypographyTokenRow[]>>(
    (groups, token) => {
      const group = groups.get(token.group);

      if (group) group.push(token);
      else groups.set(token.group, [token]);

      return groups;
    },
    new Map(),
  ),
  ([group, tokens]) => ({
    label: formatTypographyGroupLabel(group),
    tokens: group === "text" ? sortTextRows(tokens) : tokens,
  }),
);

const renderPreview = (token: TypographyTokenRow): string => {
  const config = getPreviewConfig(token.group);
  if (!config) return "";

  const content = config.noSample ? "&nbsp;" : escapeHtml(SAMPLE_TEXT);

  return `<div
    class="preview"
    data-clbr-surface="inverse"
    style="${escapeHtml(config.property)}: var(${escapeHtml(token.cssVariable)})"
  >${content}</div>`;
};

const renderTypographyToken = (token: TypographyTokenRow): string =>
  `<div class="row">
    <div class="meta">
      <h3 class="title">var(${escapeHtml(token.cssVariable)})</h3>
      ${renderClbrText({
        as: "p",
        children: processMarkdownInline(token.description),
        size: "sm",
      })}
    </div>
    ${renderPreview(token)}
  </div>`;

const renderTypographyGroup = (group: TypographyTokenGroup): string =>
  `<div class="section">
    ${renderClbrHeading({
      id: group.label.toLowerCase().replaceAll(" ", "-"),
      level: 2,
      responsive: true,
      size: "lg",
      text: group.label,
    })}
    ${group.tokens.map(renderTypographyToken).join("")}
  </div>`;

export default class Typography {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/typography/",
      title: typographyData.title,
    };
  }

  render(data: PageData): string {
    const typography = data.typography;

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
                  text: typography.title,
                }),
                renderClbrText({
                  as: "p",
                  children: typography.strapline,
                  responsive: true,
                  size: "lg",
                }),
                renderClbrDivider({ tone: "brand" }),
                `<div class="docs-foundations docs-typography">
                  ${typographyTokenGroups.map(renderTypographyGroup).join("")}
                </div>`,
              ].join(""),
            }),
          }),
        }),
      }),
    });
  }
}
