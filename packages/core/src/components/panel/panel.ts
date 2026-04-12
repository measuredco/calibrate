import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrPanelPadding = "xs" | "sm" | "md" | "lg" | "xl";

/** Props for the Calibrate panel renderer. */
export interface ClbrPanelProps {
  /**
   * Inner HTML content to render inside the panel wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Inner spacing scale.
   * Always emits `data-padding`.
   * @default "md"
   */
  padding?: ClbrPanelPadding;
  /**
   * Surface context.
   * When provided, emits `data-surface`.
   */
  surface?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate panel component.
 *
 * Emits a single `div.panel` wrapper around trusted child HTML.
 * Panel always uses the panel background, default border, default shadow,
 * and large radius. Only padding and surface context are configurable.
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
      required: false,
      type: "html",
    },
    padding: {
      default: "md",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl"],
    },
    surface: {
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
