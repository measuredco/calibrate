import { attrs, escapeHtml } from "../../helpers/html";

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
    class: "expander",
    "data-size": size,
    type: "button",
  });

  return `<button ${expanderAttrs}><span class="expander-box"><span class="expander-inner"></span><span class="visually-hidden">${escapeHtml(
    normalizedLabel,
  )}</span></span></button>`;
}

/** Declarative expander contract mirror for tooling, docs, and adapters. */
export const CLBR_EXPANDER_SPEC = {
  name: "expander",
  description: "Use `expander` as a toggle for disclosure regions such as menus.",
  output: {
    default: "button",
  },
  props: {
    controlsId: {
      description: "ID of the element this toggle controls.",
      required: false,
      type: "string",
    },
    expanded: {
      default: false,
      description: "Whether the controlled region is expanded.",
      required: false,
      type: "boolean",
    },
    label: {
      default: expanderLabelDefault,
      description: "Accessible label.",
      required: false,
      type: "text",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md", "lg"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "expander",
      },
      {
        behavior: "always",
        target: "type",
        value: "button",
      },
      {
        behavior: "always",
        target: "aria-expanded",
        value: "{expanded}",
      },
      {
        behavior: "emit",
        target: "aria-controls",
        value: "{controlsId}",
        when: "controlsId is provided",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "span.expander-box > span.expander-inner",
      },
      {
        behavior: "always",
        element: "span.visually-hidden",
        value: "{label}",
      },
    ],
  },
} as const;
