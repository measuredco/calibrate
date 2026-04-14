import { attrs } from "../../helpers/html";
import type { ClbrTheme } from "../root/root";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrPosterSurface = Exclude<
  ClbrSurfaceVariant,
  "inverse" | "brand-inverse"
>;

/** Props for the Calibrate poster renderer. */
export interface ClbrPosterProps {
  /**
   * Foreground HTML content rendered above the image layer.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Absolute theme lock for foreground content over non-themeable media.
   * When provided, emits `data-content-theme` and ensures a default
   * `data-surface="default"` is present when no explicit surface is set.
   */
  contentTheme?: ClbrTheme;
  /**
   * Background image HTML content.
   * Usually `renderClbrImage(...)` output.
   * Caller is responsible for sanitizing untrusted content.
   */
  image: string;
  /**
   * Surface context.
   * When provided, emits `data-surface`.
   */
  surface?: ClbrPosterSurface;
}

/**
 * SSR renderer for the Calibrate poster component.
 *
 * Emits a single `div.poster` root containing an image wrapper behind optional
 * trusted foreground content. `contentTheme`, when provided, is an absolute
 * local foreground theme override intended for poster-like content over
 * non-themeable media.
 *
 * @param props - Poster component props.
 * @returns HTML string for a poster container.
 */
export function renderClbrPoster({
  children,
  contentTheme,
  image,
  surface,
}: ClbrPosterProps): string {
  const resolvedSurface = contentTheme ? (surface ?? "default") : surface;
  const posterAttrs = attrs({
    class: "poster",
    "data-content-theme": contentTheme,
    "data-surface": resolvedSurface,
  });
  const contentMarkup = children
    ? `<div class="content">${children}</div>`
    : "";

  return `<div ${posterAttrs}><div class="image-wrapper">${image}</div>${contentMarkup}</div>`;
}

/** Declarative poster contract mirror for tooling, docs, and adapters. */
export const CLBR_POSTER_SPEC = {
  name: "poster",
  output: {
    element: "div",
    class: "poster",
    children: ["div.image-wrapper", "optional div.content"],
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    contentTheme: {
      required: false,
      type: "enum",
      values: ["light", "dark"],
    },
    image: {
      required: true,
      type: "html",
    },
    surface: {
      required: false,
      type: "enum",
      values: ["default", "brand"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "poster",
      },
      {
        behavior: "emit",
        target: "data-content-theme",
        value: "{contentTheme}",
        when: "contentTheme is light or dark",
      },
      {
        behavior: "emit",
        target: "data-surface",
        value: "{resolvedSurface}",
        when: "surface is provided or contentTheme is provided (defaulting to default when only contentTheme is set)",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "div.image-wrapper",
      },
      {
        behavior: "always",
        value: "trusted image HTML",
        when: "inside div.image-wrapper",
      },
      {
        behavior: "emit",
        value: "div.content",
        when: "children are provided",
      },
    ],
  },
} as const;
