import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";

export type ClbrInlineAs = "div" | "ul";
export type ClbrInlineGap = "2xs" | "xs" | "sm" | "md" | "lg";
export type ClbrInlineJustify = "start" | "center" | "end" | "between";

/** Props for the Calibrate inline renderer. */
export interface ClbrInlineProps {
  /**
   * Element tag used for inline rendering.
   * @default "div"
   */
  as?: ClbrInlineAs;
  /**
   * Inline cross-axis alignment.
   * @default "center"
   */
  align?: ClbrAlign;
  /**
   * Inner HTML content to render inside the inline wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Inline spacing gap size.
   * @default "md"
   */
  gap?: ClbrInlineGap;
  /**
   * Inline main-axis distribution.
   * @default "start"
   */
  justify?: ClbrInlineJustify;
  /**
   * Prevents wrapping of inline children when true.
   * Omitted by default.
   */
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
  output: {
    modes: {
      div: "div",
      list: "ul",
    },
  },
  props: {
    as: {
      default: "div",
      required: false,
      type: "enum",
      values: ["div", "ul"],
    },
    align: {
      default: "center",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    children: {
      required: false,
      type: "html",
    },
    gap: {
      default: "md",
      required: false,
      type: "enum",
      values: ["2xs", "xs", "sm", "md", "lg"],
    },
    justify: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end", "between"],
    },
    nowrap: {
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
