import { icons } from "lucide";
import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";

type LucideSvgAttrs = Record<string, string | number | undefined>;
type LucideIconNode = Array<[tag: string, attrs: LucideSvgAttrs]>;

const LUCIDE_ICONS = icons as Record<string, LucideIconNode>;

export const CLBR_ICON_RECOMMENDED = [
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "arrow-right-left",
  "arrow-up",
  "arrow-up-down",
  "bot",
  "building-2",
  "chevron-down",
  "chevron-right",
  "circle",
  "circle-alert",
  "circle-check",
  "copy",
  "corner-down-left",
  "corner-down-right",
  "corner-up-left",
  "corner-up-right",
  "dice-5",
  "download",
  "info",
  "layers",
  "menu",
  "panel-left",
  "settings",
  "shuffle",
  "sliders-horizontal",
  "square",
  "sun-moon",
  "swatch-book",
  "triangle-alert",
  "user",
  "users",
  "x",
] as const;

export type ClbrIconMirrorMode = "always" | "rtl";
export type ClbrIconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "fill";

export interface ClbrIconProps {
  /** Emits `aria-hidden="true"` when true. @default false */
  ariaHidden?: boolean;
  /** SVG title text. Required when `ariaHidden` is false. */
  title?: string;
  /** ID for `<title>` referenced via `aria-labelledby`. Required when `ariaHidden` is false. */
  titleId?: string;
  /** Lucide icon name (kebab-case, camelCase, or PascalCase). See https://lucide.dev/icons/ */
  name: string;
  /** Horizontal mirroring behavior. Omit for no mirroring. */
  mirrored?: ClbrIconMirrorMode;
  /** Size variant. @default "md" */
  size?: ClbrIconSize;
}

function normalizeLucideKey(name: string): string {
  if (!name) return name;

  // kebab/snake/space forms: `arrow-right` -> `ArrowRight`
  if (/[-_\s]/.test(name)) {
    return name
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  // camelCase form: `arrowRight` -> `ArrowRight`
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function resolveIconNode(name: string): LucideIconNode | undefined {
  const direct = LUCIDE_ICONS[name];
  if (direct) return direct;

  const normalizedKey = normalizeLucideKey(name);
  return LUCIDE_ICONS[normalizedKey];
}

function serializeIconNode(iconNode: LucideIconNode): string {
  return iconNode
    .map(([tag, nodeAttrs]) => {
      const serializedAttrs = attrs(
        Object.fromEntries(
          Object.entries(nodeAttrs).map(([key, value]) => [
            key,
            value == null ? undefined : String(value),
          ]),
        ),
      );

      return `<${tag} ${serializedAttrs}></${tag}>`;
    })
    .join("");
}

/**
 * SSR renderer for the Calibrate icon component.
 *
 * Emits inline `<svg>` markup for the Lucide icon set.
 *
 * @param props - Icon component props.
 * @returns HTML string for the Calibrate icon component.
 */
export function renderClbrIcon({
  ariaHidden,
  mirrored,
  name,
  size = "md",
  title,
  titleId,
}: ClbrIconProps): string {
  const iconNode = resolveIconNode(name);

  if (!iconNode) {
    throw new Error(`Unknown Lucide icon name: ${name}`);
  }

  const normalizedTitle = title?.trim();
  const normalizedTitleId = titleId?.trim();

  if (!ariaHidden && !normalizedTitle) {
    throw new Error("title must be non-empty when ariaHidden is false.");
  }

  if (!ariaHidden && !normalizedTitleId) {
    throw new Error("titleId must be non-empty when ariaHidden is false.");
  }

  if (!ariaHidden && !isValidHtmlId(normalizedTitleId!)) {
    throw new Error(
      "titleId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const titleNode = !ariaHidden
    ? `<title id="${normalizedTitleId}">${escapeHtml(normalizedTitle!)}</title>`
    : "";

  const svgAttrs = attrs({
    "aria-hidden": ariaHidden ? "true" : undefined,
    "aria-labelledby": !ariaHidden ? normalizedTitleId : undefined,
    class: "clbr-icon",
    "data-mirrored": mirrored,
    "data-size": size,
    fill: "none",
    height: "24",
    role: !ariaHidden ? "img" : undefined,
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  });

  return `<svg ${svgAttrs}>${titleNode}${serializeIconNode(iconNode)}</svg>`;
}

/** Declarative icon contract mirror for tooling, docs, and adapters. */
export const CLBR_ICON_SPEC: ClbrStructuredSpec = {
  name: "icon",
  description: "Use `icon` to render a Lucide icon.",
  output: { element: "svg", class: "clbr-icon" },
  content: { kind: "none" },
  props: {
    ariaHidden: {
      default: false,
      description: "Hides the icon from assistive technology.",
      type: { kind: "boolean" },
    },
    mirrored: {
      description: "Mirrors the icon horizontally.",
      type: { kind: "enum", values: ["always", "rtl"] },
    },
    name: {
      description: "Lucide icon name.",
      required: true,
      type: { kind: "iconName" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["2xs", "xs", "sm", "md", "lg", "fill"],
      },
    },
    title: {
      description: "Accessible title announced by assistive technology.",
      requiredWhen: "`ariaHidden` is false or omitted",
      type: { kind: "string" },
    },
    titleId: {
      description: "`id` for the accessible `title` element.",
      requiredWhen: "`ariaHidden` is false or omitted",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "aria-hidden",
        condition: { kind: "when-truthy", prop: "ariaHidden" },
        value: { kind: "literal", text: "true" },
      },
      {
        target: { on: "host" },
        attribute: "data-mirrored",
        condition: { kind: "when-provided", prop: "mirrored" },
        value: { kind: "prop", prop: "mirrored" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "fill",
        condition: { kind: "always" },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "host" },
        attribute: "height",
        condition: { kind: "always" },
        value: { kind: "literal", text: "24" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: { kind: "not", of: { kind: "when-truthy", prop: "ariaHidden" } },
        value: { kind: "literal", text: "img" },
      },
      {
        target: { on: "host" },
        attribute: "stroke",
        condition: { kind: "always" },
        value: { kind: "literal", text: "currentColor" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-linecap",
        condition: { kind: "always" },
        value: { kind: "literal", text: "round" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-linejoin",
        condition: { kind: "always" },
        value: { kind: "literal", text: "round" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-width",
        condition: { kind: "always" },
        value: { kind: "literal", text: "2" },
      },
      {
        target: { on: "host" },
        attribute: "viewBox",
        condition: { kind: "always" },
        value: { kind: "literal", text: "0 0 24 24" },
      },
      {
        target: { on: "host" },
        attribute: "xmlns",
        condition: { kind: "always" },
        value: { kind: "literal", text: "http://www.w3.org/2000/svg" },
      },
    ],
  },
};
