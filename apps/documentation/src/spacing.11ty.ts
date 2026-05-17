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

import type { SpacingData } from "./_data/spacing";
import spacingData from "./_data/spacing";

interface PageData {
  spacing: SpacingData;
}

interface SpacingToken {
  $description?: string;
  layer?: string;
}

interface TokenDocument {
  tokens: Record<string, SpacingToken>;
}

interface SpacingTokenRow {
  axis: "horizontal" | "vertical";
  cssVariable: string;
  description: string;
  isResponsive: boolean;
  name: string;
  step: number;
}

interface SpacingTokenGroup {
  axis: "horizontal" | "vertical";
  label: string;
  tokens: SpacingTokenRow[];
}

// Spacing and layout tokens are brand-independent — they live in the `base`
// export, not the per-brand ones.
const require = createRequire(import.meta.url);
const baseTokens = require("@measured/calibrate-tokens/base") as TokenDocument;

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tokenNameToCssVariable = (name: string): string =>
  `--clbr-${name.replaceAll(".", "-")}`;

// Standard spacing lives under `spacing.{axis}.{step}`. The responsive
// vertical variants live under `layout.spacing.vertical.{step}` (a separate
// size context), so they're pulled in here and interleaved with their
// standard counterpart — same treatment as typography's text/responsive.
const parseSpacingTokenName = (
  name: string,
):
  | { axis: "horizontal" | "vertical"; isResponsive: boolean; step: number }
  | undefined => {
  const standard = /^spacing\.(vertical|horizontal)\.(\d+)$/.exec(name);
  if (standard) {
    return {
      axis: standard[1] as "horizontal" | "vertical",
      isResponsive: false,
      step: Number(standard[2]),
    };
  }
  const responsive = /^layout\.spacing\.vertical\.(\d+)$/.exec(name);
  if (responsive) {
    return {
      axis: "vertical",
      isResponsive: true,
      step: Number(responsive[1]),
    };
  }
  return undefined;
};

const spacingTokens: SpacingTokenRow[] = Object.entries(baseTokens.tokens)
  .filter(
    ([name, token]) =>
      token.layer === "semantic" && parseSpacingTokenName(name),
  )
  .map(([name, token]) => {
    const parsed = parseSpacingTokenName(name)!;

    return {
      axis: parsed.axis,
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      isResponsive: parsed.isResponsive,
      name,
      step: parsed.step,
    };
  });

// Group by axis (vertical first), then sort numerically by step with each
// standard step immediately followed by its responsive counterpart.
const axisOrder: SpacingTokenRow["axis"][] = ["vertical", "horizontal"];

const spacingTokenGroups: SpacingTokenGroup[] = axisOrder
  .map((axis) => ({
    axis,
    label: `${axis[0]!.toUpperCase()}${axis.slice(1)}`,
    tokens: spacingTokens
      .filter((token) => token.axis === axis)
      .sort((a, b) => {
        if (a.step !== b.step) return a.step - b.step;
        return Number(a.isResponsive) - Number(b.isResponsive);
      }),
  }))
  .filter((group) => group.tokens.length > 0);

const renderPreview = (token: SpacingTokenRow): string => {
  const property = token.axis === "vertical" ? "block-size" : "inline-size";

  return `<div class="preview" data-axis="${token.axis}">
    <span
      class="bar"
      style="${property}: var(${escapeHtml(token.cssVariable)})"
    ></span>
  </div>`;
};

const renderSpacingToken = (token: SpacingTokenRow): string =>
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

const renderSpacingGroup = (group: SpacingTokenGroup): string =>
  `<div class="section">
    ${renderClbrHeading({
      id: group.label.toLowerCase(),
      level: 2,
      responsive: true,
      size: "lg",
      text: group.label,
    })}
    ${group.tokens.map(renderSpacingToken).join("")}
  </div>`;

export default class Spacing {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/spacing/",
      title: spacingData.title,
    };
  }

  render(data: PageData): string {
    const spacing = data.spacing;

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
                  text: spacing.title,
                }),
                renderClbrText({
                  as: "p",
                  children: spacing.strapline,
                  responsive: true,
                  size: "lg",
                }),
                renderClbrDivider({ tone: "brand" }),
                `<div class="docs-foundations docs-spacing">
                  ${spacingTokenGroups.map(renderSpacingGroup).join("")}
                </div>`,
              ].join(""),
            }),
          }),
        }),
      }),
    });
  }
}
