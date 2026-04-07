import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrSpinnerSize =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "fill";
export type ClbrSpinnerTone = "default" | "brand";

/** Props for the Calibrate spinner renderer. */
export interface ClbrSpinnerProps {
  /**
   * Optional accessible status label.
   * Escaped and rendered in visually hidden text after the SVG.
   * When present, the spinner emits `role="status"`.
   */
  label?: string;
  /**
   * Size variant.
   * @default "md"
   */
  size?: ClbrSpinnerSize;
  /**
   * Tone variant.
   * @default "default"
   * Omitted from output when `default`.
   */
  tone?: ClbrSpinnerTone;
}

/**
 * SSR renderer for the Calibrate spinner component.
 *
 * Emits a `span.spinner` containing an aria-hidden SVG. When `label` is
 * provided, it also emits `role="status"` and visually hidden label text.
 *
 * @returns HTML string for a spinner element.
 */
export function renderClbrSpinner({
  label,
  size = "md",
  tone = "default",
}: ClbrSpinnerProps = {}): string {
  const spinnerAttrs = attrs({
    class: "spinner",
    "data-size": size,
    "data-tone": tone !== "default" ? tone : undefined,
    role: label ? "status" : undefined,
  });

  return `<span ${spinnerAttrs}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 544"><circle class="circle-lg" cx="272" cy="272" fill="none" r="208" stroke="currentColor" stroke-width="32" /><circle class="circle-sm" cx="125" cy="419" fill="currentColor" r="64" style="transform-origin: 272px" /></svg>${label ? `<span class="visually-hidden">${escapeHtml(label)}</span>` : ""}</span>`;
}

/** Declarative spinner contract mirror for tooling, docs, and adapters. */
export const CLBR_SPINNER_SPEC = {
  name: "spinner",
  output: {
    element: "span",
  },
  props: {
    label: {
      description:
        "Escaped visually hidden status text. Emits role=status when present.",
      type: "string",
      required: false,
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "fill"],
    },
    tone: {
      default: "default",
      description: "Emit data-tone only when not default.",
      required: false,
      type: "enum",
      values: ["default", "brand"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "spinner",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "2xs | xs | sm | md | lg | xl | 2xl | fill",
      },
      {
        behavior: "conditional",
        condition: 'emit data-tone when tone is not "default"',
        target: "data-tone",
        value: "brand",
      },
      {
        behavior: "conditional",
        condition: 'emit role="status" when label is present',
        target: "role",
        value: "status",
      },
    ],
    children: [
      {
        behavior: "always",
        target: "svg",
      },
      {
        behavior: "always",
        target: "svg circle.circle-lg",
      },
      {
        behavior: "always",
        target: "svg circle.circle-sm",
      },
      {
        behavior: "always",
        target: "svg",
        attribute: "aria-hidden",
        value: "true",
      },
      {
        behavior: "conditional",
        condition: "render visually hidden label text when label is present",
        target: "span.visually-hidden",
      },
    ],
  },
} as const;
