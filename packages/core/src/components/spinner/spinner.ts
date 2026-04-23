import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrSpinnerSize =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "fill";
export type ClbrSpinnerTone = "default" | "brand";

export interface ClbrSpinnerProps {
  /** Accessible status label. */
  label?: string;
  /** Size variant. @default "md" */
  size?: ClbrSpinnerSize;
  /** Tone variant. @default "default" */
  tone?: ClbrSpinnerTone;
}

/**
 * Builds the IR tree for the Calibrate spinner component.
 *
 * @param props - Spinner component props.
 * @returns IR node for a spinner element.
 */
export function buildClbrSpinner({
  label,
  size = "md",
  tone = "default",
}: ClbrSpinnerProps = {}): ClbrNode {
  const children: ClbrNode[] = [
    {
      kind: "element",
      tag: "svg",
      attrs: {
        "aria-hidden": "true",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 544 544",
      },
      children: [
        {
          kind: "element",
          tag: "circle",
          attrs: {
            class: "circle-lg",
            cx: "272",
            cy: "272",
            fill: "none",
            r: "208",
            stroke: "currentColor",
            "stroke-width": "32",
          },
          children: [],
        },
        {
          kind: "element",
          tag: "circle",
          attrs: {
            class: "circle-sm",
            cx: "125",
            cy: "419",
            fill: "currentColor",
            r: "64",
            style: "transform-origin: 272px",
          },
          children: [],
        },
      ],
    },
  ];

  if (label) {
    children.push({
      kind: "element",
      tag: "span",
      attrs: { class: "visually-hidden" },
      children: [{ kind: "text", value: label }],
    });
  }

  return {
    kind: "element",
    tag: "span",
    attrs: {
      class: "clbr-spinner",
      "data-size": size,
      "data-tone": tone === "brand" ? "brand" : undefined,
      role: label ? "status" : undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Calibrate spinner component.
 *
 * @param props - Spinner component props.
 * @returns HTML string for a spinner element.
 */
export function renderClbrSpinner(props: ClbrSpinnerProps = {}): string {
  return serializeClbrNode(buildClbrSpinner(props));
}

/** Declarative spinner contract mirror for tooling, docs, and adapters. */
export const CLBR_SPINNER_SPEC: ClbrComponentSpec = {
  name: "spinner",
  description: "Use `spinner` to indicate loading or in-progress state.",
  output: { element: "span", class: "clbr-spinner" },
  content: { kind: "text", prop: "label" },
  props: {
    label: {
      description: "Accessible status label announced to assistive tech.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "fill"],
      },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "brand"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-equals", prop: "tone", to: "brand" },
        value: { kind: "literal", text: "brand" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: { kind: "when-non-empty", prop: "label" },
        value: { kind: "literal", text: "status" },
      },
    ],
  },
};
