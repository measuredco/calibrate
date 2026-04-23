import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
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
 * Builds the IR tree for the Calibrate surface component.
 *
 * @param props - Surface component props.
 * @returns IR node for a surface wrapper.
 */
export function buildClbrSurface({
  children,
  variant = "default",
}: ClbrSurfaceProps): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-surface",
      "data-clbr-surface": variant,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Calibrate surface component.
 *
 * @param props - Surface component props.
 * @returns HTML string for a surface wrapper.
 */
export function renderClbrSurface(props: ClbrSurfaceProps): string {
  return serializeClbrNode(buildClbrSurface(props));
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
