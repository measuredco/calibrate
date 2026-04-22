import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize, ClbrInlineSize } from "../../types";

export type ClbrInputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "numeric";

export interface ClbrInputProps {
  /** Autocomplete hint; `false` emits `autocomplete="off"`. */
  autocomplete?: string | false;
  /** Helper text rendered after the input (reused as validation guidance when `invalid`). */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Input id; used for `input[id]` and `label[for]`. */
  id: string;
  /** Invalid state. Ignored when `disabled` or `readOnly`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Field name attribute. */
  name?: string;
  /** Pattern attribute. */
  pattern?: string;
  /** Read-only state. Ignored when `disabled`. @default false */
  readOnly?: boolean;
  /** Required state. @default false */
  required?: boolean;
  /** Size variant. @default "md" */
  size?: ClbrControlSize;
  /** Spellcheck behavior. Defaults to `false` for `type="numeric"` unless explicit. */
  spellcheck?: boolean;
  /** Input type; `numeric` maps to `type="text"` with `inputmode="numeric"`. @default "text" */
  type?: ClbrInputType;
  /** Current value. */
  value?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
}

/**
 * SSR renderer for the Calibrate input component.
 *
 * @param props - Input component props.
 * @returns HTML string for a labeled input field wrapper.
 */
export function renderClbrInput({
  autocomplete,
  description,
  disabled,
  id,
  invalid,
  label,
  name,
  pattern,
  readOnly,
  required,
  size = "md",
  spellcheck,
  type = "text",
  value,
  inlineSize = "full",
}: ClbrInputProps): string {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedAutocomplete =
    autocomplete === false ? false : autocomplete?.trim();
  const normalizedName = name?.trim();
  const normalizedPattern = pattern?.trim();
  const normalizedValue = value?.trim();

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

  const isNumeric = type === "numeric";
  const resolvedType = isNumeric ? "text" : type;
  const resolvedPattern =
    normalizedPattern || (isNumeric ? "^[0-9]*$" : undefined);
  const resolvedSpellcheck =
    spellcheck === undefined && isNumeric ? false : spellcheck;
  const isDisabled = Boolean(disabled);
  const isReadOnly = !isDisabled && Boolean(readOnly);
  const isInvalid = !isDisabled && !isReadOnly && Boolean(invalid);

  const inputAttrs = attrs({
    "aria-describedby": descriptionId,
    "aria-invalid": isInvalid ? "true" : undefined,
    autocomplete:
      normalizedAutocomplete === false
        ? "off"
        : normalizedAutocomplete || undefined,
    class: "input",
    disabled: isDisabled,
    id: normalizedId,
    inputmode: isNumeric ? "numeric" : undefined,
    name: normalizedName || undefined,
    pattern: resolvedPattern,
    readonly: isReadOnly,
    required: Boolean(required),
    spellcheck:
      resolvedSpellcheck === undefined ? undefined : String(resolvedSpellcheck),
    type: resolvedType,
    value: normalizedValue || undefined,
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${descriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  const wrapperAttrs = attrs({
    class: "clbr-input",
    "data-size": size,
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
  });

  return `<div ${wrapperAttrs}><label class="label" for="${normalizedId}">${escapeHtml(
    label,
  )}</label><input ${inputAttrs}>${descriptionMarkup}</div>`;
}

/** Declarative input contract mirror for tooling, docs, and adapters. */
export const CLBR_INPUT_SPEC = {
  name: "input",
  description: "Use `input` to collect a single line of text from users.",
  output: {
    element: "div",
  },
  props: {
    autocomplete: {
      description: "Autocomplete hint. Pass `false` to disable autocomplete.",
      required: false,
      type: "string|false",
    },
    description: {
      description:
        "Helper text shown below the input; also used for validation guidance.",
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description: "`id` linking the label to the input.",
      required: true,
      type: "string",
    },
    invalid: {
      default: false,
      description: "Marks the input as invalid.",
      ignoredWhen: "`disabled` is true or `readOnly` is true",
      required: false,
      type: "boolean",
    },
    label: {
      description: "Label shown above the input.",
      required: true,
      type: "text",
    },
    name: {
      description: "Name submitted with the form.",
      required: false,
      type: "string",
    },
    pattern: {
      description: "Regex pattern the value must match.",
      required: false,
      type: "string",
    },
    readOnly: {
      default: false,
      description: "Makes the input read-only.",
      ignoredWhen: "`disabled` is true",
      required: false,
      type: "boolean",
    },
    required: {
      default: false,
      description: "Marks the input as required.",
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
    spellcheck: {
      description: "Enables browser spellchecking.",
      required: false,
      type: "boolean",
    },
    type: {
      default: "text",
      description: "Input type.",
      required: false,
      type: "enum",
      values: ["text", "email", "password", "tel", "url", "numeric"],
    },
    value: {
      description: "Current value.",
      required: false,
      type: "string",
    },
    inlineSize: {
      default: "full",
      description: "Whether the field fills its container or shrinks to fit.",
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
        value: "clbr-input",
      },
      {
        behavior: "always",
        target: "input[class]",
        value: "input",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
      },
      {
        behavior: "always",
        target: "input[id]",
        value: "{id}",
      },
      {
        behavior: "always",
        target: "label[for]",
        value: "{id}",
      },

      {
        behavior: "always",
        target: "input[type]",
        value: "{type}",
        when: "type is not numeric",
      },
      {
        behavior: "emit",
        target: "input[aria-describedby]",
        value: "{id}-description",
        when: "description is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[aria-invalid]",
        value: "true",
        when: "invalid is true and disabled/readOnly are false",
      },
      {
        behavior: "emit",
        target: "input[autocomplete]",
        value: "off",
        when: "autocomplete is false",
      },
      {
        behavior: "emit",
        target: "input[autocomplete]",
        value: "{autocomplete}",
        when: "autocomplete is a non-empty string",
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
        value: "{name}",
        when: "name is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[value]",
        value: "{value}",
        when: "value is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[type]",
        value: "text",
        when: "type is numeric",
      },
      {
        behavior: "emit",
        target: "input[inputmode]",
        value: "numeric",
        when: "type is numeric",
      },
      {
        behavior: "emit",
        target: "input[pattern]",
        value: "{pattern}",
        when: "pattern is a non-empty string",
      },
      {
        behavior: "emit",
        target: "input[pattern]",
        value: "^[0-9]*$",
        when: "type is numeric and pattern is omitted",
      },
      {
        behavior: "emit",
        target: "input[spellcheck]",
        value: "{spellcheck}",
        when: "spellcheck is explicitly true or false",
      },
      {
        behavior: "emit",
        target: "input[spellcheck]",
        value: "false",
        when: "type is numeric and spellcheck is omitted",
      },
      {
        behavior: "emit",
        target: "input[readonly]",
        when: "readOnly is true and disabled is false",
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
        when: "description is provided (hint or validation guidance)",
      },
    ],
  },
} as const;
