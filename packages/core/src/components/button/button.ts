import { attrs, escapeHtml } from "../../helpers/html";
import { type ClbrIconMirrorMode, renderClbrIcon } from "../icon/icon";

export type ClbrButtonAppearance = "outline" | "solid" | "text";
export type ClbrButtonLabelVisibility =
  | "visible"
  | "hidden"
  | "hiddenBelowTablet";
export type ClbrButtonMode = "button" | "link";
export type ClbrButtonPlacement = "start" | "end";
export type ClbrButtonSize = "sm" | "md" | "lg";
export type ClbrButtonTone = "brand" | "neutral";
export type ClbrButtonType = "button" | "submit";
export type ClbrLinkTarget = "_blank" | "_parent" | "_self" | "_top";

export interface ClbrButtonCommonProps {
  /**
   * Structural style.
   * @default "outline"
   */
  appearance?: ClbrButtonAppearance;
  /** Optional icon name (Lucide naming semantics). */
  icon?: string;
  /** Optional icon mirroring mode. Ignored when `icon` is omitted. */
  iconMirrored?: ClbrIconMirrorMode;
  /**
   * Icon placement when icon is present.
   * @default "start"
   */
  iconPlacement?: ClbrButtonPlacement;
  /** Accessible name text rendered as content (escaped before render). */
  label: string;
  /**
   * Controls whether the visible label is shown alongside the icon.
   * Non-visible values require `icon`.
   * @default "visible"
   */
  labelVisibility?: ClbrButtonLabelVisibility;
  /**
   * Size variant.
   * @default "md"
   */
  size?: ClbrButtonSize;
  /**
   * Semantic color intent.
   * @default "brand"
   */
  tone?: ClbrButtonTone;
}

/** Button-mode props. */
export interface ClbrButtonElementProps extends ClbrButtonCommonProps {
  /**
   * Disables interaction in button mode.
   * @default false
   */
  disabled?: boolean;
  /** Optional form owner ID for button mode. */
  form?: string;
  /**
   * Button render mode.
   * @default "button"
   */
  mode?: "button";
  /** Optional submitted field name for button mode. */
  name?: string;
  /**
   * Native button type.
   * @default "button"
   */
  type?: ClbrButtonType;
  /** Optional submitted field value for button mode. */
  value?: string;
}

/** Link-mode props. Requires `mode: "link"` and `href`. */
export interface ClbrButtonLinkProps extends ClbrButtonCommonProps {
  /** Optional `download` attribute (`true` or suggested filename). */
  download?: boolean | string;
  /** Link destination. */
  href: string;
  /** Link render mode. */
  mode: "link";
  /** Optional explicit `rel` value for link mode. Ignored when `download` is set. */
  rel?: string;
  /** Optional link target for link mode. Ignored when `download` is set. */
  target?: ClbrLinkTarget;
}

/** Props for the Calibrate button renderer. */
export type ClbrButtonProps = ClbrButtonElementProps | ClbrButtonLinkProps;

function normalizeDownload(
  value?: boolean | string,
): string | boolean | undefined {
  if (!value) return undefined;
  if (value === true) return true;
  return value;
}

/**
 * SSR renderer for the Calibrate button component.
 *
 * @param props - Button component props.
 * @returns HTML string for either `<button>` or `<a>` mode.
 * @remarks
 * - `mode="button"` (or omitted) -> render `<button>`
 * - button mode ignores link-only `download`, `rel`, and `target`
 * - `mode="link"` -> render `<a>`
 * - link mode ignores button-only `disabled`, and `type`
 * - link mode ignores `rel` and `target` when `download` is set
 */
export function renderClbrButton(props: ClbrButtonProps): string {
  const {
    appearance = "outline",
    icon,
    iconMirrored,
    iconPlacement = "start",
    label,
    labelVisibility = "visible",
    size = "md",
    tone = "brand",
  } = props;

  const normalizedIconName = icon?.trim() || undefined;
  const hasIcon = Boolean(normalizedIconName);

  if (labelVisibility !== "visible" && !hasIcon) {
    throw new Error("labelVisibility requires icon when label is not visible.");
  }

  let iconMarkup = "";

  if (hasIcon && normalizedIconName) {
    iconMarkup = `<span class="icon-wrapper">${renderClbrIcon({
      ariaHidden: true,
      mirrored: iconMirrored,
      name: normalizedIconName,
      size: "fill",
    })}</span>`;
  }

  const labelMarkup = `<span class="label">${escapeHtml(label)}</span>`;
  const content = hasIcon
    ? iconPlacement === "end"
      ? `${labelMarkup}${iconMarkup}`
      : `${iconMarkup}${labelMarkup}`
    : labelMarkup;
  const commonAttrs = {
    class: "button",
    "data-appearance": appearance,
    "data-label-visibility":
      labelVisibility === "visible" ? undefined : labelVisibility,
    "data-size": size,
    "data-tone": tone,
  };

  // Keep discriminant check on `props.mode` so TypeScript narrows the union.
  if (props.mode === "link") {
    const { download, href, rel, target } = props;
    const normalizedDownload = normalizeDownload(download);
    const normalizedRel = rel || undefined;
    const normalizedTarget = target || undefined;
    const linkAttrs = attrs({
      ...commonAttrs,
      "data-mode": "link",
      href,
      download: normalizedDownload,
      rel: normalizedDownload ? undefined : normalizedRel,
      target: normalizedDownload ? undefined : normalizedTarget,
    });

    return `<a ${linkAttrs}>${content}</a>`;
  }

  const { disabled, form, name, type, value } = props;
  const buttonAttrs = attrs({
    ...commonAttrs,
    "data-mode": "button",
    disabled: Boolean(disabled),
    form: form || undefined,
    name: name || undefined,
    type: type || "button",
    value: value || undefined,
  });

  return `<button ${buttonAttrs}>${content}</button>`;
}

