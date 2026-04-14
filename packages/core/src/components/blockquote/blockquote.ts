import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";
import { renderClbrText } from "../text/text";

export type ClbrBlockquoteSize = "md" | "lg";

/** Props for the Calibrate blockquote renderer. */
export interface ClbrBlockquoteProps {
  /**
   * Text alignment for the blockquote.
   * Applied to the root wrapper and passed through to the composed quote paragraph.
   * `start` emits no root alignment attribute.
   * @default "start"
   */
  align?: ClbrAlign;
  /**
   * Attribution HTML content.
   * Caller is responsible for sanitizing untrusted content.
   */
  attribution: string;
  /**
   * Applies max measure constraints to the composed quote paragraph.
   * Passed through to the quote `renderClbrText({ as: "p" })` call.
   * @default true
   */
  measured?: boolean;
  /**
   * Quote HTML content.
   * Caller is responsible for sanitizing untrusted content.
   */
  quote: string;
  /**
   * Enables breakpoint-responsive type sizing.
   * Passed through to both composed text elements.
   * @default false
   */
  responsive?: boolean;
  /**
   * Blockquote size.
   * Passed through to the composed quote paragraph.
   * Attribution always renders at `sm`.
   * @default "md"
   */
  size?: ClbrBlockquoteSize;
}

/**
 * SSR renderer for the Calibrate blockquote component.
 *
 * Emits a `figure.blockquote` root containing semantic `blockquote` and
 * `figcaption` wrappers, with typography delegated to `renderClbrText`.
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
    class: "blockquote",
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
  output: {
    element: "figure",
    class: "blockquote",
    children: [
      "blockquote.quote > renderClbrText({ as: 'p', align, children: quote, measured, responsive, size })",
      "figcaption.attribution > renderClbrText({ as: 'span', children: attribution, responsive, size: 'sm' })",
    ],
  },
  props: {
    align: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    attribution: {
      required: true,
      type: "html",
    },
    measured: {
      default: true,
      required: false,
      type: "boolean",
    },
    quote: {
      required: true,
      type: "html",
    },
    responsive: {
      default: false,
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
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
        value: "blockquote",
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
