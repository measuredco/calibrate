import { attrs } from "../../helpers/html";
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
 * SSR renderer for the Calibrate panel component.
 *
 * @param props - Panel component props.
 * @returns HTML string for a panel wrapper.
 */
export function renderClbrPanel({
  children,
  padding = "md",
  surface,
}: ClbrPanelProps): string {
  const panelAttrs = attrs({
    class: "panel",
    "data-padding": padding,
    "data-surface": surface,
  });

  return `<div ${panelAttrs}>${children ?? ""}</div>`;
}

/** Declarative panel contract mirror for tooling, docs, and adapters. */
export const CLBR_PANEL_SPEC = {
  name: "panel",
  description: "Use `panel` to group related content in a contained region.",
  output: {
    element: "div",
    class: "panel",
    children: "trusted HTML",
    fixedStyles: [
      "background: panel",
      "border: default",
      "shadow: default",
      "radius: lg",
    ],
  },
  props: {
    children: {
      description: "Content rendered inside the panel.",
      required: false,
      type: "html",
    },
    padding: {
      default: "md",
      description: "Inner spacing scale.",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl"],
    },
    surface: {
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
        target: "class",
        value: "panel",
      },
      {
        behavior: "always",
        target: "data-padding",
        value: "{padding}",
      },
      {
        behavior: "emit",
        target: "data-surface",
        value: "{surface}",
        when: "surface is provided",
      },
    ],
  },
} as const;
