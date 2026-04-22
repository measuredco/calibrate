import { attrs } from "../../helpers/html";
import type { ClbrAlign } from "../../types";

export type ClbrGridGap = "default" | "expanded" | "none";
export type ClbrGridTrack = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ClbrGridProps {
  /** Trusted inner HTML (typically grid items). */
  children?: string;
  /** Gap behavior. @default "default" */
  gap?: ClbrGridGap;
}

export interface ClbrGridItemProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Align-self. */
  align?: ClbrAlign;
  /** Column span at default container threshold. */
  colSpan?: ClbrGridTrack;
  /** Column span at narrow container threshold. */
  colSpanNarrow?: ClbrGridTrack;
  /** Column span at wide container threshold. Effect is only visible above the wide breakpoint. */
  colSpanWide?: ClbrGridTrack;
  /** Column start at default container threshold. */
  colStart?: ClbrGridTrack;
  /** Column start at narrow container threshold. */
  colStartNarrow?: ClbrGridTrack;
  /** Column start at wide container threshold. Effect is only visible above the wide breakpoint. */
  colStartWide?: ClbrGridTrack;
  /** Justify-self. */
  justify?: ClbrAlign;
  /** Row span at default container threshold. */
  rowSpan?: ClbrGridTrack;
  /** Row span at narrow container threshold. */
  rowSpanNarrow?: ClbrGridTrack;
  /** Row span at wide container threshold. Effect is only visible above the wide breakpoint. */
  rowSpanWide?: ClbrGridTrack;
  /** Row start at default container threshold. */
  rowStart?: ClbrGridTrack;
  /** Row start at narrow container threshold. */
  rowStartNarrow?: ClbrGridTrack;
  /** Row start at wide container threshold. Effect is only visible above the wide breakpoint. */
  rowStartWide?: ClbrGridTrack;
}

const validateGridTrack = (
  value: ClbrGridTrack | undefined,
): string | undefined => {
  if (value === undefined) return undefined;

  return String(value);
};

/**
 * SSR renderer for the Calibrate grid component.
 *
 * @param props - Grid component props.
 * @returns HTML string for a grid wrapper.
 */
export function renderClbrGrid({
  children,
  gap = "default",
}: ClbrGridProps): string {
  const containerAttrs = attrs({
    class: "clbr-grid",
    "data-gap": gap === "default" ? undefined : gap,
  });
  const gridAttrs = attrs({
    class: "grid",
  });

  return `<div ${containerAttrs}><div ${gridAttrs}>${children ?? ""}</div></div>`;
}

/**
 * SSR renderer for the Calibrate grid-item component.
 *
 * @param props - Grid-item component props.
 * @returns HTML string for a grid item.
 */
export function renderClbrGridItem({
  align,
  children,
  colSpan,
  colSpanNarrow,
  colSpanWide,
  colStart,
  colStartNarrow,
  colStartWide,
  justify,
  rowSpan,
  rowSpanNarrow,
  rowSpanWide,
  rowStart,
  rowStartNarrow,
  rowStartWide,
}: ClbrGridItemProps): string {
  const gridItemAttrs = attrs({
    class: "clbr-grid-item",
    "data-align": align,
    "data-justify": justify,
    "data-col-span-narrow": validateGridTrack(colSpanNarrow),
    "data-col-start-narrow": validateGridTrack(colStartNarrow),
    "data-col-span": validateGridTrack(colSpan),
    "data-col-start": validateGridTrack(colStart),
    "data-col-span-wide": validateGridTrack(colSpanWide),
    "data-col-start-wide": validateGridTrack(colStartWide),
    "data-row-span-narrow": validateGridTrack(rowSpanNarrow),
    "data-row-start-narrow": validateGridTrack(rowStartNarrow),
    "data-row-span": validateGridTrack(rowSpan),
    "data-row-start": validateGridTrack(rowStart),
    "data-row-span-wide": validateGridTrack(rowSpanWide),
    "data-row-start-wide": validateGridTrack(rowStartWide),
  });

  return `<div ${gridItemAttrs}>${children ?? ""}</div>`;
}

