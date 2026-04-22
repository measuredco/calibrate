import { attrs } from "../../helpers/html";
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
export const CLBR_BLOCKQUOTE_SPEC = {
  name: "blockquote",
  description: "Use `blockquote` to display a quote with attribution.",
  output: {
    element: "figure",
    class: "clbr-blockquote",
    children: [
      "blockquote.quote > renderClbrText({ as: 'p', align, children: quote, measured, responsive, size })",
      "figcaption.attribution > renderClbrText({ as: 'span', children: attribution, responsive, size: 'sm' })",
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Text alignment.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    attribution: {
      description:
        "Attribution shown beneath the quote. Supports inline markup such as `<a>`, `<cite>`, `<em>`, etc.",
      required: true,
      type: "html",
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      required: false,
      type: "boolean",
    },
    quote: {
      description:
        "Quote content. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: "html",
    },
    responsive: {
      default: false,
      description: "Scales type across breakpoints.",
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
      description: "Size variant for the quote.",
      required: false,
      type: "enum",
      values: ["md", "lg"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-blockquote",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is center or end",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "blockquote.quote",
      },
      {
        behavior: "always",
        value:
          "renderClbrText({ as: 'p', align, children: quote, measured, responsive, size })",
        when: "inside blockquote.quote element",
      },
      {
        behavior: "always",
        value:
          "renderClbrText({ as: 'span', children: attribution, responsive, size: 'sm' })",
        when: "inside figcaption.attribution element",
      },
    ],
  },
} as const;
