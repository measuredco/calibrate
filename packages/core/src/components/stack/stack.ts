import { attrs } from "../../helpers/html";

export type ClbrStackAlign = "stretch" | "start" | "center" | "end";
export type ClbrStackGap = "xs" | "sm" | "md" | "lg";

/** Props for the Calibrate stack renderer. */
export interface ClbrStackProps {
  /**
   * Stack cross-axis alignment.
   * @default "stretch"
   */
  align?: ClbrStackAlign;
  /**
   * Inner HTML content to render inside the stack wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Stack spacing gap size.
   * @default "md"
   */
  gap?: ClbrStackGap;
  /**
   * Enables layout-context responsive spacing scale.
   * @default false
   */
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

  return `<div ${stackAttrs}>${children ?? ""}</div>`;
}

/** Declarative stack contract mirror for tooling, docs, and adapters. */
export const CLBR_STACK_SPEC = {
  name: "stack",
  output: {
    element: "div",
  },
  props: {
    align: {
      default: "stretch",
      required: false,
      type: "enum",
      values: ["stretch", "start", "center", "end"],
    },
    children: {
      required: false,
      type: "html",
    },
    gap: {
      default: "md",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg"],
    },
    responsive: {
      default: false,
      required: false,
      type: "boolean",
    },
  },
  rules: {
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
