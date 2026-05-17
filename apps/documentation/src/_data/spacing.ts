/**
 * Spacing page metadata and hero content, available as `data.spacing.*`.
 */
export default {
  strapline:
    "Calibrate’s spacing scale sets vertical and horizontal rhythm. Prefer the responsive vertical scale at the page level.",
  title: "Spacing",
} as const;

export type SpacingData = typeof import("./spacing").default;
