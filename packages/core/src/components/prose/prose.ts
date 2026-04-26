import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrAlign } from "../../types";

export type ClbrProseHangingPunctuation = "always" | "notebook";

export interface ClbrProseProps {
  /** Trusted inner HTML. */
  children: string;
  /** Text alignment. @default "start" */
  align?: ClbrAlign;
  /** Hanging-indent layout behavior. */
  hangingPunctuation?: ClbrProseHangingPunctuation;
  /** Applies max measure constraints for long-form readability. @default true */
  measured?: boolean;
  /** Enables breakpoint-responsive body scale. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Calibrate prose component.
 *
 * @param props - Prose component props.
 * @returns IR node for a prose wrapper.
 */
export function buildClbrProse({
  align = "start",
  children,
  hangingPunctuation,
  measured = true,
  responsive,
}: ClbrProseProps): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr-prose",
      "data-align": align !== "start" ? align : undefined,
      "data-hanging-punctuation": hangingPunctuation,
      "data-measured": measured,
      "data-responsive": responsive,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Calibrate prose component.
 *
 * @param props - Prose component props.
 * @returns HTML string for a prose wrapper.
 */
export function renderClbrProse(props: ClbrProseProps): string {
  return serializeClbrNode(buildClbrProse(props));
}

/** Declarative prose contract mirror for tooling, docs, and adapters. */
export const CLBR_PROSE_SPEC: ClbrComponentSpec = {
  name: "prose",
  description: "Use `prose` to style rich-text markup.",
  output: { element: "div", class: "clbr-prose" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the prose wrapper.",
      required: true,
      type: { kind: "html" },
    },
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    hangingPunctuation: {
      description:
        "Position list markers and leading quote marks in the margin, with text aligned.",
      type: { kind: "enum", values: ["always", "notebook"] },
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales body text across breakpoints.",
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
      {
        target: { on: "host" },
        attribute: "data-hanging-punctuation",
        condition: { kind: "when-provided", prop: "hangingPunctuation" },
        value: { kind: "prop", prop: "hangingPunctuation" },
      },
      {
        target: { on: "host" },
        attribute: "data-measured",
        condition: { kind: "when-truthy", prop: "measured" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
      },
    ],
  },
};
