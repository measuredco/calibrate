import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrBoxBackground = "default" | "panel" | "transparent";
export type ClbrBoxPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type ClbrBoxRadius = "sm" | "md";

/** Props for the Calibrate box renderer. */
export interface ClbrBoxProps {
  /**
   * Background treatment.
   * `default` emits no background attribute.
   * `panel` emits `data-background="panel"`.
   * `transparent` emits `data-background="transparent"`.
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
   * Inner block-axis spacing scale.
   * Always emits `data-padding-block`.
   * @default "md"
   */
  paddingBlock?: ClbrBoxPadding;
  /**
   * Inner inline-axis spacing scale.
   * Always emits `data-padding-inline`.
   * @default "md"
   */
  paddingInline?: ClbrBoxPadding;
  /**
   * Corner radius size.
   * When omitted, no `data-radius` attribute is emitted.
   */
  radius?: ClbrBoxRadius;
  /**
   * Switches block-axis padding to the responsive layout spacing scale.
   * Emits `data-responsive` as a presence attribute when true.
   * @default false
   */
  responsive?: boolean;
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
  paddingBlock = "md",
  paddingInline = "md",
  radius,
  responsive = false,
  surface,
}: ClbrBoxProps): string {
  const boxAttrs = attrs({
    class: "box",
    "data-background": background === "default" ? undefined : background,
    "data-border": border,
    "data-padding-block": paddingBlock,
    "data-padding-inline": paddingInline,
    "data-radius": radius,
    "data-responsive": responsive,
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
      values: ["default", "panel", "transparent"],
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
    paddingBlock: {
      default: "md",
      required: false,
      type: "enum",
      values: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    paddingInline: {
      default: "md",
      required: false,
      type: "enum",
      values: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    responsive: {
      default: false,
      required: false,
      type: "boolean",
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
        value: "box",
      },
      {
        behavior: "emit",
        target: "data-background",
        value: "{background}",
        when: "background is panel or transparent",
      },
      {
        behavior: "emit",
        target: "data-border",
        value: "present",
        when: "border is true",
      },
      {
        behavior: "always",
        target: "data-padding-block",
        value: "{paddingBlock}",
      },
      {
        behavior: "always",
        target: "data-padding-inline",
        value: "{paddingInline}",
      },
      {
        behavior: "emit",
        target: "data-radius",
        value: "{radius}",
        when: "radius is sm or md",
      },
      {
        behavior: "emit",
        target: "data-responsive",
        value: "present",
        when: "responsive is true",
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
