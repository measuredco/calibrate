import { attrs } from "../../helpers/html";
import type { ClbrTextAlign } from "../text/text";
import { renderClbrText } from "../text/text";

export type ClbrExhibitAlign = ClbrTextAlign;

/** Props for the Calibrate exhibit renderer. */
export interface ClbrExhibitProps {
  /**
   * Alignment of the exhibit within available space.
   * `start` emits no alignment attribute.
   * @default "start"
   */
  align?: ClbrExhibitAlign;
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
 * SSR renderer for the Calibrate exhibit component.
 *
 * Emits a `figure.exhibit` root containing trusted media markup followed by a
 * `figcaption` composed with `renderClbrText({ as: "span" })`.
 *
 * @param props - Exhibit component props.
 * @returns HTML string for an exhibit wrapper.
 */
export function renderClbrExhibit({
  align = "start",
  caption,
  children,
  responsive = false,
}: ClbrExhibitProps): string {
  const rootAttrs = attrs({
    class: "exhibit",
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

/** Declarative exhibit contract mirror for tooling, docs, and adapters. */
export const CLBR_EXHIBIT_SPEC = {
  name: "exhibit",
  output: {
    element: "figure",
    class: "exhibit",
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
        value: "exhibit",
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
        when: "inside figure.exhibit",
      },
      {
        behavior: "always",
        value:
          "figcaption > renderClbrText({ as: 'span', children: caption, responsive, size: 'sm' })",
        when: "inside figure.exhibit",
      },
    ],
  },
} as const;
