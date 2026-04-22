import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize } from "../../types";
import { renderClbrFieldset } from "../fieldset/fieldset";

export type ClbrRadiosOrientation = "vertical" | "horizontal";

export interface ClbrRadioItem {
  /** Optional per-item helper text. */
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

export interface ClbrRadiosProps {
  /** Group description rendered below legend. */
  description?: string;
  /** Group disabled state. @default false */
  disabled?: boolean;
  /** Group id used for group and per-item description id derivation. */
  id: string;
  /** Group invalid state. Ignored when `disabled`. @default false */
  invalid?: boolean;
  /** Radio options. Must include at least 2 options. */
  radios: ClbrRadioItem[];
  /** Group legend text (escaped before render). */
  legend: string;
  /** Shared radio name applied to all options. */
  name: string;
  /** Layout orientation. @default "vertical" */
  orientation?: ClbrRadiosOrientation;
  /** Required selection state. @default false */
  required?: boolean;
  /** Size variant for all radios in the group. @default "md" */
  size?: ClbrControlSize;
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
  size = "md",
  value,
}: ClbrRadiosProps): string {
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

  const isGroupDisabled = Boolean(disabled);

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

  const radiosAttrs = attrs({
    class: "radios",
    "data-orientation": orientation,
    "data-size": size,
  });

  return renderClbrFieldset({
    children: `<div ${radiosAttrs}>${optionsMarkup}</div>`,
    description,
    disabled: isGroupDisabled,
    id: normalizedId,
    invalid,
    legend,
  });
}

/** Declarative radios contract mirror for tooling, docs, and adapters. */
export const CLBR_RADIOS_SPEC = {
  name: "radios",
  description: "Use `radios` to let users select one option from a short list.",
  output: {
    element: "fieldset",
  },
  props: {
    description: {
      description: "Helper text shown below the legend.",
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      description: "Disables every option in the group.",
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description:
        "Unique id used to associate the group with its descriptions.",
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
    radios: {
      constraints: [
        "minItems:2",
        "uniqueValues",
        "nonEmptyValue",
        "nonEmptyLabel",
      ],
      description: "Options shown in the group.",
      required: true,
      type: "array",
    },
    legend: {
      description: "Group label.",
      required: true,
      type: "text",
    },
    name: {
      constraints: ["non-empty"],
      description: "Form field name shared by all options.",
      required: true,
      type: "string",
    },
    orientation: {
      default: "vertical",
      description: "Layout direction.",
      required: false,
      type: "enum",
      values: ["vertical", "horizontal"],
    },
    required: {
      default: false,
      description: "Requires a selection before submission.",
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
      description: "Currently selected value.",
      required: false,
      type: "string",
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
        target: "div.radios[class]",
        value: "radios",
      },
      {
        behavior: "always",
        target: "div.radios[data-orientation]",
        value: "{orientation}",
      },
      {
        behavior: "always",
        target: "div.radios[data-size]",
        value: "{size}",
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
        element: "div.radios",
        value: "radio group container",
      },
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
