import { attrs } from "../../helpers/html";
import type { ClbrTheme } from "../root/root";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrPosterSurface = Exclude<
  ClbrSurfaceVariant,
  "inverse" | "brand-inverse"
>;

export interface ClbrPosterProps {
  /** Foreground HTML content above the image. Caller sanitizes untrusted content. */
  children?: string;
  /** Absolute theme lock for foreground content over non-themeable media. */
  contentTheme?: ClbrTheme;
  /** Background image HTML (usually `renderClbrImage(...)`). Caller sanitizes untrusted content. */
  image: string;
  /** Surface context. Emits `data-clbr-surface` when provided. */
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
    class: "clbr-poster",
    "data-clbr-content-theme": contentTheme,
    "data-clbr-surface": resolvedSurface,
  });
  const contentMarkup = children
    ? `<div class="content">${children}</div>`
    : "";

  return `<div ${posterAttrs}><div class="image-wrapper">${image}</div>${contentMarkup}</div>`;
}

/** Declarative poster contract mirror for tooling, docs, and adapters. */
export const CLBR_POSTER_SPEC = {
  name: "poster",
  description: "Use `poster` to layer content over a background image.",
  output: {
    element: "div",
    class: "clbr-poster",
    children: ["div.image-wrapper", "optional div.content"],
  },
  props: {
    children: {
      description: "Foreground content rendered over the image.",
      required: false,
      type: "html",
    },
    contentTheme: {
      description:
        "Fixed theme for foreground content over non-themeable media.",
      required: false,
      type: "enum",
      values: ["light", "dark"],
    },
    image: {
      description:
        "Background image markup, usually a calibrate image component.",
      required: true,
      type: "html",
    },
    surface: {
      description: "Surface context.",
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
        value: "clbr-poster",
      },
      {
        behavior: "emit",
        target: "data-clbr-content-theme",
        value: "{contentTheme}",
        when: "contentTheme is light or dark",
      },
      {
        behavior: "emit",
        target: "data-clbr-surface",
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
