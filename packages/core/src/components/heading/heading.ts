import { attrs, escapeHtml } from "../../helpers/html";

export type ClbrHeadingAlign = "start" | "center" | "end";
export type ClbrHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type ClbrHeadingSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

/**
 * Props for the Calibrate heading renderer.
 */
export interface ClbrHeadingProps {
  /**
   * Text alignment.
   * @default "start"
   */
  align?: ClbrHeadingAlign;
  /** Heading text content (escaped before render). */
  children: string;
  /**
   * Optional semantic heading level.
   * When omitted, renders a `span`.
   */
  level?: ClbrHeadingLevel;
  /**
   * Enables optical inline alignment adjustment for left sidebearing-heavy glyphs.
   * @default false
   */
  opticalInline?: boolean;
  /**
   * Enables breakpoint-responsive heading scale.
   * @default false
   */
  responsive?: boolean;
  /**
   * Heading size variant.
   * @default "md"
   */
  size?: ClbrHeadingSize;
}

/**
 * SSR renderer for the Calibrate heading component.
 *
 * @param props - Heading component props.
 * @returns HTML string for a heading element (`h1`..`h6`) or `span`.
 */
export function renderClbrHeading({
  align = "start",
  children,
  level,
  opticalInline,
  responsive,
  size = "md",
}: ClbrHeadingProps): string {
  const tag = level ? (`h${level}` as const) : "span";
  const headingAttrs = attrs({
    class: "heading",
    "data-align": align === "start" ? undefined : align,
    "data-optical-inline": opticalInline,
    "data-responsive": responsive,
    "data-size": size,
  });

  return `<${tag} ${headingAttrs}>${escapeHtml(children)}</${tag}>`;
}

/** Declarative heading contract mirror for tooling, docs, and adapters. */
export const CLBR_HEADING_SPEC = {
  name: "heading",
  output: {
    modes: {
      level1: "h1",
      level2: "h2",
      level3: "h3",
      level4: "h4",
      level5: "h5",
      level6: "h6",
      span: "span",
    },
  },
  props: {
    align: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    children: {
      required: true,
      type: "text",
    },
    level: {
      required: false,
      type: "enum",
      values: [1, 2, 3, 4, 5, 6],
    },
    opticalInline: {
      default: false,
      required: false,
      type: "boolean",
    },
    responsive: {
      default: false,
      required: false,
      type: "boolean",
    },
    size: {
      default: "md",
      required: false,
      type: "enum",
      values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
    },
  },
  rules: {
    modes: [
      {
        behavior: "render-as",
        value: "span",
        when: "level is omitted",
      },
      {
        behavior: "render-as",
        value: "h{level}",
        when: "level is provided",
      },
    ],
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "heading",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is center or end",
      },
      {
        behavior: "emit",
        target: "data-optical-inline",
        value: "present",
        when: "opticalInline is true",
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
    ],
  },
} as const;
