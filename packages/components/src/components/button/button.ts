export type ClbrButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ClbrButtonSize = "sm" | "md" | "lg";
export type ClbrButtonType = "button" | "submit" | "reset";

export interface ClbrButtonProps {
  ariaLabel?: string;
  children: string;
  className?: string;
  disabled?: boolean;
  download?: string;
  href?: string;
  iconOnly?: boolean;
  loading?: boolean;
  rel?: string;
  size?: ClbrButtonSize;
  target?: string;
  type?: ClbrButtonType;
  variant?: ClbrButtonVariant;
}

const DEFAULTS = {
  size: "md" as ClbrButtonSize,
  type: "button" as ClbrButtonType,
  variant: "primary" as ClbrButtonVariant,
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function attrs(record: Record<string, string | boolean | undefined>): string {
  return Object.entries(record)
    .flatMap(([key, value]) => {
      if (value === false || value == null) return [];
      if (value === true) return [key];
      return [`${key}="${escapeHtml(String(value))}"`];
    })
    .join(" ");
}

function computeRel(target?: string, rel?: string): string | undefined {
  if (rel) return rel;
  if (target === "_blank") return "noopener noreferrer";
  return undefined;
}

function normalizeVariant(value?: string): ClbrButtonVariant {
  if (
    value === "primary" ||
    value === "secondary" ||
    value === "ghost" ||
    value === "danger"
  ) {
    return value;
  }
  return DEFAULTS.variant;
}

function normalizeSize(value?: string): ClbrButtonSize {
  if (value === "sm" || value === "md" || value === "lg") return value;
  return DEFAULTS.size;
}

function normalizeType(value?: string): ClbrButtonType {
  if (value === "button" || value === "submit" || value === "reset") {
    return value;
  }
  return DEFAULTS.type;
}

/**
 * Server-side renderer for Calibrate's button contract.
 *
 * Rules:
 * - `href` present => render `<a>`
 * - `href` absent => render `<button>`
 * - disabled/loading in link mode => `aria-disabled` + remove `href`
 * - `iconOnly` requires `ariaLabel`
 */
export function renderClbrButton(input: ClbrButtonProps): string {
  const variant = normalizeVariant(input.variant);
  const size = normalizeSize(input.size);
  const type = normalizeType(input.type);
  const isLink = Boolean(input.href);
  const isBlocked = Boolean(input.disabled || input.loading);

  if (input.iconOnly && !input.ariaLabel?.trim()) {
    throw new Error("renderClbrButton: `iconOnly` requires `ariaLabel`.");
  }

  const commonAttrs = {
    "aria-busy": input.loading ? "true" : undefined,
    "aria-label": input.ariaLabel,
    class: cx("clbr-button", input.className),
    "data-icon-only": String(Boolean(input.iconOnly)),
    "data-loading": String(Boolean(input.loading)),
    "data-size": size,
    "data-variant": variant,
  };

  const content = `<span class="clbr-button__label">${escapeHtml(input.children)}</span>`;

  if (isLink) {
    const linkAttrs = attrs({
      ...commonAttrs,
      "aria-disabled": isBlocked ? "true" : undefined,
      "data-mode": "link",
      download: input.download,
      href: isBlocked ? undefined : input.href,
      rel: computeRel(input.target, input.rel),
      tabindex: isBlocked ? "-1" : undefined,
      target: input.target,
    });

    return `<a ${linkAttrs}>${content}</a>`;
  }

  const buttonAttrs = attrs({
    ...commonAttrs,
    "data-mode": "button",
    disabled: isBlocked,
    type,
  });

  return `<button ${buttonAttrs}>${content}</button>`;
}
