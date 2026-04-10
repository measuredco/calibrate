import { attrs, escapeHtml } from "../../helpers/html";
import { renderClbrIcon } from "../icon/icon";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrCardHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Props for the Calibrate card renderer. */
export interface ClbrCardProps {
  /**
   * Description HTML content.
   * Caller is responsible for sanitizing untrusted content.
   */
  description: string;
  /**
   * Optional heading level for the title.
   * When omitted, title is rendered in a `div.title`.
   */
  headingLevel?: ClbrCardHeadingLevel;
  /**
   * Optional link destination for the title.
   * When provided, title is rendered as a link and note includes a trailing
   * decorative arrow icon when note content is also present.
   */
  href?: string;
  /**
   * Optional note HTML content.
   * Caller is responsible for sanitizing untrusted content.
   */
  note?: string;
  /**
   * Surface context.
   * When provided, emits `data-surface`.
   */
  surface?: ClbrSurfaceVariant;
  /** Card title text content (escaped before render). */
  title: string;
}

/**
 * SSR renderer for the Calibrate card component.
 *
 * Emits a `div.card` root with decorative dots, a title, supporting description,
 * and optional note. When `href` is provided, the title becomes a link; when
 * both `href` and `note` are provided, the note includes a trailing decorative
 * arrow icon.
 *
 * @param props - Card component props.
 * @returns HTML string for a card wrapper.
 */
export function renderClbrCard({
  description,
  headingLevel,
  href,
  note,
  surface,
  title,
}: ClbrCardProps): string {
  const rootAttrs = attrs({ class: "card", "data-surface": surface });
  const headingTag = headingLevel ? `h${headingLevel}` : `div`;
  const titleMarkup = href
    ? `<a href="${escapeHtml(href)}">${escapeHtml(title)}</a>`
    : escapeHtml(title);
  const descriptionMarkup = `<p class="description">${description}</p>`;
  const noteMarkup = note
    ? `<p class="note">${note}${
        href
          ? `<span class="icon-wrapper">${renderClbrIcon({
              ariaHidden: true,
              mirrored: "rtl",
              name: "arrow-right",
              size: "xs",
            })}</span>`
          : ""
      }</p>`
    : "";

  return `<div ${rootAttrs}><span class="dots"><span></span></span><${headingTag} class="title">${titleMarkup}</${headingTag}>${descriptionMarkup}${noteMarkup}</div>`;
}

/** Declarative card contract mirror for tooling, docs, and adapters. */
export const CLBR_CARD_SPEC = {
  name: "card",
  output: {
    element: "div",
    class: "card",
    children: [
      "span.dots",
      "div.title or h{headingLevel}.title",
      "p.description",
      "optional p.note",
    ],
  },
  props: {
    description: {
      required: true,
      type: "html",
    },
    headingLevel: {
      required: false,
      type: "enum",
      values: [1, 2, 3, 4, 5, 6],
    },
    href: {
      required: false,
      type: "string",
    },
    note: {
      required: false,
      type: "html",
    },
    surface: {
      required: false,
      type: "enum",
      values: ["default", "brand"],
    },
    title: {
      required: true,
      type: "text",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "card",
      },
      {
        behavior: "emit",
        target: "data-surface",
        value: "{surface}",
        when: "surface is default or brand",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "p.description",
        when: "after the heading",
      },
      {
        behavior: "emit",
        value: "p.note",
        when: "note is provided",
      },
      {
        behavior: "emit",
        value:
          "span.icon-wrapper > renderClbrIcon({ name: 'arrow-right', size: 'xs', mirrored: 'rtl', ariaHidden: true })",
        when: "href and note are provided",
      },
    ],
  },
} as const;
