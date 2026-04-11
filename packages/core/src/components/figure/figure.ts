import { attrs } from "../../helpers/html";
import type { ClbrTextAlign } from "../text/text";
import { renderClbrText } from "../text/text";

export type ClbrFigureAlign = ClbrTextAlign;

/** Props for the Calibrate figure renderer. */
export interface ClbrFigureProps {
  /**
   * Alignment of the figure within available space.
   * `start` emits no alignment attribute.
   * @default "start"
   */
  align?: ClbrFigureAlign;
  /**
   * Caption HTML content.
   * Caller is responsible for sanitizing untrusted content.
   */
  caption: string;
  /**
   * Media/content to present.
   * Typically `renderClbrImage(...)` output.
   * Caller is responsible for sanitizing untrusted content.
   */
  children: string;
  /**
   * Enables breakpoint-responsive type sizing for the caption.
   * Passed through to the composed caption text element.
   * @default false
   */
  responsive?: boolean;
}

/**
 * SSR renderer for the Calibrate figure component.
 *
 * Emits a `figure.figure` root containing trusted media markup followed by a
 * `figcaption` composed with `renderClbrText({ as: "span" })`.
 *
 * @param props - Figure component props.
 * @returns HTML string for a figure wrapper.
 */
export function renderClbrFigure({
  align = "start",
  caption,
  children,
  responsive = false,
}: ClbrFigureProps): string {
  const rootAttrs = attrs({
    class: "figure",
    "data-align": align === "start" ? undefined : align,
  });
  const captionMarkup = `<figcaption>${renderClbrText({
    as: "span",
    children: caption,
    responsive,
    size: "sm",
  })}</figcaption>`;

  return `<figure ${rootAttrs}>${children}${captionMarkup}</figure>`;
}

/** Declarative figure contract mirror for tooling, docs, and adapters. */
export const CLBR_FIGURE_SPEC = {
  name: "figure",
  output: {
    element: "figure",
    class: "figure",
    children: [
      "trusted media HTML",
      "figcaption > renderClbrText({ as: 'span', children: caption, size: 'sm' })",
    ],
  },
  props: {
    align: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    caption: {
      required: true,
      type: "html",
    },
    children: {
      required: true,
      type: "html",
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
        value: "figure",
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
        value: "trusted media HTML",
        when: "inside figure.figure",
      },
      {
        behavior: "always",
        value:
          "figcaption > renderClbrText({ as: 'span', children: caption, responsive, size: 'sm' })",
        when: "inside figure.figure",
      },
    ],
  },
} as const;
