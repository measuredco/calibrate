import { attrs } from "../../helpers/html";
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
    class: "inline",
    "data-align": align === "center" ? undefined : align,
    "data-gap": gap,
    "data-justify": justify === "start" ? undefined : justify,
    "data-nowrap": nowrap,
  });

  return `<${as} ${inlineAttrs}>${children ?? ""}</${as}>`;
}

/** Declarative inline contract mirror for tooling, docs, and adapters. */
export const CLBR_INLINE_SPEC = {
  name: "inline",
  description: "Use `inline` to lay out content in a horizontal row.",
  output: {
    modes: {
      div: "div",
      list: "ul",
    },
  },
  props: {
    as: {
      default: "div",
      description: "Element tag to render.",
      required: false,
      type: "enum",
      values: ["div", "ul"],
    },
    align: {
      default: "center",
      description: "Aligns items on the cross axis.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    children: {
      description: "Items laid out in a row.",
      required: false,
      type: "html",
    },
    gap: {
      default: "md",
      description: "Space between children.",
      required: false,
      type: "enum",
      values: ["2xs", "xs", "sm", "md", "lg"],
    },
    justify: {
      default: "start",
      description: "Distributes items along the main axis.",
      required: false,
      type: "enum",
      values: ["start", "center", "end", "between"],
    },
    nowrap: {
      description: "Prevents items from wrapping onto new lines.",
      required: false,
      type: "boolean",
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "div",
        when: "as is div or omitted",
      },
      {
        behavior: "render-as",
        value: "ul",
        when: "as is ul",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "inline",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is start or end",
      },
      {
        behavior: "always",
        target: "data-gap",
        value: "{gap}",
      },
      {
        behavior: "emit",
        target: "data-justify",
        value: "{justify}",
        when: "justify is center, end, or between",
      },
      {
        behavior: "emit",
        target: "data-nowrap",
        value: "present",
        when: "nowrap is true",
      },
    ],
  },
} as const;
