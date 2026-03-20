import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";

export type ClbrCheckboxSize = "sm" | "md";

/** Props for the Calibrate checkbox renderer. */
export interface ClbrCheckboxProps {
  /**
   * Checked state.
   * @default false
   */
  checked?: boolean;
  /**
   * Optional assistive description text rendered after the label.
   * Requires `descriptionId` when provided.
   */
  description?: string;
  /**
   * ID for the description element, used by `aria-describedby`.
   * Required when `description` is provided.
   */
  descriptionId?: string;
  /**
   * Disabled state.
   * @default false
   */
  disabled?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Optional form field name. */
  name?: string;
  /**
   * Required state.
   * @default false
   */
  required?: boolean;
  /**
   * Size variant.
   * @default "md"
   */
  size?: ClbrCheckboxSize;
  /** Optional submitted field value. */
  value?: string;
}

/**
 * SSR renderer for the Calibrate checkbox component.
 *
 * @param props - Checkbox component props.
 * @returns HTML string for a checkbox field wrapper.
 */
export function renderClbrCheckbox({
  checked,
  description,
  descriptionId,
  disabled,
  label,
  name,
  required,
  size = "md",
  value,
}: ClbrCheckboxProps): string {
  const normalizedDescription = description?.trim();
  const normalizedDescriptionId = descriptionId?.trim();

  if (normalizedDescription && !normalizedDescriptionId) {
    throw new Error(
      "descriptionId must be non-empty when description is provided.",
    );
  }

  if (normalizedDescription && !isValidHtmlId(normalizedDescriptionId!)) {
    throw new Error(
      "descriptionId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const inputAttrs = attrs({
    "aria-describedby": normalizedDescription
      ? normalizedDescriptionId
      : undefined,
    checked: Boolean(checked),
    disabled: Boolean(disabled),
    name: name || undefined,
    required: Boolean(required),
    type: "checkbox",
    value: value || undefined,
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${normalizedDescriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  return `<div class="checkbox" data-size="${size}"><label class="label"><input ${inputAttrs}><span>${escapeHtml(
    label,
  )}</span></label>${descriptionMarkup}</div>`;
}

/** Declarative checkbox contract mirror for tooling, docs, and adapters. */
export const CLBR_CHECKBOX_SPEC = {
  name: "checkbox",
  output: {
    element: "div",
  },
  props: {
    checked: {
      default: false,
      required: false,
      type: "boolean",
    },
    description: {
      required: false,
      type: "string",
    },
    descriptionId: {
      required: false,
      requiredWhen: "description is provided",
      type: "string",
    },
    disabled: {
      default: false,
      required: false,
      type: "boolean",
    },
    label: {
      required: true,
      type: "text",
    },
    name: {
      required: false,
      type: "string",
    },
    required: {
      default: false,
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    value: {
      required: false,
      type: "string",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "checkbox",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "input[checked]",
        when: "checked is true",
      },
      {
        behavior: "emit",
        target: "input[disabled]",
        when: "disabled is true",
      },
      {
        behavior: "emit",
        target: "input[required]",
        when: "required is true",
      },
      {
        behavior: "emit",
        target: "input[name]",
        when: "name is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[value]",
        when: "value is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[aria-describedby]",
        value: "{descriptionId}",
        when: "description is provided",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "label.label",
        value: "escaped label",
      },
      {
        behavior: "emit",
        element: "p.description",
        value: "escaped description",
        when: "description is provided",
      },
    ],
  },
} as const;
