import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrAlign } from "../../types";
import { buildClbrText } from "../text/text";

export interface ClbrFigureProps {
  /** Alignment within available space. @default "start" */
  align?: ClbrAlign;
  /** Trusted caption HTML. */
  caption: string;
  /** Trusted media HTML (typically a `renderClbrImage` result). */
  children: string;
  /** Enables breakpoint-responsive type sizing for the caption. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Calibrate figure component.
 *
 * @param props - Figure component props.
 * @returns IR node for a figure wrapper.
 */
export function buildClbrFigure({
  align = "start",
  caption,
  children,
  responsive = false,
}: ClbrFigureProps): ClbrNode {
  return {
    kind: "element",
    tag: "figure",
    attrs: {
      class: "clbr-figure",
      "data-align": align === "start" ? undefined : align,
    },
    children: [
      { kind: "raw", html: children },
      {
        kind: "element",
        tag: "figcaption",
        attrs: { class: "figcaption" },
        children: [
          buildClbrText({
            as: "span",
            children: caption,
            responsive,
            size: "sm",
          }),
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Calibrate figure component.
 *
 * @param props - Figure component props.
 * @returns HTML string for a figure wrapper.
 */
export function renderClbrFigure(props: ClbrFigureProps): string {
  return serializeClbrNode(buildClbrFigure(props));
}

/** Declarative figure contract mirror for tooling, docs, and adapters. */
export const CLBR_FIGURE_SPEC: ClbrComponentSpec = {
  name: "figure",
  description: "Use `figure` to present media with a caption.",
  output: { element: "figure", class: "clbr-figure" },
  content: {
    kind: "slots",
    slots: [
      { prop: "children", kind: "html" },
      { prop: "caption", kind: "html" },
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Alignment within available space.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    caption: {
      description:
        "Caption shown below the media. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    children: {
      description: "Media rendered inside the figure.",
      required: true,
      type: { kind: "html" },
    },
    responsive: {
      default: false,
      description: "Scales the caption across breakpoints.",
      type: { kind: "boolean" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: {
          kind: "when-in",
          prop: "align",
          values: ["center", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
    ],
  },
};
