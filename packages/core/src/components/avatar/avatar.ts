import { attrs, escapeHtml } from "../../helpers/html";
import { renderClbrIcon } from "../icon/icon";
import { getClbrInitials } from "./get-initials";

export type ClbrAvatarColor =
  | "neutral"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09";
export type ClbrAvatarEntity = "bot" | "organization" | "person" | "team";
export type ClbrAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const ENTITY_ICON_MAP: Record<ClbrAvatarEntity, string> = {
  bot: "bot",
  organization: "building-2",
  person: "user",
  team: "users",
};

const COLOR_HASH = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
] as const;

/** Props for the Calibrate avatar renderer. */
export interface ClbrAvatarProps {
  /**
   * Optional explicit accessible label.
   * Used before `name` fallback text.
   */
  alt?: string;
  /**
   * When true, emits `aria-hidden="true"` on the wrapper.
   * @default false
   */
  ariaHidden?: boolean;
  /**
   * Used to specify icon fallback if `src`, `initials`, and `name` are absent.
   * @default "person"
   */
  entity?: ClbrAvatarEntity;
  /**
   * Optional avatar background color token.
   * If omitted and `name` exists, color is hash-derived from `name` (01..09).
   * Falls back to `neutral` when not specified and no `name` is available.
   */
  color?: ClbrAvatarColor;
  /**
   * Explicit initials override.
   * Trimmed and whitespace-collapsed; must be alphabetic only, 1-3 characters.
   */
  initials?: string;
  /**
   * Full name used for accessible-label fallback and initials derivation.
   */
  name?: string;
  /**
   * Avatar size.
   * @default "xs"
   */
  size?: ClbrAvatarSize;
  /**
   * Image source URL.
   * Empty/whitespace is treated as missing.
   */
  src?: string;
}

function collapseWhitespace(value: string | undefined): string | undefined {
  if (value == null) return undefined;

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized || undefined;
}

function hashString(value: string): number {
  // djb2 seed constant for stable non-cryptographic string hashing.
  let hash = 5381;

  for (const char of value) {
    // djb2 mixes each char code with a 33x multiplier.
    hash = (hash * 33) ^ char.charCodeAt(0);
  }

  return hash >>> 0;
}

function normalizeInitials(initials: string | undefined): string | undefined {
  if (initials == null) return undefined;

  const normalized = collapseWhitespace(initials);

  if (!normalized) {
    return undefined;
  }

  if (normalized.length > 3) {
    throw new Error("initials must normalize to 3 characters or fewer.");
  }

  if (!/^[A-Za-z]{1,3}$/.test(normalized)) {
    throw new Error("initials must contain only alphabetic characters.");
  }

  return normalized;
}

function resolveAccessibleLabel({
  alt,
  ariaHidden,
  name,
}: {
  alt?: string;
  ariaHidden?: boolean;
  name?: string;
}): string | undefined {
  if (ariaHidden) return undefined;

  return collapseWhitespace(alt) || collapseWhitespace(name) || "Avatar";
}

function resolveAvatarColor({
  color,
  name,
}: {
  color?: ClbrAvatarColor;
  name?: string;
}): ClbrAvatarColor {
  if (color) return color;

  if (name) {
    const index = hashString(name) % COLOR_HASH.length;
    return COLOR_HASH[index];
  }

  return "neutral";
}

/**
 * SSR renderer for the Calibrate avatar component.
 *
 * @param props - Avatar component props.
 * @returns HTML string for an avatar wrapper with image/initials/icon content.
 */
export function renderClbrAvatar({
  alt,
  ariaHidden,
  color,
  entity = "person",
  initials,
  name,
  size = "xs",
  src,
}: ClbrAvatarProps): string {
  const normalizedInitials = normalizeInitials(initials);
  const normalizedName = collapseWhitespace(name);
  const normalizedSrc = collapseWhitespace(src);
  const accessibleLabel = resolveAccessibleLabel({
    alt,
    ariaHidden,
    name: normalizedName,
  });
  const derivedInitials = normalizedInitials || getClbrInitials(normalizedName);
  const renderAsImage = Boolean(normalizedSrc);
  const resolvedColor = resolveAvatarColor({
    color,
    name: normalizedName,
  });

  const avatarAttrs = attrs({
    "aria-hidden": ariaHidden ? "true" : undefined,
    "aria-label": !ariaHidden && !renderAsImage ? accessibleLabel : undefined,
    class: "avatar",
    "data-color": resolvedColor === "neutral" ? undefined : resolvedColor,
    "data-entity": entity === "person" ? undefined : entity,
    "data-size": size,
    role: !ariaHidden && !renderAsImage ? "img" : undefined,
  });

  if (renderAsImage) {
    const imgAttrs = attrs({
      alt: ariaHidden ? "" : accessibleLabel || "",
      class: "img",
      src: normalizedSrc,
    });

    return `<span ${avatarAttrs}><img ${imgAttrs}></span>`;
  }

  if (derivedInitials) {
    return `<span ${avatarAttrs}><span class="initials">${escapeHtml(derivedInitials)}</span></span>`;
  }

  const iconMarkup = renderClbrIcon({
    ariaHidden: true,
    name: ENTITY_ICON_MAP[entity],
    size: "fill",
  });

  return `<span ${avatarAttrs}><span class="icon-wrapper">${iconMarkup}</span></span>`;
}

/** Declarative avatar contract mirror for tooling, docs, and adapters. */
export const CLBR_AVATAR_SPEC = {
  name: "avatar",
  output: {
    element: "span",
    variants: ["image", "initials", "icon"],
  },
  props: {
    alt: {
      required: false,
      type: "string",
    },
    ariaHidden: {
      default: false,
      required: false,
      type: "boolean",
    },
    entity: {
      default: "person",
      required: false,
      type: "enum",
      values: ["bot", "organization", "person", "team"],
    },
    color: {
      required: false,
      type: "enum",
      values: ["neutral", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
    },
    initials: {
      constraints: [
        "trimmed",
        "collapsedWhitespace",
        "empty becomes omitted",
        "length <= 3",
        "alphabetic only (A-Z, a-z)",
      ],
      required: false,
      type: "string",
    },
    name: {
      required: false,
      type: "string",
    },
    size: {
      default: "xs",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl"],
    },
    src: {
      required: false,
      type: "string",
    },
  },
  rules: {
    precedence: [
      "src",
      "initials",
      "name-derived initials",
      "entity fallback icon",
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "avatar",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-color",
        value: "{color|hash(name)|neutral}",
        when: "resolved color is non-default (not neutral)",
      },
      {
        behavior: "emit",
        target: "data-entity",
        value: "{entity}",
        when: "entity is bot, organization, or team",
      },
      {
        behavior: "emit",
        target: "aria-hidden",
        value: "true",
        when: "ariaHidden is true",
      },
      {
        behavior: "emit",
        target: "role",
        value: "img",
        when: "ariaHidden is false or omitted and variant is initials or icon",
      },
      {
        behavior: "emit",
        target: "aria-label",
        value: "{alt|name|Avatar}",
        when: "ariaHidden is false or omitted and variant is initials or icon",
      },
    ],
  },
} as const;

export { getClbrInitials } from "./get-initials";
