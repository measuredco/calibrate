import { attrs } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrAlign } from "../../types";
import { renderClbrText } from "../text/text";

export type ClbrBlockquoteSize = "md" | "lg";

export interface ClbrBlockquoteProps {
  /** Text alignment. @default "start" */
  align?: ClbrAlign;
  /** Trusted attribution HTML. */
  attribution: string;
  /** Applies max measure constraints for long-form readability. @default true */
  measured?: boolean;
  /** Trusted quote HTML. */
  quote: string;
  /** Enables breakpoint-responsive type sizing. @default false */
  responsive?: boolean;
  /** Quote size. @default "md" */
  size?: ClbrBlockquoteSize;
}

/**
 * SSR renderer for the Calibrate blockquote component.
 *
 * @param props - Blockquote component props.
 * @returns HTML string for a blockquote wrapper.
 */
export function renderClbrBlockquote({
  align = "start",
  attribution,
  measured = true,
  quote,
  responsive = false,
  size = "md",
}: ClbrBlockquoteProps): string {
  const rootAttrs = attrs({
    class: "clbr-blockquote",
    "data-align": align === "start" ? undefined : align,
  });

  const quoteMarkup = renderClbrText({
    align,
    as: "p",
    children: quote,
    measured,
    responsive,
    size,
  });

  const attributionMarkup = renderClbrText({
    as: "span",
    children: attribution,
    responsive,
    size: "sm",
  });

  return `<figure ${rootAttrs}><blockquote class="quote">${quoteMarkup}</blockquote><figcaption class="attribution">${attributionMarkup}</figcaption></figure>`;
}

/** Declarative blockquote contract mirror for tooling, docs, and adapters. */
export const CLBR_BLOCKQUOTE_SPEC: ClbrComponentSpec = {
  name: "blockquote",
  description: "Use `blockquote` to display a quote with attribution.",
  output: { element: "figure", class: "clbr-blockquote" },
  content: {
    kind: "slots",
    slots: [
      { prop: "quote", kind: "html" },
      { prop: "attribution", kind: "html" },
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    attribution: {
      description:
        "Attribution shown beneath the quote. Supports inline markup such as `<a>`, `<cite>`, `<em>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      type: { kind: "boolean" },
    },
    quote: {
      description:
        "Quote content. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    responsive: {
      default: false,
      description: "Scales type across breakpoints.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant for the quote.",
      type: { kind: "enum", values: ["md", "lg"] },
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
          values: ["center", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
    ],
  },
};
