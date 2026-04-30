import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrAlign, ClbrHeadingLevel } from "../../types";
export type ClbrHeadingSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

export interface ClbrHeadingProps {
  /** Text alignment. @default "start" */
  align?: ClbrAlign;
  /** Optional DOM id. */
  id?: string;
  /** Semantic heading level; omit to render a `span`. */
  level?: ClbrHeadingLevel;
  /** Enables optical alignment for left sidebearing-heavy glyphs. @default false */
  opticalAlign?: boolean;
  /** Enables breakpoint-responsive heading scale. @default false */
  responsive?: boolean;
  /** Heading size. @default "md" */
  size?: ClbrHeadingSize;
  /** Heading text content (escaped before render). */
  text: string;
}

/**
 * Builds the IR tree for the Calibrate heading component.
 *
 * @param props - Heading component props.
 * @returns IR node for a heading element (`h1`..`h6`) or `span`.
 */
export function buildClbrHeading({
  align = "start",
  id,
  level,
  opticalAlign,
  responsive,
  size = "md",
  text,
}: ClbrHeadingProps): ClbrNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const tag = level ? (`h${level}` as const) : "span";
  return {
    kind: "element",
    tag,
    attrs: {
      class: "clbr-heading",
      "data-align": align === "start" ? undefined : align,
      "data-optical-align": opticalAlign,
      "data-responsive": responsive,
      "data-size": size,
      id: normalizedId,
    },
    children: [{ kind: "text", value: text }],
  };
}

/**
 * SSR renderer for the Calibrate heading component.
 *
 * @param props - Heading component props.
 * @returns HTML string for a heading element (`h1`..`h6`) or `span`.
 */
export function renderClbrHeading(props: ClbrHeadingProps): string {
  return serializeClbrNode(buildClbrHeading(props));
}

/** Declarative heading contract mirror for tooling, docs, and adapters. */
export const CLBR_HEADING_SPEC: ClbrComponentSpec = {
  name: "heading",
  description: "Use `heading` to render heading text with consistent type.",
  output: {
    element: {
      kind: "switch",
      prop: "level",
      cases: {
        "1": "h1",
        "2": "h2",
        "3": "h3",
        "4": "h4",
        "5": "h5",
        "6": "h6",
      },
    },
    class: "clbr-heading",
  },
  content: { kind: "text", prop: "text" },
  props: {
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    id: {
      description:
        "Optional DOM id. Use for analytics tracking, fragment URL navigation, programmatic focus, or external aria refs.",
      type: { kind: "string" },
    },
    level: {
      description: "Semantic heading level. Renders a `<span>` when omitted.",
      type: { kind: "enum", values: [1, 2, 3, 4, 5, 6] },
    },
    opticalAlign: {
      default: false,
      description: "Optically aligns the first glyph to the inline edge.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales type across breakpoints.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
      },
    },
    text: {
      description: "Heading text.",
      required: true,
      type: { kind: "text" },
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
        attribute: "data-optical-align",
        condition: { kind: "when-truthy", prop: "opticalAlign" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
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
