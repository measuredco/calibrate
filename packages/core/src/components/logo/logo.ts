import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrLogoTone = "default" | "neutral";
export type ClbrLogoSize = "sm" | "md" | "lg" | "fill";
export type ClbrLogoVariant =
  | "primary"
  | "secondary"
  | "typographic"
  | "graphic";

/** Props for the Calibrate logo renderer. */
export interface ClbrLogoProps {
  /**
   * Accessible label text rendered in a visually hidden span.
   */
  label: string;
  /**
   * Logo size.
   * @default "md"
   */
  size?: ClbrLogoSize;
  /**
   * Logo tone.
   * @default "default"
   */
  tone?: ClbrLogoTone;
  /**
   * Logo variant.
   * @default "primary"
   */
  variant?: ClbrLogoVariant;
}

/**
 * SSR renderer for the Calibrate logo component.
 *
 * @param props - Logo component props.
 * @returns HTML string for a masked logo element.
 */
export function renderClbrLogo({
  label,
  size = "md",
  tone = "default",
  variant = "primary",
}: ClbrLogoProps): string {
  const logoAttrs = attrs({
    class: "logo",
    "data-size": size,
    "data-tone": tone === "default" ? undefined : tone,
    "data-variant": variant === "primary" ? undefined : variant,
  });

  return `<div ${logoAttrs}><span class="visually-hidden">${escapeHtml(label)}</span></div>`;
}

/** Declarative logo contract mirror for tooling, docs, and adapters. */
export const CLBR_LOGO_SPEC = {
  name: "logo",
  output: {
    element: "div",
  },
  props: {
    label: {
      required: true,
      type: "string",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["sm", "md", "lg", "fill"],
    },
    tone: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "neutral"],
    },
    variant: {
      default: "primary",
      required: false,
      type: "enum",
      values: ["primary", "secondary", "typographic", "graphic"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "logo",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: "tone is neutral",
      },
      {
        behavior: "emit",
        target: "data-variant",
        value: "{variant}",
        when: "variant is secondary, typographic, or graphic",
      },
    ],
    content: [
      {
        behavior: "always",
        target: "span.visually-hidden",
        value: "{label}",
      },
    ],
  },
} as const;
