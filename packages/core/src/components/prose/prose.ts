import { attrs } from "../../helpers/html";
import type { ClbrTextAlign } from "../text/text";

export type ClbrProseHangingIndent = "always" | "notebook";

/** Props for the Calibrate prose renderer. */
export interface ClbrProseProps {
  /**
   * Inner HTML content to render inside the prose wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children: string;
  /**
   * Text alignment.
   * @default "start"
   */
  align?: ClbrTextAlign;
  /**
   * Hanging-indent layout behavior.
   * Omitted by default.
   * `always` and `notebook` emit `data-hanging-indent` with matching value.
   */
  hangingIndent?: ClbrProseHangingIndent;
  /**
   * Applies max measure constraints for long-form readability.
   * @default true
   */
  measured?: boolean;
  /**
   * Enables breakpoint-responsive body scale.
   * @default false
   */
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
  hangingIndent,
  measured = true,
  responsive,
}: ClbrProseProps): string {
  const proseAttrs = attrs({
    class: "prose",
    "data-align": align !== "start" ? align : undefined,
    "data-hanging-indent": hangingIndent,
    "data-measured": measured,
    "data-responsive": responsive,
  });

  return `<div ${proseAttrs}>${children}</div>`;
}

/** Declarative prose contract mirror for tooling, docs, and adapters. */
export const CLBR_PROSE_SPEC = {
  name: "prose",
  output: {
    element: "div",
  },
  props: {
    children: {
      required: true,
      type: "html",
    },
    align: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    hangingIndent: {
      required: false,
      type: "enum",
      values: ["always", "notebook"],
    },
    measured: {
      default: true,
      required: false,
      type: "boolean",
    },
    responsive: {
      default: false,
      required: false,
      type: "boolean",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "prose",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is center or end",
      },
      {
        behavior: "emit",
        target: "data-hanging-indent",
        value: "{hangingIndent}",
        when: "hangingIndent is provided",
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
