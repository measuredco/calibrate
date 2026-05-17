/**
 * Spacing page metadata and hero content, available as `data.spacing.*`.
 */
export default {
  strapline:
    "Calibrate’s spacing scale sets vertical and horizontal rhythm. Vertical steps have responsive variants that scale with the viewport — prefer those for page-level rhythm.",
  title: "Spacing",
} as const;

export type SpacingData = typeof import("./spacing").default;
