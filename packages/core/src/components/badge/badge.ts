import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrStatusTone } from "../../types";

export type ClbrBadgeSize = "sm" | "md";

export interface ClbrBadgeProps {
  /** Positions the badge as a floating overlay. */
  floating?: boolean;
  /** Badge text content. Escaped as plain text. */
  label: string;
  /** Badge size. @default "md" */
  size?: ClbrBadgeSize;
  /** Semantic tone variant. */
  tone?: ClbrStatusTone;
}

/**
 * SSR renderer for the Calibrate badge component.
 *
 * @param props - Badge component props.
 * @returns HTML string for a badge element.
 */
export function renderClbrBadge({
  floating,
  label,
  size = "md",
  tone,
}: ClbrBadgeProps): string {
  const badgeAttrs = attrs({
    class: "clbr-badge",
    "data-floating": floating,
    "data-size": size,
    "data-tone": tone || undefined,
  });

  return `<span ${badgeAttrs}>${escapeHtml(label)}</span>`;
}

/** Declarative badge contract mirror for tooling, docs, and adapters. */
export const CLBR_BADGE_SPEC: ClbrComponentSpec = {
  name: "badge",
  description: "Use `badge` to annotate content with a short label.",
  output: { element: "span", class: "clbr-badge" },
  content: { kind: "text", prop: "label" },
  props: {
    floating: {
      default: false,
      description: "Positions the badge as a floating overlay.",
      type: { kind: "boolean" },
    },
    label: {
      description: "Badge text.",
      required: true,
      type: { kind: "text" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    tone: {
      description: "Semantic tone.",
      type: { kind: "enum", values: ["info", "success", "warning", "error"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-floating",
        condition: { kind: "when-truthy", prop: "floating" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-provided", prop: "tone" },
        value: { kind: "prop", prop: "tone" },
      },
    ],
  },
};
