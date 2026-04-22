import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize, ClbrInlineSize } from "../../types";

export type ClbrTextareaResize = "vertical" | "none";

export interface ClbrTextareaProps {
  /** Autocomplete hint; `false` emits `autocomplete="off"`. */
  autocomplete?: string | false;
  /** Helper text rendered after the textarea (reused as validation guidance when `invalid`). */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Textarea id; used for `textarea[id]` and `label[for]`. */
  id: string;
  /** Invalid state. Ignored when `disabled` or `readOnly`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Field name attribute. */
  name?: string;
  /** Read-only state. Ignored when `disabled`. @default false */
  readOnly?: boolean;
  /** Required state. @default false */
  required?: boolean;
  /** Resize behavior. @default "vertical" */
  resize?: ClbrTextareaResize;
  /** Number of visible text rows. Must be an integer >= 2. @default 2 */
  rows?: number;
  /** Size variant. @default "md" */
  size?: ClbrControlSize;
  /** Spellcheck behavior. Omitted by default. */
  spellcheck?: boolean;
  /** Current value. */
  value?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
}

/**
 * SSR renderer for the Calibrate textarea component.
 *
 * @param props - Textarea component props.
 * @returns HTML string for a labeled textarea field wrapper.
 */
export function renderClbrTextarea({
  autocomplete,
  description,
  disabled,
  id,
  invalid,
  label,
  name,
  readOnly,
  required,
  resize = "vertical",
  rows = 2,
  size = "md",
  spellcheck,
  value,
  inlineSize = "full",
}: ClbrTextareaProps): string {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedAutocomplete =
    autocomplete === false ? false : autocomplete?.trim();
  const normalizedName = name?.trim();
  const normalizedValue = value?.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!Number.isInteger(rows) || rows < 2) {
    throw new Error("rows must be an integer greater than or equal to 2.");
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const isDisabled = Boolean(disabled);
  const isReadOnly = !isDisabled && Boolean(readOnly);
  const isInvalid = !isDisabled && !isReadOnly && Boolean(invalid);

  const textareaAttrs = attrs({
    "aria-describedby": descriptionId,
    "aria-invalid": isInvalid ? "true" : undefined,
    autocomplete:
      normalizedAutocomplete === false
        ? "off"
        : normalizedAutocomplete || undefined,
    class: "textarea",
    disabled: isDisabled,
    id: normalizedId,
    name: normalizedName || undefined,
    readonly: isReadOnly,
    required: Boolean(required),
    rows: String(rows),
    spellcheck: spellcheck === undefined ? undefined : String(spellcheck),
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${descriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  const wrapperAttrs = attrs({
    class: "clbr-textarea",
    "data-resize": resize === "none" ? "none" : undefined,
    "data-size": size,
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
  });

  return `<div ${wrapperAttrs}><label class="label" for="${normalizedId}">${escapeHtml(
    label,
  )}</label><textarea ${textareaAttrs}>${escapeHtml(
    normalizedValue || "",
  )}</textarea>${descriptionMarkup}</div>`;
}

/** Declarative textarea contract mirror for tooling, docs, and adapters. */
export const CLBR_TEXTAREA_SPEC = {
  name: "textarea",
  description: "Use `textarea` to collect multiple lines of text from users.",
  output: {
    element: "div",
  },
  props: {
    autocomplete: {
      description: "Browser autocomplete hint. Pass `false` to disable.",
      required: false,
      type: "string|false",
    },
    description: {
      description:
        "Helper text shown below the textarea; also used for validation guidance.",
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      description: "Disables the textarea.",
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description: "`id` used to associate the textarea with its label.",
      required: true,
      type: "string",
    },
    invalid: {
      default: false,
      description: "Marks the textarea as invalid.",
      ignoredWhen: "`disabled` is true or `readOnly` is true",
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
    readOnly: {
      default: false,
      description: "Prevents editing while keeping the value visible.",
      ignoredWhen: "`disabled` is true",
      required: false,
      type: "boolean",
    },
    required: {
      default: false,
      description: "Requires a value before submission.",
      required: false,
      type: "boolean",
    },
    resize: {
      default: "vertical",
      description: "How the user can resize the textarea.",
      required: false,
      type: "enum",
      values: ["vertical", "none"],
    },
    rows: {
      constraints: ["integer", "min:2"],
      default: 2,
      description: "Number of visible rows.",
      required: false,
      type: "number",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    spellcheck: {
      description: "Whether the browser checks spelling.",
      required: false,
      type: "boolean",
    },
    value: {
      description: "Current value.",
      required: false,
      type: "string",
    },
    inlineSize: {
      default: "full",
      description: "How the textarea fills its container.",
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
        value: "clbr-textarea",
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
        behavior: "emit",
        target: "data-resize",
        value: "none",
        when: "resize is none",
      },
      {
        behavior: "always",
        target: "textarea[class]",
        value: "textarea",
      },
      {
        behavior: "always",
        target: "textarea[id]",
        value: "{id}",
      },
      {
        behavior: "always",
        target: "label[for]",
        value: "{id}",
      },
      {
        behavior: "always",
        target: "textarea[rows]",
        value: "{rows}",
      },
      {
        behavior: "emit",
        target: "textarea[autocomplete]",
        value: "off",
        when: "autocomplete is false",
      },
      {
        behavior: "emit",
        target: "textarea[autocomplete]",
        value: "{autocomplete}",
        when: "autocomplete is a non-empty string",
      },
      {
        behavior: "emit",
        target: "textarea[name]",
        value: "{name}",
        when: "name is a non-empty string",
      },
      {
        behavior: "emit",
        target: "textarea[disabled]",
        when: "disabled is true",
      },
      {
        behavior: "emit",
        target: "textarea[readonly]",
        when: "readOnly is true and disabled is false",
      },
      {
        behavior: "emit",
        target: "textarea[required]",
        when: "required is true",
      },
      {
        behavior: "emit",
        target: "textarea[spellcheck]",
        value: "{spellcheck}",
        when: "spellcheck is provided",
      },
      {
        behavior: "emit",
        target: "textarea[aria-invalid]",
        value: "true",
        when: "invalid is true and disabled is false and readOnly is false",
      },
      {
        behavior: "emit",
        target: "textarea[aria-describedby]",
        value: "{id}-description",
        when: "description is a non-empty string",
      },
    ],
    content: [
      {
        behavior: "always",
        element: "label.label",
        value: "escaped label",
      },
      {
        behavior: "always",
        element: "textarea.textarea",
        value: "escaped value (or empty)",
      },
      {
        behavior: "emit",
        element: "p.description",
        value: "escaped description",
        when: "description is a non-empty string",
      },
    ],
  },
} as const;
