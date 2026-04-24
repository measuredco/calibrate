import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
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
 * Builds the IR tree for the Calibrate pattern component.
 *
 * @param props - Pattern component props.
 * @returns IR node for a pattern container.
 */
export function buildClbrPattern({
  children,
  size = "md",
  tone = "default",
  variant = "corner",
}: ClbrPatternProps = {}): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-pattern",
      "data-size": size,
      "data-tone": tone === "default" ? undefined : tone,
      "data-variant": variant,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Calibrate pattern component.
 *
 * @param props - Pattern component props.
 * @returns HTML string for a pattern container.
 */
export function renderClbrPattern(props: ClbrPatternProps = {}): string {
  return serializeClbrNode(buildClbrPattern(props));
}

/** Declarative pattern contract mirror for tooling, docs, and adapters. */
export const CLBR_PATTERN_SPEC: ClbrComponentSpec = {
  name: "pattern",
  description:
    "Use `pattern` to render repeated visual language components behind content.",
  output: { element: "div", class: "clbr-pattern" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered above the pattern.",
      type: { kind: "html" },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "subtle", "support"] },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl", "fill"] },
    },
    variant: {
      default: "corner",
      description: "Shape used for the pattern tile.",
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
          values: ["subtle", "support"],
        },
        value: { kind: "prop", prop: "tone" },
      },
    ],
  },
};
