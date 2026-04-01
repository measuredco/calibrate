import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";

export type ClbrFieldsetWidth = "full" | "auto";

/** Props for the Calibrate fieldset renderer. */
export interface ClbrFieldsetProps {
  /** Trusted inner HTML content. Caller is responsible for sanitization. */
  children?: string;
  /** Optional group description rendered below legend. */
  description?: string;
  /**
   * Fieldset disabled state.
   * @default false
   */
  disabled?: boolean;
  /** Fieldset id used for description id derivation. */
  id: string;
  /**
   * Fieldset invalid state; emitted only when enabled.
   * @default false
   */
  invalid?: boolean;
  /** Fieldset legend text (escaped before render). */
  legend: string;
  /**
   * Width behavior.
   * `full` is default and emits no width attribute.
   * `auto` emits `data-width="auto"` on fieldset.
   * @default "full"
   */
  width?: ClbrFieldsetWidth;
}

/**
 * SSR renderer for the Calibrate fieldset component.
 *
 * @param props - Fieldset component props.
 * @returns HTML string for a fieldset wrapper.
 */
export function renderClbrFieldset({
  children,
  description,
  disabled,
  id,
  invalid,
  legend,
  width = "full",
}: ClbrFieldsetProps): string {
  const normalizedDescription = description?.trim();
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const derivedDescriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const isDisabled = Boolean(disabled);
  const isInvalid = !isDisabled && Boolean(invalid);

  const fieldsetAttrs = attrs({
    "aria-describedby": normalizedDescription
      ? derivedDescriptionId
      : undefined,
    "aria-invalid": isInvalid ? "true" : undefined,
    class: "fieldset",
    "data-width": width === "auto" ? "auto" : undefined,
    disabled: isDisabled,
    id: normalizedId,
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${derivedDescriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  return `<fieldset ${fieldsetAttrs}><legend class="legend">${escapeHtml(
    legend,
  )}</legend>${descriptionMarkup}${children ?? ""}</fieldset>`;
}

/** Declarative fieldset contract mirror for tooling, docs, and adapters. */
export const CLBR_FIELDSET_SPEC = {
  name: "fieldset",
  output: {
    element: "fieldset",
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    description: {
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      required: true,
      type: "string",
    },
    invalid: {
      default: false,
      ignoredWhen: "disabled is true",
      required: false,
      type: "boolean",
    },
    legend: {
      required: true,
      type: "text",
    },
    width: {
      default: "full",
      required: false,
      type: "enum",
      values: ["full", "auto"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "fieldset",
      },
      {
        behavior: "always",
        target: "id",
        value: "{id}",
      },
      {
        behavior: "emit",
        target: "data-width",
        value: "auto",
        when: "width is auto",
      },
      {
        behavior: "emit",
        target: "disabled",
        when: "disabled is true",
      },
      {
        behavior: "emit",
        target: "aria-invalid",
        value: "true",
        when: "invalid is true and disabled is false",
      },
      {
        behavior: "emit",
        target: "aria-describedby",
        value: "{id}-description",
        when: "description is a non-empty string",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "legend.legend",
        value: "escaped legend",
      },
      {
        behavior: "emit",
        element: "p.description",
        value: "escaped description",
        when: "description is provided",
      },
      {
        behavior: "always",
        element: "children",
        value: "trusted HTML",
      },
    ],
  },
} as const;
