import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrStatusTone } from "../../types";

export type ClbrBadgeSize = "sm" | "md";

export interface ClbrBadgeProps {
  /** Positions the badge as a floating overlay. */
  floating?: boolean;
  /** Optional DOM id. */
  id?: string;
  /** Badge text content. Escaped as plain text. */
  label: string;
  /** Badge size. @default "md" */
  size?: ClbrBadgeSize;
  /** Semantic tone variant. */
  tone?: ClbrStatusTone;
}

/**
 * Builds the IR tree for the Calibrate badge component.
 *
 * @param props - Badge component props.
 * @returns IR node for a badge element.
 */
export function buildClbrBadge({
  floating,
  id,
  label,
  size = "md",
  tone,
}: ClbrBadgeProps): ClbrNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "span",
    attrs: {
      class: "clbr-badge",
      "data-floating": floating,
      "data-size": size,
      "data-tone": tone || undefined,
      id: normalizedId,
    },
    children: [{ kind: "text", value: label }],
  };
}

/**
 * SSR renderer for the Calibrate badge component.
 *
 * @param props - Badge component props.
 * @returns HTML string for a badge element.
 */
export function renderClbrBadge(props: ClbrBadgeProps): string {
  return serializeClbrNode(buildClbrBadge(props));
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
    id: {
      description:
        "Optional DOM id. Use for analytics tracking, fragment URL navigation, programmatic focus, or external aria refs.",
      type: { kind: "string" },
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
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
