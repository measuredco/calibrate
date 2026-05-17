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

import type { LayoutPageData } from "./_data/layoutPage";
import layoutPageData from "./_data/layoutPage";

interface PageData {
  layoutPage: LayoutPageData;
}

interface LayoutToken {
  $description?: string;
  $value?: unknown;
  layer?: string;
}

interface TokenDocument {
  tokens: Record<string, LayoutToken>;
}

interface LayoutTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  name: string;
  value: string;
}

interface LayoutTokenGroup {
  label: string;
  tokens: LayoutTokenRow[];
}

// Layout tokens are mostly brand-independent (base); the brand divider
// dimensions live in the per-brand export, so merge both.
const require = createRequire(import.meta.url);
const baseTokens = require("@measured/calibrate-tokens/base") as TokenDocument;
const msrdTokens = require("@measured/calibrate-tokens/msrd") as TokenDocument;
const allTokens: TokenDocument = {
  tokens: { ...baseTokens.tokens, ...msrdTokens.tokens },
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tokenNameToCssVariable = (name: string): string =>
  `--clbr-${name.replaceAll(".", "-")}`;

const getLayoutGroup = (name: string): string => name.split(".")[1] ?? "";

const formatLayoutGroupLabel = (group: string): string => {
  if (group.length === 0) return group;
  return `${group[0].toUpperCase()}${group.slice(1).replaceAll("-", " ")}`;
};

// `layout.spacing.*` is the responsive vertical-rhythm set — it's the
// Spacing page's "Vertical responsive" section, not a layout token here.
const isLayoutToken = (name: string): boolean =>
  name.startsWith("layout.") && !name.startsWith("layout.spacing.");

type PreviewKind =
  | "border-width"
  | "icon-size"
  | "inline-size"
  | "stacked-width"
  | "value-text";

// Groups with an obvious one-property preview. Divider is handled separately
// (one combined preview for its size + thickness pair). "inline-size" covers
// any horizontal length shown as a bar of that width (gutters, grid gaps).
// "value-text" shows the raw value for unitless tokens with no spatial
// representation (grid columns, icon viewBox ratios). The remainder
// (focus-ring offsets) read better as value + description for now.
const previewKind = (name: string): PreviewKind | undefined => {
  if (/^layout\.icon\.size\./.test(name)) return "icon-size";
  if (/^layout\.border\.width\./.test(name)) return "border-width";
  if (/^layout\.container\.max-width\./.test(name)) return "stacked-width";
  if (/^layout\.grid\.item\.min-width$/.test(name)) return "stacked-width";
  if (/^layout\.container\.gutter\./.test(name)) return "inline-size";
  if (/^layout\.grid\.gap\./.test(name)) return "inline-size";
  if (/^layout\.grid\.columns$/.test(name)) return "value-text";
  if (/^layout\.icon\.viewbox\./.test(name)) return "value-text";
  return undefined;
};

const isDividerGroup = (tokens: LayoutTokenRow[]): boolean =>
  tokens[0]?.name.startsWith("layout.divider.") ?? false;

const layoutTokens: LayoutTokenRow[] = Object.entries(allTokens.tokens)
  .filter(([name, token]) => isLayoutToken(name) && token.layer === "semantic")
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    group: getLayoutGroup(name),
    name,
    value: token.$value === undefined ? "" : String(token.$value),
  }));

const layoutTokenGroups: LayoutTokenGroup[] = Array.from(
  layoutTokens.reduce<Map<string, LayoutTokenRow[]>>((groups, token) => {
    const group = groups.get(token.group);

    if (group) group.push(token);
    else groups.set(token.group, [token]);

    return groups;
  }, new Map()),
  ([group, tokens]) => ({
    label: formatLayoutGroupLabel(group),
    tokens,
  }),
);

const renderPreview = (token: LayoutTokenRow): string => {
  const kind = previewKind(token.name);
  if (!kind) return "";

  const value = `var(${escapeHtml(token.cssVariable)})`;

  if (kind === "icon-size") {
    return `<div class="preview">
      <span class="icon-box" style="block-size: ${value}"></span>
    </div>`;
  }

  if (kind === "border-width") {
    return `<div class="preview">
      <span class="border-bar" style="block-size: ${value}"></span>
    </div>`;
  }

  if (kind === "inline-size") {
    return `<div class="preview">
      <span class="inline-bar" style="inline-size: ${value}"></span>
    </div>`;
  }

  if (kind === "value-text") {
    return `<div class="preview">
      <span class="value-text">${escapeHtml(token.value)}</span>
    </div>`;
  }

  // stacked-width (container max-width, grid item min-width) — cap the
  // preview at the token and stack it full-width, mirroring the typography
  // measure preview exactly: empty box, height from the preview's own
  // padding (the .docs-layout stacked override keys off max-inline-size).
  return `<div
    class="preview"
    data-clbr-surface="inverse"
    style="max-inline-size: ${value}"
  ></div>`;
};

const renderMeta = (token: LayoutTokenRow): string =>
  `<h3 class="title">var(${escapeHtml(token.cssVariable)})</h3>
    ${renderClbrText({
      as: "p",
      children: processMarkdownInline(token.description),
      size: "sm",
    })}`;

const renderLayoutToken = (token: LayoutTokenRow): string =>
  `<div class="row">
    <div class="meta">${renderMeta(token)}</div>
    ${renderPreview(token)}
  </div>`;

// Divider documents two tokens (brand size + thickness) but they describe one
// element, so render a single row: both tokens in the meta, one preview
// driven by both vars.
const renderDividerRow = (tokens: LayoutTokenRow[]): string => {
  const size = tokens.find((t) => t.name.endsWith(".size"));
  const thickness = tokens.find((t) => t.name.endsWith(".thickness"));
  const style = [
    size ? `inline-size: var(${escapeHtml(size.cssVariable)})` : "",
    thickness ? `block-size: var(${escapeHtml(thickness.cssVariable)})` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return `<div class="row">
    <div class="meta">
      ${[size, thickness]
        .filter((t): t is LayoutTokenRow => Boolean(t))
        .map(renderMeta)
        .join("")}
    </div>
    <div class="preview">
      <span class="divider-bar" style="${style}"></span>
    </div>
  </div>`;
};

const renderLayoutGroup = (group: LayoutTokenGroup): string =>
  `<div class="section">
    ${renderClbrHeading({
      id: group.label.toLowerCase().replaceAll(" ", "-"),
      level: 2,
      responsive: true,
      size: "lg",
      text: group.label,
    })}
    ${
      isDividerGroup(group.tokens)
        ? renderDividerRow(group.tokens)
        : group.tokens.map(renderLayoutToken).join("")
    }
  </div>`;

export default class Layout {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/layout/",
      title: layoutPageData.title,
    };
  }

  render(data: PageData): string {
    const layout = data.layoutPage;

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
                  text: layout.title,
                }),
                renderClbrText({
                  as: "p",
                  children: layout.strapline,
                  responsive: true,
                  size: "lg",
                }),
                renderClbrDivider({ tone: "brand" }),
                `<div class="docs-foundations docs-layout">
                  ${layoutTokenGroups.map(renderLayoutGroup).join("")}
                </div>`,
              ].join(""),
            }),
          }),
        }),
      }),
    });
  }
}
