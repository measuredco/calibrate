import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrControlSize } from "../../types";

export interface ClbrSwitchProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Helper text rendered after the label. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** DOM id applied to the underlying input. */
  id: string;
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
 * Builds the IR tree for the Calibrate switch component.
 *
 * @param props - Switch component props.
 * @returns IR node for a switch field wrapper.
 */
export function buildClbrSwitch({
  checked,
  description,
  disabled,
  id,
  label,
  name,
  size = "md",
  value,
}: ClbrSwitchProps): ClbrNode {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

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
            "aria-describedby": descriptionId,
            checked: Boolean(checked),
            class: "switch",
            disabled: Boolean(disabled),
            id: normalizedId,
            name: name || undefined,
            role: "switch",
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
      attrs: { class: "description", id: descriptionId },
      children: [{ kind: "text", value: normalizedDescription }],
    });
  }

  return {
    kind: "element",
    tag: "div",
    attrs: { class: "clbr-switch", "data-size": size },
    children,
  };
}

/**
 * SSR renderer for the Calibrate switch component.
 *
 * @param props - Switch component props.
 * @returns HTML string for a switch field wrapper.
 */
export function renderClbrSwitch(props: ClbrSwitchProps): string {
  return serializeClbrNode(buildClbrSwitch(props));
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
    disabled: {
      default: false,
      description: "Disables the switch.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id applied to the underlying input.",
      required: true,
      type: { kind: "string" },
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
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
    ],
  },
};
