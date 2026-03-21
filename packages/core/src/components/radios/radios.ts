import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";

export type ClbrRadiosOrientation = "vertical" | "horizontal";

export interface ClbrRadioItem {
  /** Optional per-item assistive description text. */
  description?: string;
  /**
   * Optional per-item disabled override.
   * @default false
   */
  disabled?: boolean;
  /** Radio option label (escaped before render). */
  label: string;
  /** Option value (submitted value and selection key). */
  value: string;
}

/** Props for the Calibrate radios renderer. */
export interface ClbrRadiosProps {
  /** Optional group description rendered below legend. */
  description?: string;
  /**
   * Group disabled state.
   * @default false
   */
  disabled?: boolean;
  /** Group id used for fieldset id and description id derivation. */
  id: string;
  /**
   * Group invalid state; emitted on fieldset when group is enabled.
   * @default false
   */
  invalid?: boolean;
  /** Radio options. Must include at least 2 options. */
  radios: ClbrRadioItem[];
  /** Group legend text (escaped before render). */
  legend: string;
  /** Shared radio name applied to all options. */
  name: string;
  /** Layout orientation. */
  orientation?: ClbrRadiosOrientation;
  /**
   * Required selection state.
   * @default false
   */
  required?: boolean;
  /** Selected option value. When unmatched, no option is checked. */
  value?: string;
}

/**
 * SSR renderer for the Calibrate radios component.
 *
 * @param props - Radios component props.
 * @returns HTML string for a radios fieldset.
 */
export function renderClbrRadios({
  description,
  disabled,
  id,
  invalid,
  radios,
  legend,
  name,
  orientation = "vertical",
  required,
  value,
}: ClbrRadiosProps): string {
  const normalizedDescription = description?.trim();
  const normalizedId = id.trim();
  const normalizedName = name.trim();
  const normalizedValue = value?.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!normalizedName) {
    throw new Error("name must be a non-empty string.");
  }

  if (radios.length < 2) {
    throw new Error("radios must include at least 2 options.");
  }

  const normalizedRadios = radios.map((item, index) => {
    const itemValue = item.value.trim();
    const itemLabel = item.label.trim();
    const itemDescription = item.description?.trim();

    if (!itemValue) {
      throw new Error(`radios[${index}].value must be non-empty.`);
    }

    if (!itemLabel) {
      throw new Error(`radios[${index}].label must be non-empty.`);
    }

    return {
      description: itemDescription,
      disabled: Boolean(item.disabled),
      label: itemLabel,
      value: itemValue,
    };
  });

  const itemValueSet = new Set(normalizedRadios.map((item) => item.value));

  if (itemValueSet.size !== normalizedRadios.length) {
    throw new Error("radios values must be unique.");
  }

  const groupDescriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const isGroupDisabled = Boolean(disabled);
  const isGroupInvalid = !isGroupDisabled && Boolean(invalid);

  const optionsMarkup = normalizedRadios
    .map((item) => {
      const isItemDisabled = Boolean(item.disabled);
      const itemDescriptionId = item.description
        ? `${normalizedId}-${item.value}-description`
        : undefined;

      const inputAttrs = attrs({
        "aria-describedby": itemDescriptionId,
        checked: normalizedValue === item.value,
        class: "radio",
        disabled: isItemDisabled,
        name: normalizedName,
        required: Boolean(required) && !isGroupDisabled && !isItemDisabled,
        type: "radio",
        value: item.value,
      });

      const descriptionMarkup = item.description
        ? `<p class="radio-description" id="${itemDescriptionId}">${escapeHtml(
            item.description,
          )}</p>`
        : "";

      return `<div class="radio-field"><label class="label"><input ${inputAttrs}><span>${escapeHtml(
        item.label,
      )}</span></label>${descriptionMarkup}</div>`;
    })
    .join("");

  const fieldsetAttrs = attrs({
    "aria-describedby": groupDescriptionId,
    "aria-invalid": isGroupInvalid ? "true" : undefined,
    class: "radio-fieldset",
    "data-orientation": orientation,
    disabled: isGroupDisabled,
    id: normalizedId,
  });

  const groupDescriptionMarkup = normalizedDescription
    ? `<p class="description" id="${groupDescriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  return `<fieldset ${fieldsetAttrs}><legend class="legend">${escapeHtml(
    legend,
  )}</legend>${groupDescriptionMarkup}<div class="radios">${optionsMarkup}</div></fieldset>`;
}

/** Declarative radios contract mirror for tooling, docs, and adapters. */
export const CLBR_RADIOS_SPEC = {
  name: "radios",
  output: {
    element: "fieldset",
  },
  props: {
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
    radios: {
      constraints: [
        "minItems:2",
        "uniqueValues",
        "nonEmptyValue",
        "nonEmptyLabel",
      ],
      required: true,
      type: "array",
    },
    legend: {
      required: true,
      type: "text",
    },
    name: {
      constraints: ["non-empty"],
      required: true,
      type: "string",
    },
    orientation: {
      default: "vertical",
      required: false,
      type: "enum",
      values: ["vertical", "horizontal"],
    },
    required: {
      default: false,
      required: false,
      type: "boolean",
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
        value: "radio-fieldset",
      },
      {
        behavior: "always",
        target: "data-orientation",
        value: "{orientation}",
      },
      {
        behavior: "always",
        target: "id",
        value: "{id}",
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
      {
        behavior: "always",
        target: "input[type]",
        value: "radio",
      },
      {
        behavior: "always",
        target: "input[class]",
        value: "radio",
      },
      {
        behavior: "always",
        target: "input[name]",
        value: "{name}",
      },
      {
        behavior: "emit",
        target: "input[checked]",
        when: "item value matches group value",
      },
      {
        behavior: "emit",
        target: "input[disabled]",
        when: "item disabled is true",
      },
      {
        behavior: "emit",
        target: "input[required]",
        when: "required is true and group disabled is false and item disabled is false",
      },
      {
        behavior: "emit",
        target: "input[aria-describedby]",
        value: "{id}-{item.value}-description",
        when: "item description is provided",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "div.radio-field",
        value: "radio item wrapper",
      },
      {
        behavior: "always",
        element: "legend.legend",
        value: "escaped legend",
      },
      {
        behavior: "emit",
        element: "p.description",
        value: "escaped description",
        when: "group description is provided",
      },
      {
        behavior: "always",
        element: "span",
        value: "escaped item label",
      },
      {
        behavior: "emit",
        element: "p.radio-description",
        value: "escaped item description",
        when: "item description is provided",
      },
    ],
  },
} as const;
