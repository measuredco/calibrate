import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrBoxBackground = "default" | "panel";
export type ClbrBoxPadding = "xs" | "sm" | "md" | "lg" | "xl";
export type ClbrBoxRadius = "sm" | "md";

/** Props for the Calibrate box renderer. */
export interface ClbrBoxProps {
  /**
   * Background treatment.
   * `default` emits no background attribute.
   * `panel` emits `data-background="panel"`.
   * @default "default"
   */
  background?: ClbrBoxBackground;
  /**
   * Adds a subtle border when true.
   * Emits `data-border` as a presence attribute.
   * @default false
   */
  border?: boolean;
  /**
   * Inner HTML content to render inside the box wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Inner spacing scale.
   * Always emits `data-padding`.
   * @default "md"
   */
  padding?: ClbrBoxPadding;
  /**
   * Corner radius size.
   * When omitted, no `data-radius` attribute is emitted.
   */
  radius?: ClbrBoxRadius;
  /**
   * Surface context.
   * When provided, emits `data-surface`.
   */
  surface?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate box component.
 *
 * Emits a single `div.box` wrapper around trusted child HTML.
 * Optional variants are expressed via `data-*` attributes on the root element.
 *
 * @param props - Box component props.
 * @returns HTML string for a box wrapper.
 */
export function renderClbrBox({
  background = "default",
  children,
  border = false,
  padding = "md",
  radius,
  surface,
}: ClbrBoxProps): string {
  const boxAttrs = attrs({
    class: "box",
    "data-background": background === "default" ? undefined : background,
    "data-border": border,
    "data-padding": padding,
    "data-radius": radius,
    "data-surface": surface,
  });

  return `<div ${boxAttrs}>${children ?? ""}</div>`;
}

/** Declarative box contract mirror for tooling, docs, and adapters. */
export const CLBR_BOX_SPEC = {
  name: "box",
  output: {
    element: "div",
    class: "box",
    children: "trusted HTML",
  },
  props: {
    background: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "panel"],
    },
    border: {
      default: false,
      required: false,
      type: "boolean",
    },
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
    radius: {
      required: false,
      type: "enum",
      values: ["sm", "md"],
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
        value: "box",
      },
      {
        behavior: "emit",
        target: "data-background",
        value: "panel",
        when: "background is panel",
      },
      {
        behavior: "emit",
        target: "data-border",
        value: "present",
        when: "border is true",
      },
      {
        behavior: "always",
        target: "data-padding",
        value: "{padding}",
      },
      {
        behavior: "emit",
        target: "data-radius",
        value: "{radius}",
        when: "radius is sm or md",
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
