import { attrs } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";
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
    class: "clbr-text",
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
export const CLBR_TEXT_SPEC: ClbrStructuredSpec = {
  name: "text",
  description: "Use `text` for inline or paragraph body copy.",
  output: {
    element: { kind: "switch", prop: "as", cases: { p: "p", span: "span" } },
    class: "clbr-text",
  },
  content: { kind: "html", prop: "children" },
  props: {
    as: {
      default: "span",
      description: "HTML element used for the text.",
      type: { kind: "enum", values: ["p", "span"] },
    },
    children: {
      description:
        "Text content. Supports inline markup such as `<em>`, `<strong>`, `<a>`, `<code>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    linkVisited: {
      default: true,
      description: "Styles visited links inside the text.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales text across breakpoints.",
      type: { kind: "boolean" },
    },
    align: {
      default: "start",
      description: "Text alignment.",
      ignoredWhen: "`as` is span",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      ignoredWhen: "`as` is span",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "muted"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "as", to: "p" },
            { kind: "when-in", prop: "align", values: ["center", "end"] },
          ],
        },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-link-visited",
        condition: { kind: "when-equals", prop: "linkVisited", to: false },
        value: { kind: "literal", text: "off" },
      },
      {
        target: { on: "host" },
        attribute: "data-measured",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "as", to: "p" },
            { kind: "when-truthy", prop: "measured" },
          ],
        },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
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
        condition: { kind: "when-equals", prop: "tone", to: "muted" },
        value: { kind: "literal", text: "muted" },
      },
    ],
  },
};
