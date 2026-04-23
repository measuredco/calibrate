import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
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

  return `<div class="clbr-switch" data-size="${size}"><label class="label"><input ${inputAttrs}><span>${escapeHtml(
    label,
  )}</span></label>${descriptionMarkup}</div>`;
}

/** Declarative switch contract mirror for tooling, docs, and adapters. */
export const CLBR_SWITCH_SPEC: ClbrComponentSpec = {
  name: "switch",
  description:
    "Use `switch` to let users instantly toggle a setting on or off.",
  output: { element: "div", class: "clbr-switch" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "description", kind: "text" },
    ],
  },
  props: {
    checked: {
      default: false,
      description: "Whether the switch is on.",
      type: { kind: "boolean" },
    },
    description: {
      description: "Helper text shown below the label.",
      type: { kind: "string" },
    },
    descriptionId: {
      description: "`id` of the `description` element referenced by the input.",
      requiredWhen: "`description` is provided",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the switch.",
      type: { kind: "boolean" },
    },
    label: {
      description: "Label text.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Form field name.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    value: {
      description: "Submitted value when checked.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "switch" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "checkbox" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "role",
        condition: { kind: "always" },
        value: { kind: "literal", text: "switch" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "checked",
        condition: { kind: "when-truthy", prop: "checked" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "value",
        condition: { kind: "when-non-empty", prop: "value" },
        value: { kind: "prop", prop: "value" },
      },
    ],
  },
};
