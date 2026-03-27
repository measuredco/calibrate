import { attrs } from "../../helpers/html";

export type ClbrContainerGutter = "default" | "narrow" | "none";
export type ClbrContainerMaxWidth = "default" | "wide" | "none";

/** Props for the Calibrate container renderer. */
export interface ClbrContainerProps {
  /**
   * Inner HTML content to render inside the container wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Container width behavior.
   * @default "default"
   */
  maxWidth?: ClbrContainerMaxWidth;
  /**
   * Container inline gutter behavior.
   * @default "default"
   */
  gutter?: ClbrContainerGutter;
}

/**
 * SSR renderer for the Calibrate container component.
 *
 * @param props - Container component props.
 * @returns HTML string for a container wrapper.
 */
export function renderClbrContainer({
  children,
  gutter = "default",
  maxWidth = "default",
}: ClbrContainerProps): string {
  const containerAttrs = attrs({
    class: "container",
    "data-gutter": gutter === "default" ? undefined : gutter,
    "data-max-width": maxWidth === "default" ? undefined : maxWidth,
  });

  return `<div ${containerAttrs}>${children ?? ""}</div>`;
}

/** Declarative container contract mirror for tooling, docs, and adapters. */
export const CLBR_CONTAINER_SPEC = {
  name: "container",
  output: {
    element: "div",
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    gutter: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "narrow", "none"],
    },
    maxWidth: {
      default: "default",
      required: false,
      type: "enum",
      values: ["default", "wide", "none"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "container",
      },
      {
        behavior: "emit",
        target: "data-max-width",
        value: "{maxWidth}",
        when: "maxWidth is wide or none",
      },
      {
        behavior: "emit",
        target: "data-gutter",
        value: "{gutter}",
        when: "gutter is narrow or none",
      },
    ],
  },
} as const;
