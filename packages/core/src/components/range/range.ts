import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
import type { ClbrControlSize, ClbrInlineSize } from "../../types";

export const CLBR_RANGE_TAG_NAME = "clbr-range";

export interface ClbrRangeProps {
  /** Helper text rendered after the range. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Range id; used for input/output/label wiring. */
  id: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
  /** Label text content (escaped before render). */
  label: string;
  /** Maximum value. */
  max?: number;
  /** Minimum value. */
  min?: number;
  /** Field name. */
  name?: string;
  /** Size variant. @default "md" */
  size?: ClbrControlSize;
  /** Step value. */
  step?: number;
  /** Current value. */
  value?: number;
}

/**
 * SSR renderer for the Calibrate range component.
 *
 * Emits semantic range markup inside a `clbr-range` host. The runtime custom
 * element hydrates the `.output` element from the current input value.
 *
 * @param props - Range component props.
 * @returns HTML string for a `clbr-range` host.
 */
export function renderClbrRange({
  description,
  disabled,
  id,
  inlineSize = "full",
  label,
  max,
  min,
  name,
  size = "md",
  step,
  value,
}: ClbrRangeProps): string {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedName = name?.trim();

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

  const fieldAttrs = attrs({
    class: "clbr-range",
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
    "data-size": size,
  });

  const inputAttrs = attrs({
    "aria-describedby": descriptionId,
    class: "range",
    disabled: Boolean(disabled),
    id: normalizedId,
    max: max != null ? String(max) : undefined,
    min: min != null ? String(min) : undefined,
    name: normalizedName || undefined,
    step: step != null ? String(step) : undefined,
    type: "range",
    value: value != null ? String(value) : undefined,
  });

  const descriptionMarkup = normalizedDescription
    ? `<p class="description" id="${descriptionId}">${escapeHtml(
        normalizedDescription,
      )}</p>`
    : "";

  return `<${CLBR_RANGE_TAG_NAME} ${fieldAttrs}><div class="label-wrapper"><label class="label" for="${normalizedId}">${escapeHtml(
    label,
  )}</label><output class="output" for="${normalizedId}"></output></div><input ${inputAttrs}>${descriptionMarkup}</${CLBR_RANGE_TAG_NAME}>`;
}

class ClbrRangeElement extends HTMLElement {
  #onInput = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) return;
    if (!target.matches(".range")) return;

    this.#syncOutput();
  };

  connectedCallback(): void {
    this.removeEventListener("input", this.#onInput);
    this.#syncOutput();
    this.addEventListener("input", this.#onInput);
  }

  disconnectedCallback(): void {
    this.removeEventListener("input", this.#onInput);
  }

  #syncOutput(): void {
    const input = this.querySelector<HTMLInputElement>(".range");
    const output = this.querySelector<HTMLOutputElement>(".output");

    if (!input || !output) return;

    output.textContent = input.value;
  }
}

/**
 * Defines the `clbr-range` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-range` hosts
 * upgrade in place and keep `.output` synchronized with the current value.
 */
export function defineClbrRange(): void {
  if (customElements.get(CLBR_RANGE_TAG_NAME)) return;

  customElements.define(CLBR_RANGE_TAG_NAME, ClbrRangeElement);
}

/** Declarative range contract mirror for tooling, docs, and adapters. */
export const CLBR_RANGE_SPEC: ClbrComponentSpec = {
  name: "range",
  description: "Use `range` to let users pick a numeric value along a scale.",
  output: { element: CLBR_RANGE_TAG_NAME, class: "clbr-range" },
  content: { kind: "text", prop: "label" },
  props: {
    description: {
      description: "Helper text shown below the range.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the range.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` used to associate the input with its label.",
      required: true,
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "How the range fills its container.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    label: {
      description: "Label text.",
      required: true,
      type: { kind: "text" },
    },
    max: {
      description: "Maximum value.",
      type: { kind: "number" },
    },
    min: {
      description: "Minimum value.",
      type: { kind: "number" },
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
    step: {
      description: "Granularity of value changes.",
      type: { kind: "number" },
    },
    value: {
      description: "Current value.",
      type: { kind: "number" },
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
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "range" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "range" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "min",
        condition: { kind: "when-provided", prop: "min" },
        value: { kind: "template", pattern: "{min}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "max",
        condition: { kind: "when-provided", prop: "max" },
        value: { kind: "template", pattern: "{max}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "step",
        condition: { kind: "when-provided", prop: "step" },
        value: { kind: "template", pattern: "{step}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "value",
        condition: { kind: "when-provided", prop: "value" },
        value: { kind: "template", pattern: "{value}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "template", pattern: "{name}" },
      },
    ],
  },
};
