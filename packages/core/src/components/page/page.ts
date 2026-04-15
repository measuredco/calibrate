import { attrs } from "../../helpers/html";

export type ClbrPageStickyHeader = "always" | "belowNotebook";

/** Props for the Calibrate page renderer. */
export interface ClbrPageProps {
  /**
   * Optional banner region markup rendered before the page header.
   * Caller is responsible for sanitizing untrusted content.
   */
  banner?: string;
  /**
   * Centers the main region within the page shell.
   * Emits `data-center-main` only when true.
   * @default false
   */
  centerMain?: boolean;
  /**
   * Main region markup rendered inside the page-owned `<main>`.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Header region markup.
   * Typically composed from existing layout and content primitives.
   * Caller is responsible for sanitizing untrusted content.
   */
  header: string;
  /**
   * Sticky header behavior.
   * `always` keeps the header sticky at all breakpoints.
   * `belowNotebook` keeps the header sticky until notebook width and above.
   * Emits `data-sticky-header` when provided.
   */
  stickyHeader?: ClbrPageStickyHeader;
  /**
   * Footer region markup.
   * Typically composed from existing layout and content primitives.
   * Caller is responsible for sanitizing untrusted content.
   */
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
    class: "page",
    "data-center-main": centerMain,
    "data-sticky-header": stickyHeader,
  });

  return `<div ${pageAttrs}>${banner ?? ""}<header class="header">${header}</header><main class="main">${children ?? ""}</main><footer class="footer">${footer}</footer></div>`;
}

/** Declarative page contract mirror for tooling, docs, and adapters. */
export const CLBR_PAGE_SPEC = {
  name: "page",
  output: {
    element: "div",
    class: "page",
    children: [
      "optional {banner}",
      "header.header",
      "main.main",
      "footer.footer",
    ],
  },
  props: {
    banner: {
      required: false,
      type: "html",
    },
    children: {
      required: false,
      type: "html",
    },
    centerMain: {
      default: false,
      required: false,
      type: "boolean",
    },
    header: {
      required: true,
      type: "html",
    },
    stickyHeader: {
      required: false,
      type: "enum",
      values: ["always", "belowNotebook"],
    },
    footer: {
      required: true,
      type: "html",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "page",
      },
      {
        behavior: "emit",
        target: "data-center-main",
        value: "present",
        when: "centerMain is true",
      },
      {
        behavior: "emit",
        target: "data-sticky-header",
        value: "{stickyHeader}",
        when: "stickyHeader is always or belowNotebook",
      },
    ],
    composition: [
      {
        behavior: "emit",
        value: "{banner}",
        when: "banner is provided",
      },
      {
        behavior: "always",
        value: "header.header",
      },
      {
        behavior: "always",
        value: "main.main",
      },
      {
        behavior: "always",
        value: "footer.footer",
      },
    ],
  },
} as const;
