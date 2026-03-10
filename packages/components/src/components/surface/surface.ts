import { cx } from "../../helpers/cx";

export type ClbrSurface = "default" | "brand";

/**
 * Props for the Calibrate surface renderer.
 */
export interface ClbrSurfaceProps {
  /** Inner HTML content to render inside the surface wrapper. */
  children: string;
  /**
   * Surface variant class applied to the wrapper.
   * @default "default"
   */
  surface?: ClbrSurface;
}

/**
 * SSR renderer for the Calibrate surface wrapper.
 *
 * Emits a `<div>` with `clbr-surface` and, for non-default variants,
 * `clbr-surface-{surface}`, then injects the provided HTML content inside.
 *
 * @param props - Surface wrapper configuration and inner HTML content.
 * @returns HTML string for the Calibrate surface wrapper.
 */
export function renderClbrSurface(props: ClbrSurfaceProps): string {
  const { children, surface = "default" } = props;
  const classAttr = cx(
    "clbr-surface",
    surface === "default" ? undefined : `clbr-surface-${surface}`,
  );

  return `<div class="${classAttr}">${children}</div>`;
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
    surface: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "brand"],
    },
  },
  rules: {
    classes: [
      {
        behavior: "always",
        value: "clbr-surface",
      },
      {
        behavior: "emit",
        value: "clbr-surface-{surface}",
        when: "surface is not default",
      },
    ],
  },
} as const;
