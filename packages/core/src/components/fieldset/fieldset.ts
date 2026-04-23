import { isValidHtmlId } from "../../helpers/html";
import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrInlineSize } from "../../types";

export interface ClbrFieldsetProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Group description rendered below legend. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Fieldset id used for description id derivation. */
  id: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
  /** Invalid state. Ignored when `disabled`. @default false */
  invalid?: boolean;
  /** Fieldset legend text (escaped before render). */
  legend: string;
}

/**
 * Builds the IR tree for the Calibrate fieldset component.
 *
 * @param props - Fieldset component props.
 * @returns IR node for a fieldset wrapper.
 */
export function buildClbrFieldset({
  children,
  description,
  disabled,
  id,
  invalid,
  legend,
  inlineSize = "full",
}: ClbrFieldsetProps): ClbrNode {
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

  const fieldsetChildren: ClbrNode[] = [
    {
      kind: "element",
      tag: "legend",
      attrs: { class: "legend" },
      children: [{ kind: "text", value: legend }],
    },
  ];

  if (normalizedDescription) {
    fieldsetChildren.push({
      kind: "element",
      tag: "p",
      attrs: { class: "description", id: derivedDescriptionId },
      children: [{ kind: "text", value: normalizedDescription }],
    });
  }

  if (children) {
    fieldsetChildren.push({ kind: "raw", html: children });
  }

  return {
    kind: "element",
    tag: "fieldset",
    attrs: {
      "aria-describedby": normalizedDescription
        ? derivedDescriptionId
        : undefined,
      "aria-invalid": isInvalid ? "true" : undefined,
      class: "clbr-fieldset",
      "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
      disabled: isDisabled,
      id: normalizedId,
    },
    children: fieldsetChildren,
  };
}

/**
 * SSR renderer for the Calibrate fieldset component.
 *
 * @param props - Fieldset component props.
 * @returns HTML string for a fieldset wrapper.
 */
export function renderClbrFieldset(props: ClbrFieldsetProps): string {
  return serializeClbrNode(buildClbrFieldset(props));
}

/** Declarative fieldset contract mirror for tooling, docs, and adapters. */
export const CLBR_FIELDSET_SPEC: ClbrComponentSpec = {
  name: "fieldset",
  description: "Use `fieldset` to group related form controls under a legend.",
  output: { element: "fieldset", class: "clbr-fieldset" },
  content: {
    kind: "slots",
    slots: [
      { prop: "legend", kind: "text" },
      { prop: "children", kind: "html" },
    ],
  },
  props: {
    children: {
      description: "Form controls grouped inside the fieldset.",
      type: { kind: "html" },
    },
    description: {
      description:
        "Description shown below the legend; also used for validation guidance.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction with controls in the group.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` for the fieldset.",
      required: true,
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the group as invalid.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    legend: {
      description: "Legend shown above the group.",
      required: true,
      type: { kind: "text" },
    },
    inlineSize: {
      default: "full",
      description:
        "Whether the fieldset fills its container or shrinks to fit.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
      {
        target: { on: "host" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "host" },
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
      {
        target: { on: "host" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
    ],
  },
};
