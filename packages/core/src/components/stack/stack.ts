import { attrs } from "../../helpers/html";

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
 * SSR renderer for the Calibrate stack component.
 *
 * @param props - Stack component props.
 * @returns HTML string for a stack wrapper.
 */
export function renderClbrStack({
  align = "stretch",
  as = "div",
  children,
  gap = "md",
  responsive,
}: ClbrStackProps): string {
  const stackAttrs = attrs({
    class: "stack",
    "data-align": align === "stretch" ? undefined : align,
    "data-gap": gap,
    "data-responsive": responsive,
  });

  return `<${as} ${stackAttrs}>${children ?? ""}</${as}>`;
}

/** Declarative stack contract mirror for tooling, docs, and adapters. */
export const CLBR_STACK_SPEC = {
  name: "stack",
  description: "Use `stack` to lay out content in a vertical column.",
  output: {
    modes: {
      div: "div",
      list: "ul",
    },
  },
  props: {
    align: {
      default: "stretch",
      description: "Aligns items on the cross axis.",
      required: false,
      type: "enum",
      values: ["stretch", "start", "center", "end"],
    },
    as: {
      default: "div",
      description: "Element tag to render.",
      required: false,
      type: "enum",
      values: ["div", "ul"],
    },
    children: {
      description: "Items laid out in a column.",
      required: false,
      type: "html",
    },
    gap: {
      default: "md",
      description: "Space between children.",
      required: false,
      type: "enum",
      values: ["none", "xs", "sm", "md", "lg"],
    },
    responsive: {
      default: false,
      description: "Scales spacing across breakpoints.",
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
        value: "stack",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is start, center, or end",
      },
      {
        behavior: "always",
        target: "data-gap",
        value: "{gap}",
      },
      {
        behavior: "emit",
        target: "data-responsive",
        value: "present",
        when: "responsive is true",
      },
    ],
  },
} as const;
