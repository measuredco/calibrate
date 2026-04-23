import { attrs } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrAlign } from "../../types";

export type ClbrInlineAs = "div" | "ul";
export type ClbrInlineGap = "2xs" | "xs" | "sm" | "md" | "lg";
export type ClbrInlineJustify = "start" | "center" | "end" | "between";

export interface ClbrInlineProps {
  /** Element tag. @default "div" */
  as?: ClbrInlineAs;
  /** Cross-axis alignment. @default "center" */
  align?: ClbrAlign;
  /** Trusted inner HTML. */
  children?: string;
  /** Spacing gap size. @default "md" */
  gap?: ClbrInlineGap;
  /** Main-axis distribution. @default "start" */
  justify?: ClbrInlineJustify;
  /** Prevents wrapping of inline children. */
  nowrap?: boolean;
}

/**
 * SSR renderer for the Calibrate inline component.
 *
 * @param props - Inline component props.
 * @returns HTML string for an inline wrapper.
 */
export function renderClbrInline({
  align = "center",
  as = "div",
  children,
  gap = "md",
  justify = "start",
  nowrap,
}: ClbrInlineProps): string {
  const inlineAttrs = attrs({
    class: "clbr-inline",
    "data-align": align === "center" ? undefined : align,
    "data-gap": gap,
    "data-justify": justify === "start" ? undefined : justify,
    "data-nowrap": nowrap,
  });

  return `<${as} ${inlineAttrs}>${children ?? ""}</${as}>`;
}

/** Declarative inline contract mirror for tooling, docs, and adapters. */
export const CLBR_INLINE_SPEC: ClbrComponentSpec = {
  name: "inline",
  description: "Use `inline` to lay out content in a horizontal row.",
  output: {
    element: { kind: "switch", prop: "as", cases: { div: "div", ul: "ul" } },
    class: "clbr-inline",
  },
  content: { kind: "html", prop: "children" },
  props: {
    as: {
      default: "div",
      description: "Element tag to render. `ul` children must be `<li>`.",
      type: { kind: "enum", values: ["div", "ul"] },
    },
    align: {
      default: "center",
      description: "Aligns items on the cross axis.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    children: {
      description: "Items laid out in a row.",
      type: { kind: "html" },
    },
    gap: {
      default: "md",
      description: "Space between children.",
      type: { kind: "enum", values: ["2xs", "xs", "sm", "md", "lg"] },
    },
    justify: {
      default: "start",
      description: "Distributes items along the main axis.",
      type: { kind: "enum", values: ["start", "center", "end", "between"] },
    },
    nowrap: {
      description: "Prevents items from wrapping onto new lines.",
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
          values: ["start", "end"],
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
        attribute: "data-justify",
        condition: {
          kind: "when-in",
          prop: "justify",
          values: ["center", "end", "between"],
        },
        value: { kind: "prop", prop: "justify" },
      },
      {
        target: { on: "host" },
        attribute: "data-nowrap",
        condition: { kind: "when-truthy", prop: "nowrap" },
      },
    ],
  },
};
