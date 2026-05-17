/**
 * Radius page metadata and hero content, available as `data.radius.*`.
 */
export default {
  strapline:
    "Calibrate’s corner radii. Fixed steps for UI surfaces; ratios scale the rounding to an element’s size.",
  title: "Radius",
} as const;

export type RadiusData = typeof import("./radius").default;
