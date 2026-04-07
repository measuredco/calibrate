import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrPanelInlineSize = "full" | "fit";
export type ClbrPanelPadding = "xs" | "sm" | "md" | "lg" | "xl";

/** Props for the Calibrate panel renderer. */
export interface ClbrPanelProps {
  /**
   * Inner HTML content to render inside the panel wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Inline-size behavior.
   * `full` emits no inline-size attribute.
   * `fit` emits `data-inline-size="fit"`.
   * @default "full"
   */
  inlineSize?: ClbrPanelInlineSize;
  /**
   * Applies the brand-specific offset stroke treatment.
   * Emits `data-offset-stroke` as a presence attribute when true.
   * @default false
   */
  offsetStroke?: boolean;
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
 * and large radius; only the documented variant attributes are configurable.
 *
 * @param props - Panel component props.
 * @returns HTML string for a panel wrapper.
 */
export function renderClbrPanel({
  children,
  inlineSize = "full",
  offsetStroke,
  padding = "md",
  surface,
}: ClbrPanelProps): string {
  const panelAttrs = attrs({
    class: "panel",
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
    "data-offset-stroke": offsetStroke,
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
    inlineSize: {
      default: "full",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
    offsetStroke: {
      default: false,
      required: false,
      type: "boolean",
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
      values: ["default", "brand"],
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
        behavior: "emit",
        target: "data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
      },
      {
        behavior: "emit",
        target: "data-offset-stroke",
        value: "present",
        when: "offsetStroke is true",
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
        when: "surface is default or brand",
      },
    ],
  },
} as const;
