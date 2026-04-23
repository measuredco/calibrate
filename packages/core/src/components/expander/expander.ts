import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";

export type ClbrExpanderSize = "sm" | "md" | "lg";

export interface ClbrExpanderProps {
  /** Optional id of the controlled element (emitted as `aria-controls`). */
  controlsId?: string;
  /** Expanded state. @default false */
  expanded?: boolean;
  /** Accessible label for the toggle control. @default "Menu" */
  label?: string;
  /** Size variant. @default "md" */
  size?: ClbrExpanderSize;
}

const expanderLabelDefault = "Menu";

/**
 * SSR renderer for the Calibrate expander control.
 *
 * Emits a semantic `button` with accessible text and animated line glyph
 * wrapper markup.
 *
 * @param props - Expander component props.
 * @returns HTML string for a toggle button.
 */
export function renderClbrExpander({
  controlsId,
  expanded,
  label = expanderLabelDefault,
  size = "md",
}: ClbrExpanderProps = {}): string {
  const normalizedLabel = label.trim() === "" ? expanderLabelDefault : label;

  const expanderAttrs = attrs({
    "aria-controls": controlsId || undefined,
    "aria-expanded": expanded ? "true" : "false",
    class: "clbr-expander",
    "data-size": size,
    type: "button",
  });

  return `<button ${expanderAttrs}><span class="expander-box"><span class="expander-inner"></span><span class="visually-hidden">${escapeHtml(
    normalizedLabel,
  )}</span></span></button>`;
}

/** Declarative expander contract mirror for tooling, docs, and adapters. */
export const CLBR_EXPANDER_SPEC: ClbrStructuredSpec = {
  name: "expander",
  description:
    "Use `expander` as a toggle for disclosure regions such as menus.",
  output: { element: "button", class: "clbr-expander" },
  content: { kind: "text", prop: "label" },
  props: {
    controlsId: {
      description: "`id` of the element this toggle controls.",
      type: { kind: "string" },
    },
    expanded: {
      default: false,
      description: "Whether the controlled region is expanded.",
      type: { kind: "boolean" },
    },
    label: {
      default: expanderLabelDefault,
      description: "Accessible label.",
      type: { kind: "text" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "button" },
      },
      {
        target: { on: "host" },
        attribute: "aria-expanded",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{expanded}" },
      },
      {
        target: { on: "host" },
        attribute: "aria-controls",
        condition: { kind: "when-non-empty", prop: "controlsId" },
        value: { kind: "prop", prop: "controlsId" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
    ],
  },
};
