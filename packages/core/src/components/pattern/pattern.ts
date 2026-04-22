import { attrs } from "../../helpers/html";
import type { ClbrShapeVariant } from "../shape/shape";

export type ClbrPatternSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type ClbrPatternTone = "default" | "subtle" | "support";
export type ClbrPatternVariant = ClbrShapeVariant;

export interface ClbrPatternProps {
  /** Trusted inner HTML rendered inside the pattern container. */
  children?: string;
  /** Pattern variant. @default "corner" */
  variant?: ClbrPatternVariant;
  /** Tone. @default "default" */
  tone?: ClbrPatternTone;
  /** Size mode. @default "md" */
  size?: ClbrPatternSize;
}

/**
 * SSR renderer for the Calibrate pattern component.
 *
 * @param props - Pattern component props.
 * @returns HTML string for a pattern container.
 */
export function renderClbrPattern({
  children,
  size = "md",
  tone = "default",
  variant = "corner",
}: ClbrPatternProps = {}): string {
  const patternAttrs = attrs({
    class: "clbr-pattern",
    "data-size": size,
    "data-tone": tone === "default" ? undefined : tone,
    "data-variant": variant,
  });

  return `<div ${patternAttrs}>${children ?? ""}</div>`;
}

/** Declarative pattern contract mirror for tooling, docs, and adapters. */
export const CLBR_PATTERN_SPEC = {
  name: "pattern",
  description:
    "Use `pattern` to render repeated visual language components behind content.",
  output: {
    element: "div",
    class: "clbr-pattern",
    children: "trusted HTML",
    rendering:
      "CSS-driven repeated masked layer using generated shape image/block-size token variables.",
  },
  props: {
    children: {
      description: "Content rendered above the pattern.",
      required: false,
      type: "html",
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["default", "subtle", "support"],
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl", "fill"],
    },
    variant: {
      default: "corner",
      description: "Shape used for the pattern tile.",
      required: false,
      type: "enum",
      values: [
        "corner",
        "tile-lg",
        "tile-slice-lg",
        "tile-sm",
        "tile-slice-sm",
        "circle-lg",
        "circle-sm",
      ],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-pattern",
      },
      {
        behavior: "always",
        target: "data-variant",
        value: "{variant}",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: 'tone is "subtle" or "support"',
      },
    ],
  },
} as const;
