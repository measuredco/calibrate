import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrHeadingLevel } from "../../types";
import { buildClbrIcon } from "../icon/icon";
import type { ClbrSurfaceVariant } from "../surface/surface";

export interface ClbrCardProps {
  /** Description HTML content. Caller sanitizes untrusted content. */
  description: string;
  /** Optional heading level for the title. Omit to render a `div.title`. */
  headingLevel?: ClbrHeadingLevel;
  /** Optional link destination for the title. Adds a trailing arrow icon when `note` is also provided. */
  href?: string;
  /** Optional note HTML content. Caller sanitizes untrusted content. */
  note?: string;
  /** Surface context. Emits `data-clbr-surface` when provided. */
  surface?: ClbrSurfaceVariant;
  /** Card title text content (escaped before render). */
  title: string;
}

/**
 * Builds the IR tree for the Calibrate card component.
 *
 * @param props - Card component props.
 * @returns IR node for a card wrapper.
 */
export function buildClbrCard({
  description,
  headingLevel,
  href,
  note,
  surface,
  title,
}: ClbrCardProps): ClbrNode {
  const headingTag = headingLevel ? `h${headingLevel}` : "div";
  const titleChildren: ClbrNode[] = href
    ? [
        {
          kind: "element",
          tag: "a",
          attrs: { href },
          children: [{ kind: "text", value: title }],
        },
      ]
    : [{ kind: "text", value: title }];

  const noteChildren: ClbrNode[] = note ? [{ kind: "raw", html: note }] : [];

  if (note && href) {
    noteChildren.push({
      kind: "element",
      tag: "span",
      attrs: { class: "icon-wrapper" },
      children: [
        buildClbrIcon({
          ariaHidden: true,
          mirrored: "rtl",
          name: "arrow-right",
          size: "xs",
        }),
      ],
    });
  }

  const children: ClbrNode[] = [
    {
      kind: "element",
      tag: "span",
      attrs: { class: "dots" },
      children: [{ kind: "element", tag: "span", attrs: {}, children: [] }],
    },
    {
      kind: "element",
      tag: headingTag,
      attrs: { class: "title" },
      children: titleChildren,
    },
    {
      kind: "element",
      tag: "p",
      attrs: { class: "description" },
      children: [{ kind: "raw", html: description }],
    },
  ];

  if (note) {
    children.push({
      kind: "element",
      tag: "p",
      attrs: { class: "note" },
      children: noteChildren,
    });
  }

  return {
    kind: "element",
    tag: "div",
    attrs: { class: "clbr-card", "data-clbr-surface": surface },
    children,
  };
}

/**
 * SSR renderer for the Calibrate card component.
 *
 * Emits a `div.card` root with decorative dots, a title, supporting description,
 * and optional note. When `href` is provided, the title becomes a link; when
 * both `href` and `note` are provided, the note includes a trailing decorative
 * arrow icon.
 *
 * @param props - Card component props.
 * @returns HTML string for a card wrapper.
 */
export function renderClbrCard(props: ClbrCardProps): string {
  return serializeClbrNode(buildClbrCard(props));
}

/** Declarative card contract mirror for tooling, docs, and adapters. */
export const CLBR_CARD_SPEC: ClbrComponentSpec = {
  name: "card",
  description: "Use `card` to display a summary for a single topic.",
  output: {
    element: "div",
    class: "clbr-card",
  },
  content: {
    kind: "slots",
    slots: [
      { prop: "title", kind: "text" },
      { prop: "description", kind: "html" },
      { prop: "note", kind: "html" },
    ],
  },
  props: {
    description: {
      description: "Supporting description shown below the `title`.",
      required: true,
      type: { kind: "html" },
    },
    headingLevel: {
      description:
        "Semantic heading level for the title. Renders a `<div>` when omitted.",
      type: { kind: "enum", values: [1, 2, 3, 4, 5, 6] },
    },
    href: {
      description: "Link destination for the `title`.",
      type: { kind: "string" },
    },
    note: {
      description: "Short note shown beneath the `description`.",
      type: { kind: "html" },
    },
    surface: {
      description: "Surface context.",
      type: {
        kind: "enum",
        values: ["default", "brand", "inverse", "brand-inverse"],
      },
    },
    title: {
      description: "Card title.",
      required: true,
      type: { kind: "text" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-clbr-surface",
        condition: { kind: "when-provided", prop: "surface" },
        value: { kind: "prop", prop: "surface" },
      },
    ],
  },
};
