import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";

export type ClbrTextAs = "p" | "span";
export type ClbrTextSize = "xs" | "sm" | "md" | "lg";
export type ClbrTextTone = "default" | "muted";

export interface ClbrTextProps {
  /** Text content. Supports inline markup such as `<em>`, `<strong>`, `<a>`, `<code>`, `<cite>`, etc. */
  children: string;
  /** Element tag. @default "span" */
  as?: ClbrTextAs;
  /** Text alignment. Ignored when `as` is `span`. @default "start" */
  align?: ClbrAlign;
  /** Enables visited-state styling for links inside text. @default true */
  linkVisited?: boolean;
  /** Applies max measure constraints for long-form readability. Ignored when `as` is `span`. @default true */
  measured?: boolean;
  /** Enables breakpoint-responsive body scale. @default false */
  responsive?: boolean;
  /** Text size. @default "md" */
  size?: ClbrTextSize;
  /** Tone variant. @default "default" */
  tone?: ClbrTextTone;
}

/**
 * SSR renderer for the Calibrate text component.
 *
 * @param props - Text component props.
 * @returns HTML string for a text paragraph or span element.
 */
export function renderClbrText({
  align,
  as,
  children,
  linkVisited = true,
  measured,
  responsive,
  size = "md",
  tone = "default",
}: ClbrTextProps): string {
  const tag: ClbrTextAs = as === "p" ? "p" : "span";
  const isParagraph = tag === "p";
  const resolvedAlign = isParagraph ? (align ?? "start") : undefined;
  const resolvedMeasured = isParagraph ? (measured ?? true) : undefined;

  const textAttrs = attrs({
    class: "text",
    "data-align":
      resolvedAlign && resolvedAlign !== "start" ? resolvedAlign : undefined,
    "data-link-visited": linkVisited ? undefined : "off",
    "data-measured": resolvedMeasured,
    "data-responsive": responsive,
    "data-size": size,
    "data-tone": tone === "muted" ? "muted" : undefined,
  });

  return `<${tag} ${textAttrs}>${children}</${tag}>`;
}

/** Declarative text contract mirror for tooling, docs, and adapters. */
export const CLBR_TEXT_SPEC = {
  name: "text",
  description: "Use `text` for inline or paragraph body copy.",
  output: {
    modes: {
      paragraph: "p",
      span: "span",
    },
  },
  props: {
    as: {
      default: "span",
      description: "HTML element used for the text.",
      required: false,
      type: "enum",
      values: ["p", "span"],
    },
    children: {
      description:
        "Text content. Supports inline markup such as `<em>`, `<strong>`, `<a>`, `<code>`, `<cite>`, etc.",
      required: true,
      type: "html",
    },
    linkVisited: {
      default: true,
      description: "Styles visited links inside the text.",
      required: false,
      type: "boolean",
    },
    responsive: {
      default: false,
      description: "Scales text across breakpoints.",
      required: false,
      type: "boolean",
    },
    align: {
      default: "start",
      description: "Text alignment.",
      ignoredWhen: "`as` is span",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
      when: "as is p",
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      ignoredWhen: "`as` is span",
      required: false,
      type: "boolean",
      when: "as is p",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg"],
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["default", "muted"],
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "span",
        when: "as is span or omitted (span mode)",
      },
      {
        behavior: "render-as",
        value: "p",
        when: "as is p (paragraph mode)",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "text",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "as is p and align is center or end",
      },
      {
        behavior: "emit",
        target: "data-link-visited",
        value: "off",
        when: "linkVisited is false",
      },
      {
        behavior: "emit",
        target: "data-measured",
        value: "present",
        when: "as is p and measured is true",
      },
      {
        behavior: "emit",
        target: "data-responsive",
        value: "present",
        when: "responsive is true",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "muted",
        when: "tone is muted",
      },
    ],
  },
} as const;
