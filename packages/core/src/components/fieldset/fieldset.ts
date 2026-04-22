import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
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
  inlineSize = "full",
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
    class: "clbr-fieldset",
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
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
  description: "Use `fieldset` to group related form controls under a legend.",
  output: {
    element: "fieldset",
  },
  props: {
    children: {
      description: "Form controls grouped inside the fieldset.",
      required: false,
      type: "html",
    },
    description: {
      description:
        "Description shown below the legend; also used for validation guidance.",
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      description: "Prevents interaction with controls in the group.",
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description: "`id` for the fieldset.",
      required: true,
      type: "string",
    },
    invalid: {
      default: false,
      description: "Marks the group as invalid.",
      ignoredWhen: "`disabled` is true",
      required: false,
      type: "boolean",
    },
    legend: {
      description: "Legend shown above the group.",
      required: true,
      type: "text",
    },
    inlineSize: {
      default: "full",
      description:
        "Whether the fieldset fills its container or shrinks to fit.",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-fieldset",
      },
      {
        behavior: "always",
        target: "id",
        value: "{id}",
      },
      {
        behavior: "emit",
        target: "data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
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
