/**
 * Breakpoint page metadata and hero content, available as `data.breakpoint.*`.
 */
export default {
  strapline:
    "Calibrate’s breakpoints mark the viewport widths where layouts adapt. Design from the smallest up.",
  title: "Breakpoint",
} as const;

export type BreakpointData = typeof import("./breakpoint").default;
