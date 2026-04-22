import { attrs } from "../../helpers/html";

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
    class: "page",
    "data-center-main": centerMain,
    "data-sticky-header": stickyHeader,
  });

  return `<div ${pageAttrs}>${banner ?? ""}<header class="header">${header}</header><main class="main">${children ?? ""}</main><footer class="footer">${footer}</footer></div>`;
}

/** Declarative page contract mirror for tooling, docs, and adapters. */
export const CLBR_PAGE_SPEC = {
  name: "page",
  description:
    "Use `page` as the primary layout for header, main, and footer regions.",
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
      description: "Banner rendered above the header.",
      required: false,
      type: "html",
    },
    children: {
      description: "Main content of the page.",
      required: false,
      type: "html",
    },
    centerMain: {
      default: false,
      description: "Centers the main region within the page shell.",
      required: false,
      type: "boolean",
    },
    header: {
      description: "Header content.",
      required: true,
      type: "html",
    },
    stickyHeader: {
      description: "When the header stays stuck to the top of the viewport.",
      required: false,
      type: "enum",
      values: ["always", "belowNotebook"],
    },
    footer: {
      description: "Footer content.",
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
