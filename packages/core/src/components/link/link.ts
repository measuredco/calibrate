import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrLinkSize = "sm" | "md";
export type ClbrLinkTarget = "_blank" | "_parent" | "_self" | "_top";
export type ClbrLinkTone = "default" | "neutral";

export interface ClbrLinkProps {
  /** Link destination. */
  href: string;
  /**
   * Optional icon markup rendered alongside the label.
   * Caller is responsible for sanitizing untrusted content.
   */
  icon?: string;
  /** Accessible label text rendered as content (escaped before render). */
  label: string;
  /** Optional explicit `rel` value. */
  rel?: string;
  /**
   * Size variant.
   * @default "md"
   */
  size?: ClbrLinkSize;
  /** Optional link target. */
  target?: ClbrLinkTarget;
  /**
   * Tone variant.
   * @default "default"
   */
  tone?: ClbrLinkTone;
  /**
   * Underline variant.
   * Emits `data-underline` only when true.
   * @default false
   */
  underline?: boolean;
}

/**
 * SSR renderer for the Calibrate link component.
 *
 * @param props - Link component props.
 * @returns HTML string for an `<a>` element.
 * @remarks
 * - `label` is escaped before render
 * - `icon`, when provided, is rendered as trusted inline markup
 */
export function renderClbrLink(props: ClbrLinkProps): string {
  const {
    href,
    icon,
    label,
    rel,
    size = "md",
    target,
    tone,
    underline,
  } = props;

  const normalizedRel = rel || undefined;
  const normalizedTarget = target || undefined;
  const normalizedIcon = icon?.trim() || undefined;
  const content = normalizedIcon
    ? `<span class="icon-wrapper">${normalizedIcon}</span><span class="label">${escapeHtml(label)}</span>`
    : `<span class="label">${escapeHtml(label)}</span>`;
  const linkAttrs = attrs({
    class: "link",
    href,
    rel: normalizedRel,
    target: normalizedTarget,
    "data-size": size,
    "data-tone": tone === "neutral" ? "neutral" : undefined,
    "data-underline": underline || undefined,
  });

  return `<a ${linkAttrs}>${content}</a>`;
}

/** Declarative link contract mirror for tooling, docs, and adapters. */
export const CLBR_LINK_SPEC = {
  name: "link",
  output: {
    default: "a",
  },
  props: {
    href: {
      required: true,
      type: "string",
    },
    icon: {
      required: false,
      type: "html",
    },
    label: {
      required: true,
      type: "text",
    },
    rel: {
      required: false,
      type: "string",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    target: {
      required: false,
      type: "enum",
      values: ["_blank", "_parent", "_self", "_top"],
    },
    tone: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "neutral"],
    },
    underline: {
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
        value: "link",
      },
      {
        behavior: "emit",
        target: "href",
        value: "{href}",
        when: "href is provided",
      },
      {
        behavior: "emit",
        target: "rel",
        value: "{rel}",
        when: "rel is non-empty",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "target",
        value: "{target}",
        when: "target is non-empty",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "neutral",
        when: "tone is neutral",
      },
      {
        behavior: "emit",
        target: "data-underline",
        value: "present",
        when: "underline is true",
      },
    ],
    content: [
      {
        behavior: "emit",
        element: "span.icon-wrapper",
        value: "{icon}",
        when: "icon is a non-empty string",
      },
      {
        behavior: "always",
        element: "span.label",
        value: "{label}",
      },
    ],
  },
} as const;
