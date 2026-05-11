/**
 * Site-wide field data, available in any template as `data.site.*`.
 * Eleventy auto-loads files in `_data/` and namespaces them by filename.
 */
export default {
  title: "Calibrate",
  tagline: "Measured Design Language System",
  description:
    "Calibrate is a multi-brand design system: a token foundation, a component library, and the framework adapters that ship them.",
  url: "https://calibrate.msrd.dev",
  copyright: "© 2026 Measured",
} as const;

export type SiteData = typeof import("./site").default;
