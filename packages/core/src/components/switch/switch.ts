import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize } from "../../types";

export interface ClbrSwitchProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Helper text rendered after the label. Requires `descriptionId`. */
  description?: string;
  /** ID for the description element, used by `aria-describedby`. Required when `description` is provided. */
  descriptionId?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Form field name. */
  name?: string;
  /** Size variant. @default "md" */
  size?: ClbrControlSize;
  /** Submitted field value. */
  value?: string;
}

/**
 * SSR renderer for the Calibrate switch component.
 *
 * @param props - Switch component props.
 * @returns HTML string for a switch field wrapper.
 */
export function renderClbrSwitch({
  checked,
  description,
  descriptionId,
  disabled,
  label,
  name,
  size = "md",
  value,
}: ClbrSwitchProps): string {
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
    class: "switch",
    disabled: Boolean(disabled),
    name: name || undefined,
    role: "switch",
    type: "checkbox",
    value: value || undefined,
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${normalizedDescriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  return `<div class="switch-field" data-size="${size}"><label class="label"><input ${inputAttrs}><span>${escapeHtml(
    label,
  )}</span></label>${descriptionMarkup}</div>`;
}

/** Declarative switch contract mirror for tooling, docs, and adapters. */
export const CLBR_SWITCH_SPEC = {
  name: "switch",
  description:
    "Use `switch` to let users instantly toggle a setting on or off.",
  output: {
    element: "div",
  },
  props: {
    checked: {
      default: false,
      description: "Whether the switch is on.",
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
      description: "Id of the description element referenced by the input.",
      required: false,
      requiredWhen: "description is provided",
      type: "string",
    },
    disabled: {
      default: false,
      description: "Disables the switch.",
      required: false,
      type: "boolean",
    },
    label: {
      description: "Label text.",
      required: true,
      type: "text",
    },
    name: {
      description: "Form field name.",
      required: false,
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    value: {
      description: "Submitted value when checked.",
      required: false,
      type: "string",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "switch-field",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "input[aria-describedby]",
        value: "{descriptionId}",
        when: "description is provided",
      },
      {
        behavior: "always",
        target: "input[class]",
        value: "switch",
      },
      {
        behavior: "always",
        target: "input[type]",
        value: "checkbox",
      },
      {
        behavior: "always",
        target: "input[role]",
        value: "switch",
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
