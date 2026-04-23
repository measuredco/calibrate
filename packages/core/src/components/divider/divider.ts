import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrDividerOrientation = "horizontal" | "vertical";
export type ClbrDividerTone = "default" | "subtle" | "brand";

export interface ClbrDividerProps {
  /** Divider orientation. @default "horizontal" */
  orientation?: ClbrDividerOrientation;
  /** Tone variant. @default "default" */
  tone?: ClbrDividerTone;
}

/**
 * Builds the IR tree for the Calibrate divider component.
 *
 * @param props - Divider component props.
 * @returns IR node for a separator element.
 */
export function buildClbrDivider({
  orientation = "horizontal",
  tone = "default",
}: ClbrDividerProps = {}): ClbrNode {
  return {
    kind: "element",
    tag: orientation === "horizontal" ? "hr" : "span",
    attrs: {
      "aria-orientation": orientation === "vertical" ? "vertical" : undefined,
      class: "clbr-divider",
      "data-tone": tone === "subtle" || tone === "brand" ? tone : undefined,
      role: orientation === "vertical" ? "separator" : undefined,
    },
    children: [],
  };
}

/**
 * SSR renderer for the Calibrate divider component.
 *
 * @param props - Divider component props.
 * @returns HTML string for a separator element.
 */
export function renderClbrDivider(props: ClbrDividerProps = {}): string {
  return serializeClbrNode(buildClbrDivider(props));
}

/** Declarative divider contract mirror for tooling, docs, and adapters. */
export const CLBR_DIVIDER_SPEC: ClbrComponentSpec = {
  name: "divider",
  description: "Use `divider` to separate sections with a rule.",
  output: {
    element: {
      kind: "switch",
      prop: "orientation",
      cases: { horizontal: "hr", vertical: "span" },
    },
    class: "clbr-divider",
  },
  content: { kind: "none" },
  props: {
    orientation: {
      default: "horizontal",
      description: "Divider orientation.",
      type: { kind: "enum", values: ["horizontal", "vertical"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "subtle", "brand"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "role",
        condition: { kind: "when-equals", prop: "orientation", to: "vertical" },
        value: { kind: "literal", text: "separator" },
      },
      {
        target: { on: "host" },
        attribute: "aria-orientation",
        condition: { kind: "when-equals", prop: "orientation", to: "vertical" },
        value: { kind: "literal", text: "vertical" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["subtle", "brand"],
        },
        value: { kind: "prop", prop: "tone" },
      },
    ],
  },
};
