import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrPanelPadding = "xs" | "sm" | "md" | "lg" | "xl";

export interface ClbrPanelProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Inner spacing scale. @default "md" */
  padding?: ClbrPanelPadding;
  /** Surface context. */
  surface?: ClbrSurfaceVariant;
}

/**
 * Builds the IR tree for the Calibrate panel component.
 *
 * @param props - Panel component props.
 * @returns IR node for a panel wrapper.
 */
export function buildClbrPanel({
  children,
  padding = "md",
  surface,
}: ClbrPanelProps): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-panel",
      "data-padding": padding,
      "data-clbr-surface": surface,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Calibrate panel component.
 *
 * @param props - Panel component props.
 * @returns HTML string for a panel wrapper.
 */
export function renderClbrPanel(props: ClbrPanelProps): string {
  return serializeClbrNode(buildClbrPanel(props));
}

/** Declarative panel contract mirror for tooling, docs, and adapters. */
export const CLBR_PANEL_SPEC: ClbrComponentSpec = {
  name: "panel",
  description: "Use `panel` to group related content in a contained region.",
  output: { element: "div", class: "clbr-panel" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the panel.",
      type: { kind: "html" },
    },
    padding: {
      default: "md",
      description: "Inner spacing scale.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl"] },
    },
    surface: {
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
        attribute: "data-padding",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "padding" },
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