/** Declarative button contract mirror for tooling, docs, and adapters. */
export const CLBR_BUTTON_SPEC = {
  name: "button",
  output: {
    modes: {
      button: "button",
      link: "a",
    },
  },
  props: {
    appearance: {
      default: "outline",
      required: false,
      type: "enum",
      values: ["outline", "solid", "text"],
    },
    disabled: {
      default: false,
      ignoredWhen: "mode is link",
      required: false,
      type: "boolean",
    },
    download: {
      ignoredWhen: "mode is button",
      required: false,
      type: "boolean|string",
    },
    form: {
      ignoredWhen: "mode is link",
      required: false,
      type: "string",
    },
    href: {
      required: false,
      requiredWhen: "mode is link",
      type: "string",
    },
    icon: {
      requiredWhen: "labelVisibility is hidden or hiddenBelowTablet",
      required: false,
      type: "string",
    },
    iconMirrored: {
      ignoredWhen: "icon is omitted",
      required: false,
      type: "enum",
      values: ["always", "rtl"],
    },
    iconPlacement: {
      default: "start",
      ignoredWhen: "icon is omitted",
      required: false,
      type: "enum",
      values: ["start", "end"],
    },
    labelVisibility: {
      default: "visible",
      required: false,
      type: "enum",
      values: ["visible", "hidden", "hiddenBelowTablet"],
    },
    label: {
      required: true,
      type: "text",
    },
    name: {
      ignoredWhen: "mode is link",
      required: false,
      type: "string",
    },
    mode: {
      default: "button",
      required: false,
      type: "enum",
      values: ["button", "link"],
    },
    rel: {
      ignoredWhen: "mode is button or download is set",
      required: false,
      type: "string",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md", "lg"],
    },
    target: {
      ignoredWhen: "mode is button or download is set",
      required: false,
      type: "enum",
      values: ["_blank", "_parent", "_self", "_top"],
    },
    tone: {
      default: "brand",
      required: false,
      type: "enum",
      values: ["brand", "neutral"],
    },
    type: {
      default: "button",
      ignoredWhen: "mode is link",
      required: false,
      type: "enum",
      values: ["button", "submit"],
    },
    value: {
      ignoredWhen: "mode is link",
      required: false,
      type: "string",
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "a",
        when: "mode is link",
      },
      {
        behavior: "render-as",
        value: "button",
        when: "mode is button or omitted",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "button",
      },
      {
        behavior: "always",
        target: "data-appearance",
        value: "{appearance}",
      },
      {
        behavior: "emit",
        target: "data-label-visibility",
        value: "{labelVisibility}",
        when: "labelVisibility is hidden or hiddenBelowTablet",
      },
      {
        behavior: "emit",
        target: "data-mode",
        value: "button",
        when: "mode is button or omitted",
      },
      {
        behavior: "emit",
        target: "data-mode",
        value: "link",
        when: "mode is link",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "always",
        target: "data-tone",
        value: "{tone}",
      },
      {
        behavior: "emit",
        target: "disabled",
        value: "true",
        when: "mode is button and disabled is true",
      },
      {
        behavior: "emit",
        target: "download",
        value: "{download}",
        when: "mode is link and download is true or a non-empty string",
      },
      {
        behavior: "emit",
        target: "form",
        value: "{form}",
        when: "mode is button and form is non-empty",
      },
      {
        behavior: "emit",
        target: "href",
        value: "{href}",
        when: "mode is link",
      },
      {
        behavior: "emit",
        target: "name",
        value: "{name}",
        when: "mode is button and name is non-empty",
      },
      {
        behavior: "emit",
        target: "rel",
        value: "{rel}",
        when: "mode is link, rel is non-empty, and download is omitted",
      },
      {
        behavior: "emit",
        target: "target",
        value: "{target}",
        when: "mode is link, target is non-empty, and download is omitted",
      },
      {
        behavior: "emit",
        target: "type",
        value: "{type}",
        when: "mode is button",
      },
      {
        behavior: "emit",
        target: "value",
        value: "{value}",
        when: "mode is button and value is non-empty",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "span.label",
        value: "{label}",
      },
      {
        behavior: "emit",
        element: "span.icon-wrapper",
        value:
          "renderClbrIcon({ name: icon, ariaHidden: true, mirrored: iconMirrored, size: 'fill' })",
        when: "icon is a non-empty string",
      },
      {
        behavior: "order",
        value: ["span.icon-wrapper", "span.label"],
        when: "icon is a non-empty string and iconPlacement is start or omitted",
      },
      {
        behavior: "order",
        value: ["span.label", "span.icon-wrapper"],
        when: "icon is a non-empty string and iconPlacement is end",
      },
    ],
  },
} as const;
