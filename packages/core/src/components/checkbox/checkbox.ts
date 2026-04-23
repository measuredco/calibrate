import { isValidHtmlId } from "../../helpers/string";
import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";
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
 * Builds the IR tree for the Calibrate checkbox component.
 *
 * @param props - Checkbox component props.
 * @returns IR node for a checkbox field wrapper.
 */
export function buildClbrCheckbox({
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
}: ClbrCheckboxProps): ClbrNode {
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

  const children: ClbrNode[] = [
    {
      kind: "element",
      tag: "label",
      attrs: { class: "label" },
      children: [
        {
          kind: "element",
          tag: "input",
          attrs: {
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
          },
          children: [],
        },
        {
          kind: "element",
          tag: "span",
          attrs: {},
          children: [{ kind: "text", value: label }],
        },
      ],
    },
  ];

  if (normalizedDescription) {
    children.push({
      kind: "element",
      tag: "p",
      attrs: { class: "description", id: normalizedDescriptionId },
      children: [{ kind: "text", value: normalizedDescription }],
    });
  }

  return {
    kind: "element",
    tag: "div",
    attrs: { class: "clbr-checkbox", "data-size": size },
    children,
  };
}

/**
 * SSR renderer for the Calibrate checkbox component.
 *
 * @param props - Checkbox component props.
 * @returns HTML string for a checkbox field wrapper.
 */
export function renderClbrCheckbox(props: ClbrCheckboxProps): string {
  return serializeClbrNode(buildClbrCheckbox(props));
}

/** Declarative checkbox contract mirror for tooling, docs, and adapters. */
export const CLBR_CHECKBOX_SPEC: ClbrComponentSpec = {
  name: "checkbox",
  description: "Use `checkbox` to let users toggle a single option on or off.",
  output: { element: "div", class: "clbr-checkbox" },
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
      description: "Whether the checkbox is checked.",
      type: { kind: "boolean" },
    },
    description: {
      description: "Helper text shown below the label.",
      type: { kind: "string" },
    },
    descriptionId: {
      description: "`id` for the `description` element.",
      requiredWhen: "`description` is provided",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      type: { kind: "boolean" },
    },
    invalid: {
      default: false,
      description: "Marks the checkbox as invalid.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    label: {
      description: "Label shown next to the checkbox.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Name submitted with the form.",
      type: { kind: "string" },
    },
    required: {
      default: false,
      description: "Marks the checkbox as required.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    value: {
      description: "Value submitted with the form.",
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
        value: { kind: "literal", text: "checkbox" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "checkbox" },
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
        attribute: "required",
        condition: { kind: "when-truthy", prop: "required" },
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
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-invalid",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "invalid" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
          ],
        },
        value: { kind: "literal", text: "true" },
      },
    ],
  },
};
