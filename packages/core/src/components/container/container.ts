import { attrs } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";

export type ClbrContainerGutter = "default" | "narrow" | "none";
export type ClbrContainerMaxInlineSize = "default" | "wide" | "none";

export interface ClbrContainerProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Inline gutter behavior. @default "default" */
  gutter?: ClbrContainerGutter;
  /** Max-inline-size behavior. Effect is only visible on wider viewports. @default "default" */
  maxInlineSize?: ClbrContainerMaxInlineSize;
}

/**
 * SSR renderer for the Calibrate container component.
 *
 * @param props - Container component props.
 * @returns HTML string for a container wrapper.
 */
export function renderClbrContainer({
  children,
  gutter = "default",
  maxInlineSize = "default",
}: ClbrContainerProps): string {
  const containerAttrs = attrs({
    class: "clbr-container",
    "data-gutter": gutter === "default" ? undefined : gutter,
    "data-max-inline-size":
      maxInlineSize === "default" ? undefined : maxInlineSize,
  });

  return `<div ${containerAttrs}>${children ?? ""}</div>`;
}

/** Declarative container contract mirror for tooling, docs, and adapters. */
export const CLBR_CONTAINER_SPEC: ClbrStructuredSpec = {
  name: "container",
  description: "Use `container` to wrap page-level content.",
  output: { element: "div", class: "clbr-container" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the container.",
      type: { kind: "html" },
    },
    gutter: {
      default: "default",
      description: "Horizontal gutter width.",
      type: { kind: "enum", values: ["default", "narrow", "none"] },
    },
    maxInlineSize: {
      default: "default",
      description:
        "Maximum content width. Effect is only visible in wider viewports.",
      type: { kind: "enum", values: ["default", "wide", "none"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-max-inline-size",
        condition: {
          kind: "when-in",
          prop: "maxInlineSize",
          values: ["wide", "none"],
        },
        value: { kind: "prop", prop: "maxInlineSize" },
      },
      {
        target: { on: "host" },
        attribute: "data-gutter",
        condition: {
          kind: "when-in",
          prop: "gutter",
          values: ["narrow", "none"],
        },
        value: { kind: "prop", prop: "gutter" },
      },
    ],
  },
};
