import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrLinkSize = "sm" | "md";
export type ClbrLinkTarget = "_blank" | "_parent" | "_self" | "_top";
export type ClbrLinkTone = "default" | "neutral";

export interface ClbrLinkProps {
  /** Link destination. */
  href: string;
  /** Optional icon markup rendered alongside the label. Caller sanitizes untrusted content. */
  icon?: string;
  /** Accessible label text rendered as content (escaped before render). */
  label: string;
  /** Optional explicit `rel` value. */
  rel?: string;
  /** Size variant. @default "md" */
  size?: ClbrLinkSize;
  /** Optional link target. */
  target?: ClbrLinkTarget;
  /** Tone variant. @default "default" */
  tone?: ClbrLinkTone;
  /** Underline variant; emits `data-underline` only when true. @default false */
  underline?: boolean;
}

/**
 * Builds the IR tree for the Calibrate link component.
 *
 * @param props - Link component props.
 * @returns IR node for an `<a>` element.
 * @remarks
 * - `label` is escaped before render
 * - `icon`, when provided, is rendered as trusted inline markup
 */
export function buildClbrLink(props: ClbrLinkProps): ClbrNode {
  const {
    href,
    icon,
    label,
    rel,
    size = "md",
    target,
    tone = "default",
    underline,
  } = props;

  const normalizedIcon = icon?.trim() || undefined;
  const children: ClbrNode[] = [];
  if (normalizedIcon) {
    children.push({
      kind: "element",
      tag: "span",
      attrs: { class: "icon-wrapper" },
      children: [{ kind: "raw", html: normalizedIcon }],
    });
  }
  children.push({
    kind: "element",
    tag: "span",
    attrs: { class: "label" },
    children: [{ kind: "text", value: label }],
  });

  return {
    kind: "element",
    tag: "a",
    attrs: {
      class: "clbr-link",
      href,
      rel: rel || undefined,
      target: target || undefined,
      "data-size": size,
      "data-tone": tone === "neutral" ? "neutral" : undefined,
      "data-underline": underline || undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Calibrate link component.
 *
 * @param props - Link component props.
 * @returns HTML string for an `<a>` element.
 */
export function renderClbrLink(props: ClbrLinkProps): string {
  return serializeClbrNode(buildClbrLink(props));
}

/** Declarative link contract mirror for tooling, docs, and adapters. */
export const CLBR_LINK_SPEC: ClbrComponentSpec = {
  name: "link",
  description: "Use `link` to navigate to another page or resource.",
  output: { element: "a", class: "clbr-link" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "icon", kind: "html" },
    ],
  },
  props: {
    href: {
      description: "Link destination.",
      required: true,
      type: { kind: "string" },
    },
    icon: {
      description:
        "Icon markup shown alongside the label. Calibrate icon component, or SVG markup from https://simpleicons.org/ for third-party logos.",
      type: { kind: "html" },
    },
    label: {
      description: "Accessible label.",
      required: true,
      type: { kind: "text" },
    },
    rel: {
      description: "Explicit `rel` attribute.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    target: {
      description: "Where to open the link.",
      type: {
        kind: "enum",
        values: ["_blank", "_parent", "_self", "_top"],
      },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "neutral"] },
    },
    underline: {
      default: false,
      description: "Underlines the link.",
      type: { kind: "boolean" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "href",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "href" },
      },
      {
        target: { on: "host" },
        attribute: "rel",
        condition: { kind: "when-non-empty", prop: "rel" },
        value: { kind: "prop", prop: "rel" },
      },
      {
        target: { on: "host" },
        attribute: "target",
        condition: { kind: "when-provided", prop: "target" },
        value: { kind: "prop", prop: "target" },
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
        condition: { kind: "when-equals", prop: "tone", to: "neutral" },
        value: { kind: "literal", text: "neutral" },
      },
      {
        target: { on: "host" },
        attribute: "data-underline",
        condition: { kind: "when-truthy", prop: "underline" },
      },
    ],
  },
};
