import { attrs } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";

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
    class: "clbr-surface",
    "data-clbr-surface": variant,
  });

  return `<div ${surfaceAttrs}>${children}</div>`;
}

/** Declarative surface contract mirror for tooling, docs, and adapters. */
export const CLBR_SURFACE_SPEC: ClbrComponentSpec = {
  name: "surface",
  description: "Use `surface` to set a colour context for nested content.",
  output: { element: "div", class: "clbr-surface" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the surface.",
      required: true,
      type: { kind: "html" },
    },
    variant: {
      default: "default",
      description: "Surface context.",
      type: {
        kind: "enum",
        values: ["default", "brand", "inverse", "brand-inverse"],
      },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-clbr-surface",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "variant" },
      },
    ],
  },
};
