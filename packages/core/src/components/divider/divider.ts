import { attrs } from "../../helpers/html";

export type ClbrDividerOrientation = "horizontal" | "vertical";
export type ClbrDividerTone = "default" | "subtle" | "brand";

/** Props for the Calibrate divider renderer. */
export interface ClbrDividerProps {
  /**
   * Divider orientation.
   * @default "horizontal"
   */
  orientation?: ClbrDividerOrientation;
  /**
   * Divider tone variant.
   * Omitted when `default`.
   * @default "default"
   */
  tone?: ClbrDividerTone;
}

/**
 * SSR renderer for the Calibrate divider component.
 *
 * @param props - Divider component props.
 * @returns HTML string for a separator element.
 */
export function renderClbrDivider({
  orientation = "horizontal",
  tone = "default",
}: ClbrDividerProps = {}): string {
  const dividerAttrs = attrs({
    "aria-orientation": orientation === "vertical" ? "vertical" : undefined,
    class: "divider",
    "data-tone": tone === "default" ? undefined : tone,
    role: orientation === "vertical" ? "separator" : undefined,
  });

  if (orientation === "horizontal") {
    return `<hr ${dividerAttrs}>`;
  }

  return `<span ${dividerAttrs}></span>`;
}

/** Declarative divider contract mirror for tooling, docs, and adapters. */
export const CLBR_DIVIDER_SPEC = {
  name: "divider",
  output: {
    modes: {
      horizontal: "hr",
      vertical: "span",
    },
  },
  props: {
    orientation: {
      default: "horizontal",
      required: false,
      type: "enum",
      values: ["horizontal", "vertical"],
    },
    tone: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "subtle", "brand"],
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "hr",
        when: "orientation is horizontal or omitted",
      },
      {
        behavior: "render-as",
        value: "span",
        when: "orientation is vertical",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "divider",
      },
      {
        behavior: "emit",
        target: "role",
        value: "separator",
        when: "orientation is vertical",
      },
      {
        behavior: "emit",
        target: "aria-orientation",
        value: "vertical",
        when: "orientation is vertical",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: "tone is subtle or brand",
      },
    ],
  },
} as const;
