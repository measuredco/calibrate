import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

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
 * Builds the IR tree for the Calibrate shape component.
 *
 * @param props - Shape component props.
 * @returns IR node for a masked shape element.
 */
export function buildClbrShape({
  variant = "corner",
  tone = "default",
  size = "md",
}: ClbrShapeProps = {}): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-shape",
      "data-size": size,
      "data-tone":
        tone === "neutral" || tone === "brand" || tone === "support"
          ? tone
          : undefined,
      "data-variant": variant,
    },
    children: [],
  };
}

/**
 * SSR renderer for the Calibrate shape component.
 *
 * @param props - Shape component props.
 * @returns HTML string for a masked shape element.
 */
export function renderClbrShape(props: ClbrShapeProps = {}): string {
  return serializeClbrNode(buildClbrShape(props));
}

/** Declarative shape contract mirror for tooling, docs, and adapters. */
export const CLBR_SHAPE_SPEC: ClbrComponentSpec = {
  name: "shape",
  description: "Use `shape` to render brand visual language components.",
  output: { element: "div", class: "clbr-shape" },
  content: { kind: "none" },
  props: {
    variant: {
      default: "corner",
      description: "Shape to render.",
      type: {
        kind: "enum",
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
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: {
        kind: "enum",
        values: ["default", "neutral", "brand", "support"],
      },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl", "fill"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-variant",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "variant" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["neutral", "brand", "support"],
        },
        value: { kind: "prop", prop: "tone" },
      },
    ],
  },
};
