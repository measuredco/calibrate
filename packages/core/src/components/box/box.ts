import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
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
 * Builds the IR tree for the Calibrate box component.
 *
 * @param props - Box component props.
 * @returns IR node for a box wrapper.
 */
export function buildClbrBox({
  background = "default",
  children,
  border,
  paddingBlock = "md",
  paddingInline = "md",
  radius,
  responsive,
  surface,
}: ClbrBoxProps): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-box",
      "data-background": background === "default" ? undefined : background,
      "data-border": border,
      "data-padding-block": paddingBlock,
      "data-padding-inline": paddingInline,
      "data-radius": radius,
      "data-responsive": responsive,
      "data-clbr-surface": surface,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Calibrate box component.
 *
 * @param props - Box component props.
 * @returns HTML string for a box wrapper.
 */
export function renderClbrBox(props: ClbrBoxProps): string {
  return serializeClbrNode(buildClbrBox(props));
}

/** Declarative box contract mirror for tooling, docs, and adapters. */
export const CLBR_BOX_SPEC: ClbrComponentSpec = {
  name: "box",
  description: "Use `box` to inset content.",
  output: { element: "div", class: "clbr-box" },
  content: { kind: "html", prop: "children" },
  props: {
    background: {
      default: "default",
      description: "Background treatment.",
      type: { kind: "enum", values: ["default", "panel", "transparent"] },
    },
    border: {
      default: false,
      description: "Shows a subtle border around the box.",
      type: { kind: "boolean" },
    },
    children: {
      description: "Content rendered inside the box.",
      type: { kind: "html" },
    },
    paddingBlock: {
      default: "md",
      description: "Vertical padding.",
      type: {
        kind: "enum",
        values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
      },
    },
    paddingInline: {
      default: "md",
      description: "Horizontal padding.",
      type: {
        kind: "enum",
        values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
      },
    },
    radius: {
      description: "Corner radius.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    responsive: {
      default: false,
      description: "Scales vertical padding across breakpoints.",
      type: { kind: "boolean" },
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
        attribute: "data-background",
        condition: {
          kind: "when-in",
          prop: "background",
          values: ["panel", "transparent"],
        },
        value: { kind: "prop", prop: "background" },
      },
      {
        target: { on: "host" },
        attribute: "data-border",
        condition: { kind: "when-truthy", prop: "border" },
      },
      {
        target: { on: "host" },
        attribute: "data-padding-block",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "paddingBlock" },
      },
      {
        target: { on: "host" },
        attribute: "data-padding-inline",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "paddingInline" },
      },
      {
        target: { on: "host" },
        attribute: "data-radius",
        condition: { kind: "when-provided", prop: "radius" },
        value: { kind: "prop", prop: "radius" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
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
