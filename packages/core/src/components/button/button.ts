import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";
import type { ClbrLinkTarget } from "../link/link";
import { type ClbrIconMirrorMode, renderClbrIcon } from "../icon/icon";

export type ClbrButtonAppearance = "outline" | "solid" | "text";
export type ClbrButtonHasPopup = "menu";
export type ClbrButtonLabelVisibility =
  | "visible"
  | "hidden"
  | "hiddenBelowTablet";
export type ClbrButtonMode = "button" | "link";
export type ClbrButtonPlacement = "start" | "end";
export type ClbrButtonSize = "sm" | "md" | "lg";
export type ClbrButtonTone = "default" | "neutral";
export type ClbrButtonType = "button" | "submit";

export interface ClbrButtonCommonProps {
  /**
   * Structural style.
   * @default "outline"
   */
  appearance?: ClbrButtonAppearance;
  /** Optional DOM id. */
  id?: string;
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
   * @default "default"
   */
  tone?: ClbrButtonTone;
}

/** Button-mode props. */
export interface ClbrButtonElementProps extends ClbrButtonCommonProps {
  /**
   * Controlled element id for disclosure-style button interactions.
   * Ignored when `disclosure` is false or omitted.
   */
  controls?: string;
  /**
   * Emits `aria-expanded="false"` for disclosure-style button interactions.
   * SSR renderers are expected to update the attribute at runtime if state changes.
   * Ignored in link mode.
   * @default false
   */
  disclosure?: boolean;
  /**
   * Popup type for button interactions.
   * Ignored in link mode.
   */
  haspopup?: ClbrButtonHasPopup;
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
    id,
    icon,
    iconMirrored,
    iconPlacement = "start",
    label,
    labelVisibility = "visible",
    size = "md",
    tone = "default",
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
    class: "clbr-button",
    "data-appearance": appearance,
    "data-label-visibility":
      labelVisibility === "visible" ? undefined : labelVisibility,
    "data-size": size,
    "data-tone": tone === "neutral" ? "neutral" : undefined,
    id: id || undefined,
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

