import { attrs } from "../../helpers/html";

export type ClbrPageStickyHeader = "always" | "belowNotebook";

/** Props for the Calibrate page renderer. */
export interface ClbrPageProps {
  /**
   * Main region markup rendered inside the page-owned `<main>`.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Vertically centers the main region within the page shell.
   * Emits `data-centered` only when true.
   * @default false
   */
  centered?: boolean;
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
 * Emits a prescribed page structure with named regions for header, main, and
 * footer content. The page shell owns the outer layout wrapper and region
 * elements so the internal page layout can evolve without changing the
 * consumer-facing region contract.
 *
 * @param props - Page shell props.
 * @returns HTML string for a page wrapper.
 */
export function renderClbrPage({
  children,
  centered,
  footer,
  header,
  stickyHeader,
}: ClbrPageProps): string {
  const pageAttrs = attrs({
    class: "page",
    "data-centered": centered,
    "data-sticky-header": stickyHeader,
  });

  return `<div ${pageAttrs}><header class="header">${header}</header><main class="main">${children ?? ""}</main><footer class="footer">${footer}</footer></div>`;
}

/** Declarative page contract mirror for tooling, docs, and adapters. */
export const CLBR_PAGE_SPEC = {
  name: "page",
  output: {
    element: "div",
    class: "page",
    children: ["header.header", "main.main", "footer.footer"],
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    centered: {
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
        target: "data-centered",
        value: "present",
        when: "centered is true",
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
