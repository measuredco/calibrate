import { attrs } from "../../helpers/html";

export type ClbrGridGap = "default" | "expanded" | "none";
export type ClbrGridPlacement = "start" | "center" | "end";
export type ClbrGridTrack = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Props for the Calibrate grid renderer. */
export interface ClbrGridProps {
  /**
   * Inner HTML content to render inside the grid wrapper.
   * Caller is responsible for sanitizing untrusted content.
   * Direct children should be grid items (for example via `renderClbrGridItem`).
   */
  children?: string;
  /**
   * Grid gap behavior.
   * @default "default"
   */
  gap?: ClbrGridGap;
}

/** Props for the Calibrate grid-item renderer. */
export interface ClbrGridItemProps {
  /**
   * Inner HTML content to render inside the grid item.
   * Caller is responsible for sanitizing untrusted content.
   */
  children?: string;
  /**
   * Item align-self behavior.
   * @default "start"
   */
  align?: ClbrGridPlacement;
  /** Column span at default container threshold. */
  colSpan?: ClbrGridTrack;
  /** Column span at narrow container threshold. */
  colSpanNarrow?: ClbrGridTrack;
  /** Column span at wide container threshold. */
  colSpanWide?: ClbrGridTrack;
  /** Column start at default container threshold. */
  colStart?: ClbrGridTrack;
  /** Column start at narrow container threshold. */
  colStartNarrow?: ClbrGridTrack;
  /** Column start at wide container threshold. */
  colStartWide?: ClbrGridTrack;
  /**
   * Item justify-self behavior.
   * @default "start"
   */
  justify?: ClbrGridPlacement;
  /** Row span at default container threshold. */
  rowSpan?: ClbrGridTrack;
  /** Row span at narrow container threshold. */
  rowSpanNarrow?: ClbrGridTrack;
  /** Row span at wide container threshold. */
  rowSpanWide?: ClbrGridTrack;
  /** Row start at default container threshold. */
  rowStart?: ClbrGridTrack;
  /** Row start at narrow container threshold. */
  rowStartNarrow?: ClbrGridTrack;
  /** Row start at wide container threshold. */
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
  const gridAttrs = attrs({
    class: "grid",
    "data-gap": gap === "default" ? undefined : gap,
  });

  return `<div class="grid-container"><div ${gridAttrs}>${children ?? ""}</div></div>`;
}

/**
 * SSR renderer for the Calibrate grid-item component.
 *
 * @param props - Grid-item component props.
 * @returns HTML string for a grid item.
 */
export function renderClbrGridItem({
  align = "start",
  children,
  colSpan,
  colSpanNarrow,
  colSpanWide,
  colStart,
  colStartNarrow,
  colStartWide,
  justify = "start",
  rowSpan,
  rowSpanNarrow,
  rowSpanWide,
  rowStart,
  rowStartNarrow,
  rowStartWide,
}: ClbrGridItemProps): string {
  const gridItemAttrs = attrs({
    class: "grid-item",
    "data-align": align === "start" ? undefined : align,
    "data-justify": justify === "start" ? undefined : justify,
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
  output: {
    element: "div",
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    gap: {
      default: "default",
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
        value: "grid-container",
      },
      {
        behavior: "emit",
        target: "div.grid[data-gap]",
        value: "{gap}",
        when: "gap is expanded or none",
      },
      {
        behavior: "always",
        target: "div.grid",
        value: "class=grid",
      },
    ],
  },
} as const;

/** Declarative grid-item contract mirror for tooling, docs, and adapters. */
export const CLBR_GRID_ITEM_SPEC = {
  name: "grid-item",
  output: {
    element: "div",
  },
  props: {
    children: {
      required: false,
      type: "html",
    },
    align: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    justify: {
      default: "start",
      required: false,
      type: "enum",
      values: ["start", "center", "end"],
    },
    colSpan: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    colStart: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowSpan: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowSpanNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowSpanWide: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowStart: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowStartNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    rowStartWide: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    colSpanNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    colStartNarrow: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    colSpanWide: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
    colStartWide: {
      constraints: ["integer", "min:1", "max:12"],
      required: false,
      type: "number",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "grid-item",
      },
      {
        behavior: "emit",
        target: "data-align",
        value: "{align}",
        when: "align is center or end",
      },
      {
        behavior: "emit",
        target: "data-justify",
        value: "{justify}",
        when: "justify is center or end",
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
