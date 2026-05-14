/**
 * Typography page metadata and hero content, available as `data.typography.*`.
 */
export default {
  strapline:
    "Calibrate’s typographic components are the preferred entry point. Fall back to semantic tokens when composing custom typography.",
  title: "Typography",
} as const;

export type TypographyData = typeof import("./typography").default;
