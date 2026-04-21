import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrInlineSize } from "../../types";
import { renderClbrIcon } from "../icon/icon";

export interface ClbrDetailsProps {
  /** Content markup inside the details panel. Caller sanitizes untrusted content. */
  children?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
  /** Whether the details is initially open. @default false */
  open?: boolean;
  /** Summary text content. Escaped before render. */
  summary: string;
}

/**
 * SSR renderer for the Calibrate details component.
 *
 * Emits native `<details>`/`<summary>` markup with trusted HTML content in a
 * `.content` wrapper, and a decorative chevron icon marker in the summary.
 *
 * @param props - Details component props.
 * @returns HTML string for a details element.
 */
export function renderClbrDetails({
  children,
  open,
  summary,
  inlineSize = "full",
}: ClbrDetailsProps): string {
  const detailsAttrs = attrs({
    class: "details",
    open,
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
  });

  const marker = renderClbrIcon({
    ariaHidden: true,
    name: "chevron-right",
    size: "sm",
  });

  return `<details ${detailsAttrs}><summary class="summary"><span class="marker">${marker}</span><span>${escapeHtml(summary)}</span></summary><div class="content">${children ?? ""}</div></details>`;
}

/** Declarative details contract mirror for tooling, docs, and adapters. */
export const CLBR_DETAILS_SPEC = {
  name: "details",
  description:
    "Use `details` to let users expand and collapse a section of content.",
  output: {
    element: "details",
  },
  props: {
    children: {
      description: "Content revealed when the details is open.",
      required: false,
      type: "html",
    },
    inlineSize: {
      default: "full",
      description: "Whether the details fills its container or shrinks to fit.",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
    open: {
      default: false,
      description: "Opens the details by default.",
      required: false,
      type: "boolean",
    },
    summary: {
      description: "Summary shown in the toggle.",
      required: true,
      type: "string",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "details",
      },
      {
        behavior: "emit",
        target: "data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
      },
      {
        behavior: "emit",
        when: "open is true",
        target: "open",
        value: "present",
      },
    ],
    children: [
      {
        behavior: "always",
        target: "summary.summary",
      },
      {
        behavior: "always",
        target: "summary.summary > span.marker",
      },
      {
        behavior: "always",
        target: "summary.summary > span.marker > svg.icon",
      },
      {
        behavior: "always",
        target: "div.content",
      },
    ],
    content: [
      {
        behavior: "escape-html",
        target: "summary",
      },
      {
        behavior: "trusted-html",
        target: "children",
      },
    ],
  },
} as const;