/** Declarative grid contract mirror for tooling, docs, and adapters. */
export const CLBR_GRID_SPEC = {
  name: "grid",
  description: "Use `grid` to lay out content in a 12-column responsive grid.",
  output: {
    element: "div",
    class: "clbr-grid",
    children: ["div.grid"],
  },
  props: {
    children: {
      description: "`grid-item` components rendered inside the grid.",
      required: false,
      type: "html",
    },
    gap: {
      default: "default",
      description: "Space between the `grid-item` components.",
      required: false,
      type: "enum",
      values: ["default", "expanded", "none"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-grid",
      },
      {
        behavior: "emit",
        target: "data-gap",
        value: "{gap}",
        when: "gap is expanded or none",
      },
      {
        behavior: "always",
        target: "div.grid@class",
        value: "grid",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "div.grid",
      },
    ],
  },
} as const;

/** Declarative grid-item contract mirror for tooling, docs, and adapters. */
export const CLBR_GRID_ITEM_SPEC = {
  name: "grid-item",
  description: "Use `grid-item` to place content within a `grid` layout.",
  output: {
    element: "div",
  },
  props: {
    children: {
      description: "Content rendered inside the grid item.",
      required: false,
      type: "html",
    },
    align: {
      description: "Block-axis alignment within the grid cell.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    justify: {
      description: "Inline-axis alignment within the grid cell.",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    colSpan: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Columns spanned at the default breakpoint.",
      required: false,
      type: "number",
    },
    colStart: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Starting column at the default breakpoint.",
      required: false,
      type: "number",
    },
    rowSpan: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Rows spanned at the default breakpoint.",
      required: false,
      type: "number",
    },
    rowSpanNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Rows spanned at the narrow breakpoint.",
      required: false,
      type: "number",
    },
    rowSpanWide: {
      constraints: ["integer", "min:1", "max:12"],
      description:
        "Rows spanned at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      required: false,
      type: "number",
    },
    rowStart: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Starting row at the default breakpoint.",
      required: false,
      type: "number",
    },
    rowStartNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Starting row at the narrow breakpoint.",
      required: false,
      type: "number",
    },
    rowStartWide: {
      constraints: ["integer", "min:1", "max:12"],
      description:
        "Starting row at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      required: false,
      type: "number",
    },
    colSpanNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Columns spanned at the narrow breakpoint.",
      required: false,
      type: "number",
    },
    colStartNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      description: "Starting column at the narrow breakpoint.",
      required: false,
      type: "number",
    },
    colSpanWide: {
      constraints: ["integer", "min:1", "max:12"],
      description:
        "Columns spanned at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      required: false,
      type: "number",
    },
    colStartWide: {
      constraints: ["integer", "min:1", "max:12"],
      description:
        "Starting column at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      required: false,
      type: "number",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-grid-item",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is provided",
      },
      {
        behavior: "emit",
        target: "data-justify",
        value: "{justify}",
        when: "justify is provided",
      },
      {
        behavior: "emit",
        target: "data-col-span",
        value: "{colSpan}",
        when: "colSpan is provided",
      },
      {
        behavior: "emit",
        target: "data-col-start",
        value: "{colStart}",
        when: "colStart is provided",
      },
      {
        behavior: "emit",
        target: "data-row-span",
        value: "{rowSpan}",
        when: "rowSpan is provided",
      },
      {
        behavior: "emit",
        target: "data-row-span-narrow",
        value: "{rowSpanNarrow}",
        when: "rowSpanNarrow is provided",
      },
      {
        behavior: "emit",
        target: "data-row-span-wide",
        value: "{rowSpanWide}",
        when: "rowSpanWide is provided",
      },
      {
        behavior: "emit",
        target: "data-row-start",
        value: "{rowStart}",
        when: "rowStart is provided",
      },
      {
        behavior: "emit",
        target: "data-row-start-narrow",
        value: "{rowStartNarrow}",
        when: "rowStartNarrow is provided",
      },
      {
        behavior: "emit",
        target: "data-row-start-wide",
        value: "{rowStartWide}",
        when: "rowStartWide is provided",
      },
      {
        behavior: "emit",
        target: "data-col-span-narrow",
        value: "{colSpanNarrow}",
        when: "colSpanNarrow is provided",
      },
      {
        behavior: "emit",
        target: "data-col-start-narrow",
        value: "{colStartNarrow}",
        when: "colStartNarrow is provided",
      },
      {
        behavior: "emit",
        target: "data-col-span-wide",
        value: "{colSpanWide}",
        when: "colSpanWide is provided",
      },
      {
        behavior: "emit",
        target: "data-col-start-wide",
        value: "{colStartWide}",
        when: "colStartWide is provided",
      },
    ],
  },
} as const;
