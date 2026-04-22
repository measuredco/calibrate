import { icons } from "lucide";
import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";

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
    class: "icon",
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
export const CLBR_ICON_SPEC = {
  name: "icon",
  description: "Use `icon` to render a Lucide icon inline.",
  output: {
    element: "svg",
  },
  props: {
    ariaHidden: {
      default: false,
      description: "Hides the icon from assistive technology.",
      required: false,
      type: "boolean",
    },
    mirrored: {
      description: "Mirrors the icon horizontally.",
      required: false,
      type: "enum",
      values: ["always", "rtl"],
    },
    name: {
      description: "Lucide icon name.",
      format: "lucide-icon-name",
      required: true,
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["2xs", "xs", "sm", "md", "lg", "fill"],
    },
    title: {
      description: "Accessible title announced by assistive technology.",
      required: false,
      requiredWhen: "`ariaHidden` is false or omitted",
      type: "string",
    },
    titleId: {
      constraints: ["non-empty", "validHtmlId"],
      description: "HTML id for the accessible `title` element.",
      required: false,
      requiredWhen: "`ariaHidden` is false or omitted",
      type: "string",
    },
  },
  recommendations: {
    iconNames: CLBR_ICON_RECOMMENDED,
  },
  rules: {
    attributes: [
      {
        behavior: "emit",
        target: "aria-hidden",
        value: "true",
        when: "ariaHidden is true",
      },
      {
        behavior: "emit",
        target: "aria-labelledby",
        value: "{titleId}",
        when: "ariaHidden is false or omitted",
      },
      {
        behavior: "always",
        target: "class",
        value: "icon",
      },
      {
        behavior: "emit",
        target: "data-mirrored",
        value: "{mirrored}",
        when: "mirrored is provided",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "always",
        target: "fill",
        value: "none",
      },
      {
        behavior: "always",
        target: "height",
        value: "24",
      },
      {
        behavior: "emit",
        target: "role",
        value: "img",
        when: "ariaHidden is false or omitted",
      },
      {
        behavior: "always",
        target: "stroke",
        value: "currentColor",
      },
      {
        behavior: "always",
        target: "stroke-linecap",
        value: "round",
      },
      {
        behavior: "always",
        target: "stroke-linejoin",
        value: "round",
      },
      {
        behavior: "always",
        target: "stroke-width",
        value: "2",
      },
      {
        behavior: "always",
        target: "viewBox",
        value: "0 0 24 24",
      },
      {
        behavior: "always",
        target: "xmlns",
        value: "http://www.w3.org/2000/svg",
      },
    ],
    content: [
      {
        behavior: "emit",
        element: "title",
        when: "ariaHidden is false or omitted",
      },
    ],
  },
} as const;
