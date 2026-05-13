/**
 * Color page metadata and hero content, available as `data.color.*`.
 */
export default {
  strapline:
    "Explore the semantic color tokens across Calibrate's light, dark, default, and brand surface contexts.",
  title: "Color",
} as const;

export type ColorData = typeof import("./color").default;
