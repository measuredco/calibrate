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

export interface ClbrSpinnerProps {
  /** Accessible status label. */
  label?: string;
  /** Size variant. @default "md" */
  size?: ClbrSpinnerSize;
  /** Tone variant. @default "default" */
  tone?: ClbrSpinnerTone;
}

/**
 * SSR renderer for the Calibrate spinner component.
 *
 * @param props - Spinner component props.
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
    "data-tone": tone === "brand" ? "brand" : undefined,
    role: label ? "status" : undefined,
  });

  return `<span ${spinnerAttrs}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 544"><circle class="circle-lg" cx="272" cy="272" fill="none" r="208" stroke="currentColor" stroke-width="32" /><circle class="circle-sm" cx="125" cy="419" fill="currentColor" r="64" style="transform-origin: 272px" /></svg>${label ? `<span class="visually-hidden">${escapeHtml(label)}</span>` : ""}</span>`;
}

/** Declarative spinner contract mirror for tooling, docs, and adapters. */
export const CLBR_SPINNER_SPEC = {
  name: "spinner",
  description: "Use `spinner` to indicate loading or in-progress state.",
  output: {
    element: "span",
  },
  props: {
    label: {
      description: "Accessible status label announced to assistive tech.",
      type: "string",
      required: false,
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "fill"],
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
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
