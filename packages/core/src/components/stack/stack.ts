import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrStackAlign = "stretch" | "start" | "center" | "end";
export type ClbrStackAs = "div" | "ul";
export type ClbrStackGap = "none" | "xs" | "sm" | "md" | "lg";

export interface ClbrStackProps {
  /** Cross-axis alignment. @default "stretch" */
  align?: ClbrStackAlign;
  /** Element tag. @default "div" */
  as?: ClbrStackAs;
  /** Trusted inner HTML. */
  children?: string;
  /** Spacing gap size. @default "md" */
  gap?: ClbrStackGap;
  /** Enables layout-context responsive spacing scale. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Calibrate stack component.
 *
 * @param props - Stack component props.
 * @returns IR node for a stack wrapper.
 */
export function buildClbrStack({
  align = "stretch",
  as = "div",
  children,
  gap = "md",
  responsive,
}: ClbrStackProps): ClbrNode {
  return {
    kind: "element",
    tag: as,
    attrs: {
      class: "clbr-stack",
      "data-align": align === "stretch" ? undefined : align,
      "data-gap": gap,
      "data-responsive": responsive,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Calibrate stack component.
 *
 * @param props - Stack component props.
 * @returns HTML string for a stack wrapper.
 */
export function renderClbrStack(props: ClbrStackProps): string {
  return serializeClbrNode(buildClbrStack(props));
}

/** Declarative stack contract mirror for tooling, docs, and adapters. */
export const CLBR_STACK_SPEC: ClbrComponentSpec = {
  name: "stack",
  description: "Use `stack` to lay out content in a vertical column.",
  output: {
    element: { kind: "switch", prop: "as", cases: { div: "div", ul: "ul" } },
    class: "clbr-stack",
  },
  content: { kind: "html", prop: "children" },
  props: {
    align: {
      default: "stretch",
      description: "Aligns items on the cross axis.",
      type: { kind: "enum", values: ["stretch", "start", "center", "end"] },
    },
    as: {
      default: "div",
      description: "Element tag to render. `ul` children must be `<li>`.",
      type: { kind: "enum", values: ["div", "ul"] },
    },
    children: {
      description: "Items laid out in a column.",
      type: { kind: "html" },
    },
    gap: {
      default: "md",
      description: "Space between children.",
      type: { kind: "enum", values: ["none", "xs", "sm", "md", "lg"] },
    },
    responsive: {
      default: false,
      description: "Scales spacing across breakpoints.",
      type: { kind: "boolean" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: {
          kind: "when-in",
          prop: "align",
          values: ["start", "center", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-gap",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "gap" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
      },
    ],
  },
};
