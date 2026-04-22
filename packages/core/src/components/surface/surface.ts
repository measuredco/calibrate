import { attrs } from "../../helpers/html";

export type ClbrSurfaceVariant =
  | "default"
  | "brand"
  | "inverse"
  | "brand-inverse";

export interface ClbrSurfaceProps {
  /** Trusted inner HTML. */
  children: string;
  /** Surface variant. @default "default" */
  variant?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate surface component.
 *
 * @param props - Surface component props.
 * @returns HTML string for a surface wrapper.
 */
export function renderClbrSurface({
  children,
  variant = "default",
}: ClbrSurfaceProps): string {
  const surfaceAttrs = attrs({
    class: "surface",
    "data-surface": variant,
  });

  return `<div ${surfaceAttrs}>${children}</div>`;
}

/** Declarative surface contract mirror for tooling, docs, and adapters. */
export const CLBR_SURFACE_SPEC = {
  name: "surface",
  description: "Use `surface` to set a colour context for nested content.",
  output: {
    element: "div",
  },
  props: {
    children: {
      description: "Content rendered inside the surface.",
      required: true,
      type: "html",
    },
    variant: {
      default: "default",
      description: "Surface context.",
      required: false,
      type: "enum",
      values: ["default", "brand", "inverse", "brand-inverse"],
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
