import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";

export type ClbrInputInlineSize = "full" | "fit";
export type ClbrInputSize = "sm" | "md";
export type ClbrInputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "numeric";

/** Props for the Calibrate input renderer. */
export interface ClbrInputProps {
  /**
   * Autocomplete hint.
   * Use `false` to emit `autocomplete="off"`.
   * Omitted by default.
   */
  autocomplete?: string | false;
  /**
   * Optional assistive description text rendered after the input.
   * Reused for validation guidance when `invalid` is true.
   * When omitted, no description or validation message is rendered.
   */
  description?: string;
  /**
   * Disabled state.
   * @default false
   */
  disabled?: boolean;
  /** Input id; used for `input[id]` and `label[for]`. */
  id: string;
  /**
   * Invalid state.
   * Emits `aria-invalid="true"` only when true and input is editable.
   * Ignored when `disabled` or `readOnly` is true.
   * Does not require `description`; consumers may keep hints or omit messages.
   * @default false
   */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Optional field name. */
  name?: string;
  /** Optional pattern attribute. */
  pattern?: string;
  /**
   * Read-only state.
   * Ignored when `disabled` is true.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Required state.
   * @default false
   */
  required?: boolean;
  /**
   * Size variant.
   * @default "md"
   */
  size?: ClbrInputSize;
  /**
   * Spellcheck behavior.
   * Defaults to false for `type="numeric"` unless explicitly provided.
   */
  spellcheck?: boolean;
  /**
   * Input type.
   * `numeric` maps to `type="text"` with `inputmode="numeric"`.
   * @default "text"
   */
  type?: ClbrInputType;
  /** Optional current value. */
  value?: string;
  /**
   * Inline-size behavior.
   * `full` is default and emits no inline-size attribute.
   * `fit` emits `data-inline-size="fit"` on wrapper.
   * @default "full"
   */
  inlineSize?: ClbrInputInlineSize;
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
    class: "input-field",
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
  output: {
    element: "div",
  },
  props: {
    autocomplete: {
      required: false,
      type: "string|false",
    },
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
      ignoredWhen: "disabled is true or readOnly is true",
      required: false,
      type: "boolean",
    },
    label: {
      required: true,
      type: "text",
    },
    name: {
      required: false,
      type: "string",
    },
    pattern: {
      required: false,
      type: "string",
    },
    readOnly: {
      default: false,
      ignoredWhen: "disabled is true",
      required: false,
      type: "boolean",
    },
    required: {
      default: false,
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    spellcheck: {
      required: false,
      type: "boolean",
    },
    type: {
      default: "text",
      required: false,
      type: "enum",
      values: ["text", "email", "password", "tel", "url", "numeric"],
    },
    value: {
      required: false,
      type: "string",
    },
    inlineSize: {
      default: "full",
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
        value: "input-field",
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
