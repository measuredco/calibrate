import { attrs } from "../../helpers/html";
import type { ClbrShapeVariant } from "../shape/shape";

export type ClbrPatternSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type ClbrPatternTone = "default" | "subtle" | "support";
export type ClbrPatternVariant = ClbrShapeVariant;

/** Props for the Calibrate pattern renderer. */
export interface ClbrPatternProps {
  /**
   * Inner HTML content rendered inside the pattern container.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Pattern variant.
   * Always emits `data-variant`.
   * Mirrors the visual-language shape ids.
   * @default "corner"
   */
  variant?: ClbrPatternVariant;
  /**
   * Pattern tone.
   * Omitted when `default`.
   * Non-default values select the corresponding decorative pattern color.
   * @default "default"
   */
  tone?: ClbrPatternTone;
  /**
   * Pattern size mode.
   * Always emits `data-size`.
   * Named sizes map to canonical fractions of the selected shape's derived
   * size. `fill` disables repeat and scales the mask to contain the pattern
   * box.
   * @default "md"
   */
  size?: ClbrPatternSize;
}

/**
 * SSR renderer for the Calibrate pattern component.
 *
 * Emits a single `div.pattern` root. Visual rendering is CSS-driven and uses
 * the selected shape image as a repeated masked layer. Trusted child HTML, when
 * provided, is rendered inside the root above the decorative layer.
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
    class: "pattern",
    "data-size": size,
    "data-tone": tone === "default" ? undefined : tone,
    "data-variant": variant,
  });

  return `<div ${patternAttrs}>${children ?? ""}</div>`;
}

/** Declarative pattern contract mirror for tooling, docs, and adapters. */
export const CLBR_PATTERN_SPEC = {
  name: "pattern",
  output: {
    element: "div",
    class: "pattern",
    children: "trusted HTML",
    rendering:
      "CSS-driven repeated masked layer using generated shape image/block-size token variables.",
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    tone: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "subtle", "support"],
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl", "fill"],
    },
    variant: {
      default: "corner",
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
        value: "pattern",
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
