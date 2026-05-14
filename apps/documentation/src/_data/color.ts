/**
 * Color page metadata and hero content, available as `data.color.*`.
 */
export default {
  strapline:
    "Calibrate’s semantic color system automatically adapts to theme and surface context. Always use the tokens, never raw color values.",
  title: "Color",
} as const;

export type ColorData = typeof import("./color").default;
