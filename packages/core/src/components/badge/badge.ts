import { attrs, escapeHtml } from "../../helpers/html";
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
    class: "badge",
    "data-floating": floating,
    "data-size": size,
    "data-tone": tone || undefined,
  });

  return `<span ${badgeAttrs}>${escapeHtml(label)}</span>`;
}

/** Declarative badge contract mirror for tooling, docs, and adapters. */
export const CLBR_BADGE_SPEC = {
  name: "badge",
  description: "Use `badge` to annotate content with a short label.",
  output: {
    element: "span",
  },
  props: {
    floating: {
      default: false,
      description: "Positions the badge as a floating overlay.",
      required: false,
      type: "boolean",
    },
    label: {
      description: "Badge text.",
      required: true,
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    tone: {
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["info", "success", "warning", "error"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "badge",
      },
      {
        behavior: "emit",
        target: "data-floating",
        value: "present",
        when: "floating is true",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: "tone is provided",
      },
    ],
    content: {
      behavior: "escape-html",
      target: "label",
    },
  },
} as const;
