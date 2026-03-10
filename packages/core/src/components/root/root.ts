export type ClbrBrand = "msrd" | "wrfr";
export type ClbrDirection = "ltr" | "rtl";
export type ClbrTheme = "light" | "dark";

/**
 * Props for the Calibrate root wrapper renderer.
 */
export interface ClbrRootProps {
  /**
   * Brand variant applied to the root wrapper.
   * @default "msrd"
   */
  brand?: ClbrBrand;
  /** Inner HTML content to render inside the root wrapper. */
  children: string;
  /** Optional explicit text direction for the root wrapper. */
  dir?: ClbrDirection;
  /** Optional BCP47 language tag for the root wrapper (e.g. `en-GB`). */
  lang?: string;
  /** Optional explicit theme variant class to apply on the root wrapper. */
  theme?: ClbrTheme;
}

/**
 * SSR renderer for the Calibrate root wrapper.
 *
 * Emits a `<div>` with the Calibrate root class, required `data-brand`,
 * optional `data-theme`, and optional `dir`/`lang` attributes, then injects
 * the provided HTML content inside.
 *
 * @param props - Root wrapper configuration and inner HTML content.
 * @returns HTML string for the Calibrate root wrapper.
 */
export function renderClbrRoot(props: ClbrRootProps): string {
  const { brand = "msrd", children, dir, lang, theme } = props;

  const brandAttr = ` data-brand="${brand}"`;
  const classAttr = "clbr";
  const dirAttr = dir ? ` dir="${dir}"` : "";
  const langAttr = lang ? ` lang="${lang}"` : "";
  const themeAttr = theme ? ` data-theme="${theme}"` : "";

  return `<div class="${classAttr}"${brandAttr}${themeAttr}${langAttr}${dirAttr}>${children}</div>`;
}

/** Declarative root contract mirror for tooling, docs, and adapters. */
export const CLBR_ROOT_SPEC = {
  name: "root",
  output: {
    element: "div",
  },
  props: {
    brand: {
      default: "msrd",
      required: false,
      type: "enum",
      values: ["msrd", "wrfr"],
    },
    children: {
      required: true,
      type: "html",
    },
    dir: {
      required: false,
      type: "enum",
      values: ["ltr", "rtl"],
    },
    lang: {
      format: "bcp47",
      required: false,
      type: "string",
    },
    theme: {
      required: false,
      type: "enum",
      values: ["light", "dark"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "data-brand",
        value: "{brand}",
      },
      {
        behavior: "emit",
        target: "data-theme",
        value: "{theme}",
        when: "theme is provided",
      },
      {
        behavior: "emit",
        target: "dir",
        when: "dir is provided",
      },
      {
        behavior: "emit",
        target: "lang",
        when: "lang is provided",
      },
    ],
    classes: [
      {
        behavior: "always",
        value: "clbr",
      },
    ],
  },
} as const;
