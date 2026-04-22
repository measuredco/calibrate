import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrHeadingLevel } from "../../types";
import { renderClbrIcon } from "../icon/icon";
import type { ClbrSurfaceVariant } from "../surface/surface";

export interface ClbrCardProps {
  /** Description HTML content. Caller sanitizes untrusted content. */
  description: string;
  /** Optional heading level for the title. Omit to render a `div.title`. */
  headingLevel?: ClbrHeadingLevel;
  /** Optional link destination for the title. Adds a trailing arrow icon when `note` is also provided. */
  href?: string;
  /** Optional note HTML content. Caller sanitizes untrusted content. */
  note?: string;
  /** Surface context. Emits `data-clbr-surface` when provided. */
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
  const rootAttrs = attrs({ class: "card", "data-clbr-surface": surface });
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
  description: "Use `card` to display a summary for a single topic.",
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
      description: "Supporting description shown below the `title`.",
      required: true,
      type: "html",
    },
    headingLevel: {
      description:
        "Semantic heading level for the title. Renders a `<div>` when omitted.",
      required: false,
      type: "enum",
      values: [1, 2, 3, 4, 5, 6],
    },
    href: {
      description: "Link destination for the `title`.",
      required: false,
      type: "string",
    },
    note: {
      description: "Short note shown beneath the `description`.",
      required: false,
      type: "html",
    },
    surface: {
      description: "Surface context.",
      required: false,
      type: "enum",
      values: ["default", "brand", "inverse", "brand-inverse"],
    },
    title: {
      description: "Card title.",
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
        target: "data-clbr-surface",
        value: "{surface}",
        when: "surface is provided",
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
