import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";

export type ClbrTextAs = "p" | "span";
export type ClbrTextSize = "xs" | "sm" | "md" | "lg";
export type ClbrTextTone = "default" | "muted";

export interface ClbrTextCommonProps {
  /** Trusted inner HTML. */
  children: string;
  /** Enables visited-state styling for links inside text. @default true */
  linkVisited?: boolean;
  /** Enables breakpoint-responsive body scale. @default false */
  responsive?: boolean;
  /** Text size. @default "md" */
  size?: ClbrTextSize;
  /** Tone variant. @default "default" */
  tone?: ClbrTextTone;
}

export interface ClbrTextSpanProps extends ClbrTextCommonProps {
  /** Element tag. @default "span" */
  as?: "span";
}

export interface ClbrTextParagraphProps extends ClbrTextCommonProps {
  /** Element tag. */
  as: "p";
  /** Text alignment. @default "start" */
  align?: ClbrAlign;
  /** Applies max measure constraints for long-form readability. @default true */
  measured?: boolean;
}

export type ClbrTextProps = ClbrTextSpanProps | ClbrTextParagraphProps;

/**
 * SSR renderer for the Calibrate text component.
 *
 * @param props - Text component props.
 * @returns HTML string for a text paragraph or span element.
 */
export function renderClbrText(props: ClbrTextProps): string {
  const {
    children,
    linkVisited = true,
    responsive,
    size = "md",
    tone = "default",
  } = props;
  const as: ClbrTextAs = props.as === "p" ? "p" : "span";
  let align: ClbrAlign | undefined;
  let measured: boolean | undefined;

  if (props.as === "p") {
    align = props.align ?? "start";
    measured = props.measured ?? true;
  }

  const isParagraph = as === "p";
  const textAttrs = attrs({
    class: "text",
    "data-align": isParagraph && align !== "start" ? align : undefined,
    "data-link-visited": linkVisited ? undefined : "off",
    "data-measured": isParagraph && measured,
    "data-responsive": responsive,
    "data-size": size,
    "data-tone": tone === "muted" ? "muted" : undefined,
  });

  return `<${as} ${textAttrs}>${children}</${as}>`;
}

/** Declarative text contract mirror for tooling, docs, and adapters. */
export const CLBR_TEXT_SPEC = {
  name: "text",
  description: "Use `text` for inline or single paragraph body copy.",
  output: {
    modes: {
      paragraph: "p",
      span: "span",
    },
  },
  props: {
    as: {
      default: "span",
      description: "HTML element used for the text.",
      required: false,
      type: "enum",
      values: ["p", "span"],
    },
    children: {
      description: "Text content.",
      required: true,
      type: "html",
    },
    linkVisited: {
      default: true,
      description: "Styles visited links inside the text.",
      required: false,
      type: "boolean",
    },
    responsive: {
      default: false,
      description: "Scales text across breakpoints.",
      required: false,
      type: "boolean",
    },
    align: {
      default: "start",
      description: "Text alignment.",
      ignoredWhen: "as is span",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
      when: "as is p",
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      ignoredWhen: "as is span",
      required: false,
      type: "boolean",
      when: "as is p",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg"],
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["default", "muted"],
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "span",
        when: "as is span or omitted (span mode)",
      },
      {
        behavior: "render-as",
        value: "p",
        when: "as is p (paragraph mode)",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "text",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "as is p and align is center or end",
      },
      {
        behavior: "emit",
        target: "data-link-visited",
        value: "off",
        when: "linkVisited is false",
      },
      {
        behavior: "emit",
        target: "data-measured",
        value: "present",
        when: "as is p and measured is true",
      },
      {
        behavior: "emit",
        target: "data-responsive",
        value: "present",
        when: "responsive is true",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "muted",
        when: "tone is muted",
      },
    ],
  },
} as const;
