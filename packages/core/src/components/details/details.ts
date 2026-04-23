import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";
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
    class: "clbr-details",
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
export const CLBR_DETAILS_SPEC: ClbrStructuredSpec = {
  name: "details",
  description:
    "Use `details` to let users expand and collapse a section of content.",
  output: { element: "details", class: "clbr-details" },
  content: {
    kind: "slots",
    slots: [
      { prop: "summary", kind: "text" },
      { prop: "children", kind: "html" },
    ],
  },
  props: {
    children: {
      description: "Content revealed when the details is open.",
      type: { kind: "html" },
    },
    inlineSize: {
      default: "full",
      description: "Whether the details fills its container or shrinks to fit.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    open: {
      default: false,
      description: "Opens the details by default.",
      type: { kind: "boolean" },
    },
    summary: {
      description: "Summary shown in the toggle.",
      required: true,
      type: { kind: "text" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
      {
        target: { on: "host" },
        attribute: "open",
        condition: { kind: "when-truthy", prop: "open" },
      },
    ],
  },
};
