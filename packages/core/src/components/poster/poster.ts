import { attrs } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";
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
export const CLBR_POSTER_SPEC: ClbrStructuredSpec = {
  name: "poster",
  description: "Use `poster` to layer content over a background image.",
  output: { element: "div", class: "clbr-poster" },
  content: {
    kind: "slots",
    slots: [
      { prop: "image", kind: "html" },
      { prop: "children", kind: "html" },
    ],
  },
  props: {
    children: {
      description: "Foreground content rendered over the image.",
      type: { kind: "html" },
    },
    contentTheme: {
      description:
        "Fixed theme for foreground content over non-themeable media.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
    image: {
      description:
        "Background image markup, usually a calibrate image component.",
      required: true,
      type: { kind: "html" },
    },
    surface: {
      description: "Surface context.",
      type: { kind: "enum", values: ["default", "brand"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-clbr-content-theme",
        condition: { kind: "when-provided", prop: "contentTheme" },
        value: { kind: "prop", prop: "contentTheme" },
      },
      {
        target: { on: "host" },
        attribute: "data-clbr-surface",
        condition: {
          kind: "all",
          of: [
            { kind: "when-provided", prop: "contentTheme" },
            { kind: "not", of: { kind: "when-provided", prop: "surface" } },
          ],
        },
        value: { kind: "literal", text: "default" },
      },
      {
        target: { on: "host" },
        attribute: "data-clbr-surface",
        condition: { kind: "when-provided", prop: "surface" },
        value: { kind: "prop", prop: "surface" },
      },
    ],
  },
};
