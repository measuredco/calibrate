/**
 * Layout page metadata and hero content, available as `data.layoutPage.*`.
 *
 * Named `layoutPage` rather than `layout` because Eleventy reserves the
 * `layout` data key for the layout-template specifier.
 */
export default {
  strapline:
    "Calibrate’s layout tokens set the structural dimensions that frame and align content.",
  title: "Layout",
} as const;

export type LayoutPageData = typeof import("./layoutPage").default;
