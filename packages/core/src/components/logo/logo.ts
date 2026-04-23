import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";

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
    class: "clbr-logo",
    "data-size": size,
    "data-tone": tone === "neutral" ? "neutral" : undefined,
    "data-variant": variant === "primary" ? undefined : variant,
  });

  return `<div ${logoAttrs}><span class="visually-hidden">${escapeHtml(label)}</span></div>`;
}

/** Declarative logo contract mirror for tooling, docs, and adapters. */
export const CLBR_LOGO_SPEC: ClbrComponentSpec = {
  name: "logo",
  description: "Use `logo` to display the brand mark.",
  output: { element: "div", class: "clbr-logo" },
  content: { kind: "text", prop: "label" },
  props: {
    label: {
      description: "Accessible label.",
      required: true,
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg", "fill"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "neutral"] },
    },
    variant: {
      default: "primary",
      description: "Logo variant.",
      type: {
        kind: "enum",
        values: ["primary", "secondary", "typographic", "graphic"],
      },
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
        attribute: "data-tone",
        condition: { kind: "when-equals", prop: "tone", to: "neutral" },
        value: { kind: "literal", text: "neutral" },
      },
      {
        target: { on: "host" },
        attribute: "data-variant",
        condition: {
          kind: "when-in",
          prop: "variant",
          values: ["secondary", "typographic", "graphic"],
        },
        value: { kind: "prop", prop: "variant" },
      },
    ],
  },
};
