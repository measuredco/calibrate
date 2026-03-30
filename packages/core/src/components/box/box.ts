import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrBoxBackground = "default" | "panel";
export type ClbrBoxBorder = "default" | "subtle" | "brand";
export type ClbrBoxPadding = "xs" | "sm" | "md" | "lg" | "xl";
export type ClbrBoxRadius = "sm" | "md" | "lg";

/** Props for the Calibrate box renderer. */
export interface ClbrBoxProps {
  /**
   * Background treatment.
   * @default "default"
   */
  background?: ClbrBoxBackground;
  /**
   * Border treatment.
   * @default "default"
   */
  border?: ClbrBoxBorder;
  /**
   * Inner HTML content to render inside the box wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Applies default elevation shadow when true.
   * Omitted by default.
   */
  boxShadow?: boolean;
  /**
   * Applies brand-specific stroke offset treatment.
   * Omitted by default.
   */
  offsetStroke?: boolean;
  /**
   * Inner spacing scale.
   * @default "md"
   */
  padding?: ClbrBoxPadding;
  /**
   * Corner radius scale.
   * @default "md"
   */
  radius?: ClbrBoxRadius;
  /**
   * Surface context.
   * Omitted by default.
   */
  surface?: ClbrSurfaceVariant;
}

/**
 * SSR renderer for the Calibrate box component.
 *
 * @param props - Box component props.
 * @returns HTML string for a box wrapper.
 */
export function renderClbrBox({
  background = "default",
  border = "default",
  boxShadow,
  children,
  offsetStroke,
  padding = "md",
  radius = "md",
  surface,
}: ClbrBoxProps): string {
  const boxAttrs = attrs({
    class: "box",
    "data-background": background === "default" ? undefined : background,
    "data-border": border === "default" ? undefined : border,
    "data-box-shadow": boxShadow,
    "data-offset-stroke": offsetStroke,
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
  },
  props: {
    background: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "panel"],
    },
    border: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "subtle", "brand"],
    },
    children: {
      required: false,
      type: "html",
    },
    boxShadow: {
      required: false,
      type: "boolean",
    },
    offsetStroke: {
      required: false,
      type: "boolean",
    },
    padding: {
      default: "md",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md", "lg"],
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
        value: "{background}",
        when: "background is panel",
      },
      {
        behavior: "emit",
        target: "data-border",
        value: "{border}",
        when: "border is subtle, brand, or none",
      },
      {
        behavior: "emit",
        target: "data-box-shadow",
        value: "present",
        when: "boxShadow is true",
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
        behavior: "always",
        target: "data-radius",
        value: "{radius}",
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
