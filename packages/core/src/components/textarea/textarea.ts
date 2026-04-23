import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrStructuredSpec } from "../../helpers/spec";
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
export const CLBR_TEXTAREA_SPEC: ClbrStructuredSpec = {
  name: "textarea",
  description: "Use `textarea` to collect multiple lines of text from users.",
  output: { element: "div", class: "clbr-textarea" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "value", kind: "text" },
      { prop: "description", kind: "text" },
    ],
  },
  props: {
    autocomplete: {
      description: "Browser autocomplete hint. Pass `false` to disable.",
      type: {
        kind: "union",
        variants: [{ kind: "string" }, { kind: "boolean" }],
      },
    },
    description: {
      description:
        "Helper text shown below the textarea; also used for validation guidance.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the textarea.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` used to associate the textarea with its label.",
      required: true,
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the textarea as invalid.",
      ignoredWhen: "`disabled` is true or `readOnly` is true",
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
    readOnly: {
      default: false,
      description: "Prevents editing while keeping the value visible.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    required: {
      default: false,
      description: "Requires a value before submission.",
      type: { kind: "boolean" },
    },
    resize: {
      default: "vertical",
      description: "How the user can resize the textarea.",
      type: { kind: "enum", values: ["vertical", "none"] },
    },
    rows: {
      default: 2,
      description: "Number of visible rows.",
      type: { kind: "number", min: 2, max: 10, integer: true },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    spellcheck: {
      description: "Whether the browser checks spelling.",
      type: { kind: "boolean" },
    },
    value: {
      description: "Current value.",
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "How the textarea fills its container.",
      type: { kind: "enum", values: ["full", "fit"] },
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
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
      {
        target: { on: "host" },
        attribute: "data-resize",
        condition: { kind: "when-equals", prop: "resize", to: "none" },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "descendant", selector: "label" },
        attribute: "for",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "textarea" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "rows",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "rows" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "required",
        condition: { kind: "when-truthy", prop: "required" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "readonly",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "readOnly" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
          ],
        },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "aria-invalid",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "invalid" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
            { kind: "not", of: { kind: "when-truthy", prop: "readOnly" } },
          ],
        },
        value: { kind: "literal", text: "true" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "spellcheck",
        condition: { kind: "when-provided", prop: "spellcheck" },
        value: { kind: "prop", prop: "spellcheck" },
      },
    ],
  },
};