  const { controls, disabled, disclosure, form, haspopup, name, type, value } =
    props;
  const buttonAttrs = attrs({
    "aria-controls": disclosure ? controls || undefined : undefined,
    "aria-expanded": disclosure ? "false" : undefined,
    "aria-haspopup": haspopup || undefined,
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
export const CLBR_BUTTON_SPEC: ClbrStructuredSpec = {
  name: "button",
  description: "Use `button` to let users trigger actions.",
  output: {
    element: {
      kind: "switch",
      prop: "mode",
      cases: { button: "button", link: "a" },
    },
    class: "clbr-button",
  },
  content: { kind: "text", prop: "label" },
  props: {
    appearance: {
      default: "outline",
      description: "Visual appearance.",
      type: { kind: "enum", values: ["outline", "solid", "text"] },
    },
    controls: {
      description: "`id` of the element this button controls.",
      ignoredWhen: "`mode` is link or `disclosure` is false",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      ignoredWhen: "`mode` is link",
      type: { kind: "boolean" },
    },
    disclosure: {
      default: false,
      description:
        "Marks the button as a disclosure toggle for another element.",
      ignoredWhen: "`mode` is link",
      type: { kind: "boolean" },
    },
    download: {
      description:
        "Saves the target instead of navigating. Pass a filename or `true`.",
      ignoredWhen: "`mode` is button",
      type: {
        kind: "union",
        variants: [{ kind: "boolean" }, { kind: "string" }],
      },
    },
    form: {
      description: "`id` of the form this button belongs to.",
      ignoredWhen: "`mode` is link",
      type: { kind: "string" },
    },
    haspopup: {
      description:
        "Signals that activating the button opens a popup of this type.",
      ignoredWhen: "`mode` is link",
      type: { kind: "enum", values: ["menu"] },
    },
    href: {
      description: "Link destination.",
      requiredWhen: "`mode` is link",
      type: { kind: "string" },
    },
    icon: {
      description: "Icon shown alongside the label.",
      requiredWhen: "`labelVisibility` is hidden or hiddenBelowTablet",
      type: { kind: "iconName" },
    },
    iconMirrored: {
      description: "Mirrors the icon horizontally.",
      ignoredWhen: "`icon` is omitted",
      type: { kind: "enum", values: ["always", "rtl"] },
    },
    iconPlacement: {
      default: "start",
      description: "Where the icon sits relative to the label.",
      ignoredWhen: "`icon` is omitted",
      type: { kind: "enum", values: ["start", "end"] },
    },
    id: {
      description: "`id` for the button.",
      type: { kind: "string" },
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
    mode: {
      default: "button",
      description: "Render as a button or as a link.",
      type: { kind: "enum", values: ["button", "link"] },
    },
    name: {
      description: "Name submitted with the form.",
      ignoredWhen: "`mode` is link",
      type: { kind: "string" },
    },
    rel: {
      description: "Explicit `rel` attribute.",
      ignoredWhen: "`mode` is button or `download` is set",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
    target: {
      description: "Where to open the link.",
      ignoredWhen: "`mode` is button or `download` is set",
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
    type: {
      default: "button",
      description: "Native button type.",
      ignoredWhen: "`mode` is link",
      type: { kind: "enum", values: ["button", "submit"] },
    },
    value: {
      description: "Value submitted with the form.",
      ignoredWhen: "`mode` is link",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
      {
        target: { on: "host" },
        attribute: "data-appearance",
        condition: { kind: "always" },
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
        attribute: "data-mode",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "mode" },
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
        attribute: "disabled",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-truthy", prop: "disabled" },
          ],
        },
      },
      {
        target: { on: "host" },
        attribute: "aria-expanded",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-truthy", prop: "disclosure" },
          ],
        },
        value: { kind: "literal", text: "false" },
      },
      {
        target: { on: "host" },
        attribute: "aria-controls",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-truthy", prop: "disclosure" },
            { kind: "when-non-empty", prop: "controls" },
          ],
        },
        value: { kind: "prop", prop: "controls" },
      },
      {
        target: { on: "host" },
        attribute: "aria-haspopup",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-provided", prop: "haspopup" },
          ],
        },
        value: { kind: "prop", prop: "haspopup" },
      },
      {
        target: { on: "host" },
        attribute: "download",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "mode", to: "link" },
            { kind: "when-truthy", prop: "download" },
          ],
        },
        value: { kind: "prop", prop: "download" },
      },
      {
        target: { on: "host" },
        attribute: "form",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-non-empty", prop: "form" },
          ],
        },
        value: { kind: "prop", prop: "form" },
      },
      {
        target: { on: "host" },
        attribute: "href",
        condition: { kind: "when-equals", prop: "mode", to: "link" },
        value: { kind: "prop", prop: "href" },
      },
      {
        target: { on: "host" },
        attribute: "name",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-non-empty", prop: "name" },
          ],
        },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "host" },
        attribute: "rel",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "mode", to: "link" },
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
            { kind: "when-equals", prop: "mode", to: "link" },
            { kind: "when-non-empty", prop: "target" },
            { kind: "not", of: { kind: "when-truthy", prop: "download" } },
          ],
        },
        value: { kind: "prop", prop: "target" },
      },
      {
        target: { on: "host" },
        attribute: "type",
        condition: {
          kind: "not",
          of: { kind: "when-equals", prop: "mode", to: "link" },
        },
        value: { kind: "prop", prop: "type" },
      },
      {
        target: { on: "host" },
        attribute: "value",
        condition: {
          kind: "all",
          of: [
            { kind: "not", of: { kind: "when-equals", prop: "mode", to: "link" } },
            { kind: "when-non-empty", prop: "value" },
          ],
        },
        value: { kind: "prop", prop: "value" },
      },
    ],
  },
};
