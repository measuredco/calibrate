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

type SpacingGroup = "horizontal" | "vertical" | "vertical-responsive";

interface SpacingTokenRow {
  // Axis drives the preview (vertical → block-size, horizontal → inline-size);
  // group drives sectioning (responsive vertical is its own section).
  axis: "horizontal" | "vertical";
  cssVariable: string;
  description: string;
  group: SpacingGroup;
  name: string;
  step: number;
}

interface SpacingTokenGroup {
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
// size context); they get their own section, same split as typography's
// text / text-responsive.
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

const spacingTokens: SpacingTokenRow[] = Object.entries(
  baseTokens.tokens,
).flatMap(([name, token]) => {
  if (token.layer !== "semantic") return [];
  const parsed = parseSpacingTokenName(name);
  if (!parsed) return [];

  return [
    {
      axis: parsed.axis,
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group: parsed.isResponsive
        ? ("vertical-responsive" as const)
        : parsed.axis,
      name,
      step: parsed.step,
    },
  ];
});

// One section per group, in this order; each is single-kind so a plain
// step-ascending sort reads correctly at every viewport.
const groupOrder: { group: SpacingGroup; label: string }[] = [
  { group: "vertical", label: "Vertical" },
  { group: "vertical-responsive", label: "Vertical responsive" },
  { group: "horizontal", label: "Horizontal" },
];

const spacingTokenGroups: SpacingTokenGroup[] = groupOrder
  .map(({ group, label }) => ({
    label,
    tokens: spacingTokens
      .filter((token) => token.group === group)
      .sort((a, b) => a.step - b.step),
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
      id: group.label.toLowerCase().replaceAll(" ", "-"),
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
