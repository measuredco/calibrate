import { attrs } from "../../helpers/html";
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
 * SSR renderer for the Calibrate prose component.
 *
 * @param props - Prose component props.
 * @returns HTML string for a prose wrapper.
 */
export function renderClbrProse({
  align = "start",
  children,
  hangingPunctuation,
  measured = true,
  responsive,
}: ClbrProseProps): string {
  const proseAttrs = attrs({
    class: "clbr-prose",
    "data-align": align !== "start" ? align : undefined,
    "data-hanging-punctuation": hangingPunctuation,
    "data-measured": measured,
    "data-responsive": responsive,
  });

  return `<div ${proseAttrs}>${children}</div>`;
}

/** Declarative prose contract mirror for tooling, docs, and adapters. */
export const CLBR_PROSE_SPEC = {
  name: "prose",
  description: "Use `prose` to style rich-text markup.",
  output: {
    element: "div",
  },
  props: {
    children: {
      description: "Content rendered inside the prose wrapper.",
      required: true,
      type: "html",
    },
    align: {
      default: "start",
      description: "Text alignment.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    hangingPunctuation: {
      description:
        "Position list markers and leading quote marks in the margin, with text aligned.",
      required: false,
      type: "enum",
      values: ["always", "notebook"],
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      required: false,
      type: "boolean",
    },
    responsive: {
      default: false,
      description: "Scales body text across breakpoints.",
      required: false,
      type: "boolean",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-prose",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is center or end",
      },
      {
        behavior: "emit",
        target: "data-hanging-punctuation",
        value: "{hangingPunctuation}",
        when: "hangingPunctuation is provided",
      },
      {
        behavior: "emit",
        target: "data-measured",
        value: "present",
        when: "measured is true",
      },
      {
        behavior: "emit",
        target: "data-responsive",
        value: "present",
        when: "responsive is true",
      },
    ],
  },
} as const;
