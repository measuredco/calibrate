import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrLogoTone = "default" | "neutral";
export type ClbrLogoSize = "sm" | "md" | "lg" | "fill";
export type ClbrLogoVariant =
  | "primary"
  | "secondary"
  | "typographic"
  | "graphic";

export interface ClbrLogoProps {
  /** Accessible label. */
  label: string;
  /** Size. @default "md" */
  size?: ClbrLogoSize;
  /** Tone. @default "default" */
  tone?: ClbrLogoTone;
  /** Variant. @default "primary" */
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
    "data-tone": tone === "neutral" ? "neutral" : undefined,
    "data-variant": variant === "primary" ? undefined : variant,
  });

  return `<div ${logoAttrs}><span class="visually-hidden">${escapeHtml(label)}</span></div>`;
}

/** Declarative logo contract mirror for tooling, docs, and adapters. */
export const CLBR_LOGO_SPEC = {
  name: "logo",
  description: "Use `logo` to display the Measured brand mark.",
  output: {
    element: "div",
  },
  props: {
    label: {
      description: "Accessible label.",
      required: true,
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md", "lg", "fill"],
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["default", "neutral"],
    },
    variant: {
      default: "primary",
      description: "Logo variant.",
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
