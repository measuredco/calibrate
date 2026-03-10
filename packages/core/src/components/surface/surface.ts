export type ClbrSurfaceVariant = "default" | "brand";

/**
 * Props for the Calibrate surface renderer.
 */
export interface ClbrSurfaceProps {
  /** Inner HTML content to render inside the surface wrapper. */
  children: string;
  /**
   * Surface variant applied to the wrapper.
   * @default "default"
   */
  variant?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate surface wrapper.
 *
 * Emits a `<div>` with `surface` and a `data-variant` attribute, then injects
 * the provided HTML content inside.
 *
 * @param props - Surface wrapper configuration and inner HTML content.
 * @returns HTML string for the Calibrate surface wrapper.
 */
export function renderClbrSurface(props: ClbrSurfaceProps): string {
  const { children, variant = "default" } = props;

  const classAttr = "surface";
  const variantAttr = ` data-variant="${variant}"`;

  return `<div class="${classAttr}"${variantAttr}>${children}</div>`;
}

/** Declarative surface contract mirror for tooling, docs, and adapters. */
export const CLBR_SURFACE_SPEC = {
  name: "surface",
  output: {
    element: "div",
  },
  props: {
    children: {
      required: true,
      type: "html",
    },
    variant: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "brand"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "data-variant",
        value: "{variant}",
      },
    ],
    classes: [
      {
        behavior: "always",
        value: "surface",
      },
    ],
  },
} as const;
