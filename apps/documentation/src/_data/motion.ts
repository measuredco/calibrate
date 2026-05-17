/**
 * Motion page metadata and hero content, available as `data.motion.*`.
 */
export default {
  strapline:
    "Calibrate’s motion tokens — durations and easing curves for transitions and animation.",
  title: "Motion",
} as const;

export type MotionData = typeof import("./motion").default;
