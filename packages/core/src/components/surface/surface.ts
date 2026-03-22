import { attrs } from "../../helpers/html";

export type ClbrSurfaceVariant = "default" | "brand";

/**
 * Props for the Calibrate surface renderer.
 */
export interface ClbrSurfaceProps {
  /**
   * Inner HTML content to render inside the surface wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children: string;
  /**
   * Surface variant applied to the wrapper.
   * @default "default"
   */
  variant?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate surface component.
 *
 * Emits a `<div>` with `surface` and a `data-surface` attribute, then injects
 * the provided HTML content inside.
 *
 * @param props - Surface component props.
 * @returns HTML string for the Calibrate surface component.
 */
export function renderClbrSurface(props: ClbrSurfaceProps): string {
  const { children, variant = "default" } = props;

  const surfaceAttrs = attrs({
    class: "surface",
    "data-surface": variant,
  });

  return `<div ${surfaceAttrs}>${children}</div>`;
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
        target: "data-surface",
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
