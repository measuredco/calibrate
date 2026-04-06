import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrBadgeSize = "sm" | "md";
export type ClbrBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** Props for the Calibrate badge renderer. */
export interface ClbrBadgeProps {
  /**
   * Positions the badge as a floating overlay when true.
   * Omitted by default.
   */
  floating?: boolean;
  /** Badge text content. Escaped as plain text. */
  label: string;
  /**
   * Badge size.
   * @default "md"
   */
  size?: ClbrBadgeSize;
  /**
   * Semantic tone variant.
   * Omitted when `neutral`.
   * @default "neutral"
   */
  tone?: ClbrBadgeTone;
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
  tone = "neutral",
}: ClbrBadgeProps): string {
  const badgeAttrs = attrs({
    class: "badge",
    "data-floating": floating,
    "data-size": size,
    "data-tone": tone === "neutral" ? undefined : tone,
  });

  return `<span ${badgeAttrs}>${escapeHtml(label)}</span>`;
}

/** Declarative badge contract mirror for tooling, docs, and adapters. */
export const CLBR_BADGE_SPEC = {
  name: "badge",
  output: {
    element: "span",
  },
  props: {
    floating: {
      default: false,
      required: false,
      type: "boolean",
    },
    label: {
      required: true,
      type: "string",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    tone: {
      default: "neutral",
      required: false,
      type: "enum",
      values: ["neutral", "info", "success", "warning", "error"],
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
        when: "tone is info, success, warning, or error",
      },
    ],
    content: {
      behavior: "escape-html",
      target: "label",
    },
  },
} as const;
