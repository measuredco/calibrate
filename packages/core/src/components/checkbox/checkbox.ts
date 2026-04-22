import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize } from "../../types";

export interface ClbrCheckboxProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Helper text rendered after the label. Requires `descriptionId`. */
  description?: string;
  /** ID for the description element, used by `aria-describedby`. Required when `description` is provided. */
  descriptionId?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Invalid state. Ignored when `disabled`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Form field name. */
  name?: string;
  /** Required state. @default false */
  required?: boolean;
  /** Size variant. @default "md" */
  size?: ClbrControlSize;
  /** Submitted field value. */
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
  invalid,
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

  const isDisabled = Boolean(disabled);
  const isInvalid = !isDisabled && Boolean(invalid);

  const inputAttrs = attrs({
    "aria-describedby": normalizedDescription
      ? normalizedDescriptionId
      : undefined,
    "aria-invalid": isInvalid ? "true" : undefined,
    checked: Boolean(checked),
    class: "checkbox",
    disabled: isDisabled,
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
  const fieldAttrs = attrs({
    class: "checkbox-field",
    "data-size": size,
  });

  return `<div ${fieldAttrs}><label class="label"><input ${inputAttrs}><span>${escapeHtml(
    label,
  )}</span></label>${descriptionMarkup}</div>`;
}

/** Declarative checkbox contract mirror for tooling, docs, and adapters. */
export const CLBR_CHECKBOX_SPEC = {
  name: "checkbox",
  description: "Use `checkbox` to let users toggle a single option on or off.",
  output: {
    element: "div",
  },
  props: {
    checked: {
      default: false,
      description: "Whether the checkbox is checked.",
      required: false,
      type: "boolean",
    },
    description: {
      description: "Helper text shown below the label.",
      required: false,
      type: "string",
    },
    descriptionId: {
      constraints: ["non-empty", "validHtmlId"],
      description: "HTML id for the `description` element.",
      required: false,
      requiredWhen: "`description` is provided",
      type: "string",
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      required: false,
      type: "boolean",
    },
    invalid: {
      default: false,
      description: "Marks the checkbox as invalid.",
      ignoredWhen: "`disabled` is true",
      required: false,
      type: "boolean",
    },
    label: {
      description: "Label shown next to the checkbox.",
      required: true,
      type: "text",
    },
    name: {
      description: "Name submitted with the form.",
      required: false,
      type: "string",
    },
    required: {
      default: false,
      description: "Marks the checkbox as required.",
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    value: {
      description: "Value submitted with the form.",
      required: false,
      type: "string",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "checkbox-field",
      },
      {
        behavior: "always",
        target: "div[data-size]",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "input[aria-describedby]",
        value: "{descriptionId}",
        when: "description is provided",
      },
      {
        behavior: "emit",
        target: "input[aria-invalid]",
        value: "true",
        when: "invalid is true and disabled is false",
      },
      {
        behavior: "always",
        target: "input[class]",
        value: "checkbox",
      },
      {
        behavior: "always",
        target: "input[type]",
        value: "checkbox",
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
        target: "input[name]",
        when: "name is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[required]",
        when: "required is true",
      },
      {
        behavior: "emit",
        target: "input[value]",
        when: "value is a non-empty string",
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
