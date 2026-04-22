import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";
import { renderClbrText } from "../text/text";

export interface ClbrFigureProps {
  /** Alignment within available space. @default "start" */
  align?: ClbrAlign;
  /** Trusted caption HTML. */
  caption: string;
  /** Trusted media HTML (typically a `renderClbrImage` result). */
  children: string;
  /** Enables breakpoint-responsive type sizing for the caption. @default false */
  responsive?: boolean;
}

/**
 * SSR renderer for the Calibrate figure component.
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
    class: "clbr-figure",
    "data-align": align === "start" ? undefined : align,
  });
  const captionMarkup = `<figcaption class="figcaption">${renderClbrText({
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
  description: "Use `figure` to present media with a caption.",
  output: {
    element: "figure",
    class: "clbr-figure",
    children: [
      "trusted media HTML",
      "figcaption.figcaption > renderClbrText({ as: 'span', children: caption, size: 'sm' })",
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Alignment within available space.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    caption: {
      description:
        "Caption shown below the media. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: "html",
    },
    children: {
      description: "Media rendered inside the figure.",
      required: true,
      type: "html",
    },
    responsive: {
      default: false,
      description: "Scales the caption across breakpoints.",
      required: false,
      type: "boolean",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-figure",
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
          "figcaption.figcaption > renderClbrText({ as: 'span', children: caption, responsive, size: 'sm' })",
        when: "inside figure.figure",
      },
    ],
  },
} as const;
