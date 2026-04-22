import { attrs } from "../../helpers/html";

export type ClbrContainerGutter = "default" | "narrow" | "none";
export type ClbrContainerMaxInlineSize = "default" | "wide" | "none";

export interface ClbrContainerProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Inline gutter behavior. @default "default" */
  gutter?: ClbrContainerGutter;
  /** Max-inline-size behavior. Effect is only visible on wider viewports. @default "default" */
  maxInlineSize?: ClbrContainerMaxInlineSize;
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
  maxInlineSize = "default",
}: ClbrContainerProps): string {
  const containerAttrs = attrs({
    class: "clbr-container",
    "data-gutter": gutter === "default" ? undefined : gutter,
    "data-max-inline-size":
      maxInlineSize === "default" ? undefined : maxInlineSize,
  });

  return `<div ${containerAttrs}>${children ?? ""}</div>`;
}

/** Declarative container contract mirror for tooling, docs, and adapters. */
export const CLBR_CONTAINER_SPEC = {
  name: "container",
  description: "Use `container` to wrap page-level content.",
  output: {
    element: "div",
  },
  props: {
    children: {
      description: "Content rendered inside the container.",
      required: false,
      type: "html",
    },
    gutter: {
      default: "default",
      description: "Horizontal gutter width.",
      required: false,
      type: "enum",
      values: ["default", "narrow", "none"],
    },
    maxInlineSize: {
      default: "default",
      description:
        "Maximum content width. Effect is only visible in wider viewports.",
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
        value: "clbr-container",
      },
      {
        behavior: "emit",
        target: "data-max-inline-size",
        value: "{maxInlineSize}",
        when: "maxInlineSize is wide or none",
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
