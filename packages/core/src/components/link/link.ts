import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";

export type ClbrLinkAppearance = "outline" | "solid" | "text";
export type ClbrLinkLabelVisibility =
  | "visible"
  | "hidden"
  | "hiddenBelowTablet";
export type ClbrLinkPlacement = "start" | "end";
export type ClbrLinkSize = "sm" | "md" | "lg";
export type ClbrLinkTarget = "_blank" | "_parent" | "_self" | "_top";
export type ClbrLinkTone = "default" | "neutral";

export interface ClbrLinkProps {
  /**
   * Visual appearance. Defaults to the plain link style (`"text"`); set
   * `"outline"` or `"solid"` for button-like treatments.
   * @default "text"
   */
  appearance?: ClbrLinkAppearance;
  /** Optional `download` attribute (`true` or suggested filename). */
  download?: boolean | string;
  /** Link destination. */
  href: string;
  /** Optional icon markup rendered alongside the label. Caller sanitizes untrusted content. */
  icon?: string;
  /**
   * Icon placement when icon is present.
   * @default "start"
   */
  iconPlacement?: ClbrLinkPlacement;
  /** Accessible label text rendered as content (escaped before render). */
  label: string;
  /**
   * Controls whether the visible label is shown alongside the icon.
   * Non-visible values require `icon`.
   * @default "visible"
   */
  labelVisibility?: ClbrLinkLabelVisibility;
  /** Optional explicit `rel` value. Ignored when `download` is set. */
  rel?: string;
  /** Size variant. @default "md" */
  size?: ClbrLinkSize;
  /** Optional link target. Ignored when `download` is set. */
  target?: ClbrLinkTarget;
  /** Tone variant. @default "default" */
  tone?: ClbrLinkTone;
  /**
   * Underline variant; emits `data-underline` only when true.
   * Ignored when `appearance` is not `"text"`.
   * @default false
   */
  underline?: boolean;
}

function normalizeDownload(
  value?: boolean | string,
): string | boolean | undefined {
  if (!value) return undefined;
  if (value === true) return true;
  return value;
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
    appearance = "text",
    download,
    href,
    icon,
    iconPlacement = "start",
    label,
    labelVisibility = "visible",
    rel,
    size = "md",
    target,
    tone = "default",
    underline,
  } = props;

  const normalizedIcon = icon?.trim() || undefined;
  const hasIcon = Boolean(normalizedIcon);

  if (labelVisibility !== "visible" && !hasIcon) {
    throw new Error("labelVisibility requires icon when label is not visible.");
  }

  const normalizedDownload = normalizeDownload(download);

  const iconNode: ClbrNode | null = normalizedIcon
    ? {
        kind: "element",
        tag: "span",
        attrs: { class: "icon-wrapper" },
        children: [{ kind: "raw", html: normalizedIcon }],
      }
    : null;

  const labelNode: ClbrNode = {
    kind: "element",
    tag: "span",
    attrs: { class: "label" },
    children: [{ kind: "text", value: label }],
  };

  const children: ClbrNode[] = iconNode
    ? iconPlacement === "end"
      ? [labelNode, iconNode]
      : [iconNode, labelNode]
    : [labelNode];

  return {
    kind: "element",
    tag: "a",
    attrs: {
      class: "clbr-link",
      "data-appearance": appearance === "text" ? undefined : appearance,
      "data-label-visibility":
        labelVisibility === "visible" ? undefined : labelVisibility,
      "data-size": size,
      "data-tone": tone === "neutral" ? "neutral" : undefined,
      "data-underline": underline && appearance === "text" ? true : undefined,
      download: normalizedDownload,
      href,
      rel: normalizedDownload ? undefined : rel || undefined,
      target: normalizedDownload ? undefined : target || undefined,
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
    appearance: {
      default: "text",
      description:
        "Visual appearance. `text` is a standard link; `outline` and `solid` give button-styled treatments. ",
      type: { kind: "enum", values: ["outline", "solid", "text"] },
    },
    download: {
      description:
        "Saves the target instead of navigating. Pass a filename or `true`.",
      type: {
        kind: "union",
        variants: [{ kind: "boolean" }, { kind: "string" }],
      },
    },
    href: {
      description: "Link destination.",
      required: true,
      type: { kind: "string" },
    },
    icon: {
      description:
        "Icon markup shown alongside the label. Calibrate icon component, or SVG markup from https://simpleicons.org/ for third-party logos.",
      requiredWhen: "`labelVisibility` is hidden or hiddenBelowTablet",
      type: { kind: "html" },
    },
    iconPlacement: {
      default: "start",
      description: "Where the icon sits relative to the label.",
      ignoredWhen: "`icon` is omitted",
      type: { kind: "enum", values: ["start", "end"] },
    },
    label: {
      description: "Accessible label.",
      required: true,
      type: { kind: "text" },
    },
    labelVisibility: {
      default: "visible",
      description: "How the label is shown. Hidden values require an icon.",
      type: {
        kind: "enum",
        values: ["visible", "hidden", "hiddenBelowTablet"],
      },
    },
    rel: {
      description: "Explicit `rel` attribute.",
      ignoredWhen: "`download` is set",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
    target: {
      description: "Where to open the link.",
      ignoredWhen: "`download` is set",
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
      ignoredWhen: "`appearance` is not `text`",
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
        attribute: "download",
        condition: { kind: "when-truthy", prop: "download" },
        value: { kind: "prop", prop: "download" },
      },
      {
        target: { on: "host" },
        attribute: "rel",
        condition: {
          kind: "all",
          of: [
            { kind: "when-non-empty", prop: "rel" },
            { kind: "not", of: { kind: "when-truthy", prop: "download" } },
          ],
        },
        value: { kind: "prop", prop: "rel" },
      },
      {
        target: { on: "host" },
        attribute: "target",
        condition: {
          kind: "all",
          of: [
            { kind: "when-provided", prop: "target" },
            { kind: "not", of: { kind: "when-truthy", prop: "download" } },
          ],
        },
        value: { kind: "prop", prop: "target" },
      },
      {
        target: { on: "host" },
        attribute: "data-appearance",
        condition: {
          kind: "when-in",
          prop: "appearance",
          values: ["outline", "solid"],
        },
        value: { kind: "prop", prop: "appearance" },
      },
      {
        target: { on: "host" },
        attribute: "data-label-visibility",
        condition: {
          kind: "when-in",
          prop: "labelVisibility",
          values: ["hidden", "hiddenBelowTablet"],
        },
        value: { kind: "prop", prop: "labelVisibility" },
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
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "underline" },
            { kind: "when-equals", prop: "appearance", to: "text" },
          ],
        },
      },
    ],
  },
};
