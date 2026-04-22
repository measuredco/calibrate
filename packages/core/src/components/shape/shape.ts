import { attrs } from "../../helpers/html";

export type ClbrShapeSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type ClbrShapeTone = "default" | "brand" | "support" | "neutral";
export type ClbrShapeVariant =
  | "corner"
  | "tile-lg"
  | "tile-slice-lg"
  | "tile-sm"
  | "tile-slice-sm"
  | "circle-lg"
  | "circle-sm";

export interface ClbrShapeProps {
  /** Size mode. @default "md" */
  size?: ClbrShapeSize;
  /** Tone. @default "default" */
  tone?: ClbrShapeTone;
  /** Shape variant. @default "corner" */
  variant?: ClbrShapeVariant;
}

/**
 * SSR renderer for the Calibrate shape component.
 *
 * @param props - Shape component props.
 * @returns HTML string for a masked shape element.
 */
export function renderClbrShape({
  variant = "corner",
  tone = "default",
  size = "md",
}: ClbrShapeProps = {}): string {
  const shapeAttrs = attrs({
    class: "clbr-shape",
    "data-size": size,
    "data-tone":
      tone === "neutral" || tone === "brand" || tone === "support"
        ? tone
        : undefined,
    "data-variant": variant,
  });

  return `<div ${shapeAttrs}></div>`;
}

/** Declarative shape contract mirror for tooling, docs, and adapters. */
export const CLBR_SHAPE_SPEC = {
  name: "shape",
  description: "Use `shape` to render brand visual language components.",
  output: {
    element: "div",
    class: "clbr-shape",
    rendering:
      "CSS-driven masked shape using generated image/block-size token variables.",
  },
  props: {
    variant: {
      default: "corner",
      description: "Shape to render.",
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
    tone: {
      default: "default",
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["default", "neutral", "brand", "support"],
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl", "fill"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-shape",
      },
      {
        behavior: "always",
        target: "data-variant",
        value: "{variant}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: 'tone is "neutral", "brand", or "support"',
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
    ],
  },
} as const;
