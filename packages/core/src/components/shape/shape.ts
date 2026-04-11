import { attrs } from "../../helpers/html";

export type ClbrShapeSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type ClbrShapeTone =
  | "default"
  | "brand"
  | "support"
  | "neutral";
export type ClbrShapeVariant =
  | "corner"
  | "tile-lg"
  | "tile-slice-lg"
  | "tile-sm"
  | "tile-slice-sm"
  | "circle-lg"
  | "circle-sm";

/** Props for the Calibrate shape renderer. */
export interface ClbrShapeProps {
  /**
   * Shape size mode.
   * Always emits `data-size`.
   * `fill` stretches the shape to the block-size of its container; the named
   * sizes map to canonical fractions of the selected shape's derived size.
   * @default "md"
   */
  size?: ClbrShapeSize;
  /**
   * Shape tone.
   * Omitted when `default`.
   * Non-default values select the corresponding semantic color treatment.
   * @default "default"
   */
  tone?: ClbrShapeTone;
  /**
   * Shape variant.
   * Always emits `data-variant`.
   * Selects one of the visual-language shape masks from the generated token set.
   * @default "corner"
   */
  variant?: ClbrShapeVariant;
}

/**
 * SSR renderer for the Calibrate shape component.
 *
 * Emits a single `div.shape` with a required `data-variant` attribute.
 * Visual rendering is CSS-driven via the generated shape token variables:
 * `data-variant` selects the mask and canonical derived size, `data-size`
 * selects the size mapping, and optional `data-tone` selects the color.
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
    class: "shape",
    "data-size": size,
    "data-tone": tone === "default" ? undefined : tone,
    "data-variant": variant,
  });

  return `<div ${shapeAttrs}></div>`;
}

/** Declarative shape contract mirror for tooling, docs, and adapters. */
export const CLBR_SHAPE_SPEC = {
  name: "shape",
  output: {
    element: "div",
    class: "shape",
    rendering:
      "CSS-driven masked shape using generated image/block-size token variables.",
  },
  props: {
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
    tone: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "neutral", "brand", "support"],
    },
    size: {
      default: "md",
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
        value: "shape",
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
