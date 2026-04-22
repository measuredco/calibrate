import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
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

  return `<${CLBR_RANGE_TAG_NAME}><div ${fieldAttrs}><div class="label-wrapper"><label class="label" for="${normalizedId}">${escapeHtml(
    label,
  )}</label><output class="output" for="${normalizedId}"></output></div><input ${inputAttrs}>${descriptionMarkup}</div></${CLBR_RANGE_TAG_NAME}>`;
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
export const CLBR_RANGE_SPEC = {
  name: "range",
  description:
    "Use `clbr-range` to let users pick a numeric value along a scale.",
  output: {
    element: CLBR_RANGE_TAG_NAME,
    class: "clbr-range (inner)",
    children: [
      "div.clbr-range",
      "div.label-wrapper",
      "label.label",
      "output.output",
      "input.range[type='range']",
      "optional p.description",
    ],
  },
  props: {
    description: {
      description: "Helper text shown below the range.",
      required: false,
      type: "string",
    },
    disabled: {
      default: false,
      description: "Disables the range.",
      required: false,
      type: "boolean",
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description: "`id` used to associate the input with its label.",
      required: true,
      type: "string",
    },
    inlineSize: {
      default: "full",
      description: "How the range fills its container.",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
    label: {
      description: "Label text.",
      required: true,
      type: "text",
    },
    max: {
      description: "Maximum value.",
      required: false,
      type: "number",
    },
    min: {
      description: "Minimum value.",
      required: false,
      type: "number",
    },
    name: {
      description: "Form field name.",
      required: false,
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    step: {
      description: "Granularity of value changes.",
      required: false,
      type: "number",
    },
    value: {
      description: "Current value.",
      required: false,
      type: "number",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "div.clbr-range@class",
        value: "clbr-range",
      },
      {
        behavior: "always",
        target: "div.clbr-range@data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "div.clbr-range@data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
      },
      {
        behavior: "always",
        target: "input.range@class",
        value: "range",
      },
      {
        behavior: "always",
        target: "input.range@type",
        value: "range",
      },
      {
        behavior: "emit",
        target: "input.range@aria-describedby",
        value: "{id}-description",
        when: "description is provided",
      },
      {
        behavior: "emit",
        target: "input.range@disabled",
        when: "disabled is true",
      },
      {
        behavior: "emit",
        target: "input.range@min",
        value: "{min}",
        when: "min is provided",
      },
      {
        behavior: "emit",
        target: "input.range@max",
        value: "{max}",
        when: "max is provided",
      },
      {
        behavior: "emit",
        target: "input.range@step",
        value: "{step}",
        when: "step is provided",
      },
      {
        behavior: "emit",
        target: "input.range@value",
        value: "{value}",
        when: "value is provided",
      },
      {
        behavior: "emit",
        target: "input.range@name",
        value: "{name}",
        when: "name is non-empty",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "div.label-wrapper",
      },
      {
        behavior: "always",
        value: "label.label",
      },
      {
        behavior: "always",
        value: "output.output",
      },
      {
        behavior: "always",
        value: "input.range",
      },
      {
        behavior: "emit",
        value: "p.description",
        when: "description is provided",
      },
      {
        behavior: "runtime",
        value: "output.output text mirrors input.range value",
        when: "defineClbrRange() has upgraded the host",
      },
    ],
  },
} as const;
