/**
 * Effect page metadata and hero content, available as `data.effect.*`.
 */
export default {
  strapline:
    "Calibrate’s effect tokens apply elevation, emphasis, and decorative treatment.",
  title: "Effects",
} as const;

export type EffectData = typeof import("./effect").default;
