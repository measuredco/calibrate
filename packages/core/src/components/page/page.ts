import { attrs } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrPageStickyHeader = "always" | "belowNotebook";

export interface ClbrPageProps {
  /** Optional banner region markup rendered before the header. Caller sanitizes untrusted content. */
  banner?: string;
  /** Centers the main region within the page shell. Emits `data-center-main` only when true. @default false */
  centerMain?: boolean;
  /** Main region markup rendered inside the page-owned `<main>`. Caller sanitizes untrusted content. */
  children?: string;
  /** Header region markup. Caller sanitizes untrusted content. */
  header: string;
  /** Sticky header behavior. Emits `data-sticky-header` when provided. */
  stickyHeader?: ClbrPageStickyHeader;
  /** Footer region markup. Caller sanitizes untrusted content. */
  footer: string;
}

/**
 * SSR renderer for the Calibrate page shell.
 *
 * Emits a prescribed page structure with an optional banner region followed by
 * header, main, and footer content. The page shell owns the outer layout
 * wrapper and region elements so the internal page layout can evolve without
 * changing the consumer-facing region contract.
 *
 * @param props - Page shell props.
 * @returns HTML string for a page wrapper.
 */
export function renderClbrPage({
  banner,
  centerMain,
  children,
  footer,
  header,
  stickyHeader,
}: ClbrPageProps): string {
  const pageAttrs = attrs({
    class: "clbr-page",
    "data-center-main": centerMain,
    "data-sticky-header": stickyHeader,
  });

  return `<div ${pageAttrs}>${banner ?? ""}<header class="header">${header}</header><main class="main">${children ?? ""}</main><footer class="footer">${footer}</footer></div>`;
}

/** Declarative page contract mirror for tooling, docs, and adapters. */
export const CLBR_PAGE_SPEC: ClbrComponentSpec = {
  name: "page",
  description:
    "Use `page` as the primary layout for header, main, and footer regions.",
  output: { element: "div", class: "clbr-page" },
  content: {
    kind: "slots",
    slots: [
      { prop: "banner", kind: "html" },
      { prop: "header", kind: "html" },
      { prop: "children", kind: "html" },
      { prop: "footer", kind: "html" },
    ],
  },
  props: {
    banner: {
      description: "Banner rendered above the header.",
      type: { kind: "html" },
    },
    children: {
      description: "Main content of the page.",
      type: { kind: "html" },
    },
    centerMain: {
      default: false,
      description: "Centers the main region within the page shell.",
      type: { kind: "boolean" },
    },
    header: {
      description: "Header content.",
      required: true,
      type: { kind: "html" },
    },
    stickyHeader: {
      description: "When the header stays stuck to the top of the viewport.",
      type: { kind: "enum", values: ["always", "belowNotebook"] },
    },
    footer: {
      description: "Footer content.",
      required: true,
      type: { kind: "html" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-center-main",
        condition: { kind: "when-truthy", prop: "centerMain" },
      },
      {
        target: { on: "host" },
        attribute: "data-sticky-header",
        condition: { kind: "when-provided", prop: "stickyHeader" },
        value: { kind: "prop", prop: "stickyHeader" },
      },
    ],
  },
};
