import { attrs } from "../../helpers/html";
import type { ClbrSurfaceVariant } from "../surface/surface";

export type ClbrBoxBackground = "default" | "panel" | "transparent";
export type ClbrBoxPadding =
  | "none"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";
export type ClbrBoxRadius = "sm" | "md";

export interface ClbrBoxProps {
  /** Background treatment. @default "default" */
  background?: ClbrBoxBackground;
  /** Subtle border. @default false */
  border?: boolean;
  /** Trusted inner HTML. */
  children?: string;
  /** Inner block-axis spacing scale. @default "md" */
  paddingBlock?: ClbrBoxPadding;
  /** Inner inline-axis spacing scale. @default "md" */
  paddingInline?: ClbrBoxPadding;
  /** Corner radius size. */
  radius?: ClbrBoxRadius;
  /** Responsive block-axis padding. @default false */
  responsive?: boolean;
  /** Surface context. */
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
  children,
  border,
  paddingBlock = "md",
  paddingInline = "md",
  radius,
  responsive,
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
  description: "Use `box` to inset content.",
  output: {
    element: "div",
    class: "box",
    children: "trusted HTML",
  },
  props: {
    background: {
      default: "default",
      description: "Background treatment.",
      required: false,
      type: "enum",
      values: ["default", "panel", "transparent"],
    },
    border: {
      default: false,
      description: "Shows a subtle border around the box.",
      required: false,
      type: "boolean",
    },
    children: {
      description: "Content rendered inside the box.",
      required: false,
      type: "html",
    },
    paddingBlock: {
      default: "md",
      description: "Vertical padding.",
      required: false,
      type: "enum",
      values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    paddingInline: {
      default: "md",
      description: "Horizontal padding.",
      required: false,
      type: "enum",
      values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    radius: {
      description: "Corner radius.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    responsive: {
      default: false,
      description: "Scales vertical padding across breakpoints.",
      required: false,
      type: "boolean",
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
