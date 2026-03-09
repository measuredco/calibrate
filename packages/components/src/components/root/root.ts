import { cx } from "../../helpers/cx";

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
  /** Optional explicit theme variant class to apply on the root wrapper. */
  theme?: ClbrTheme;
  /** Optional BCP47 language tag for the root wrapper (e.g. `en-GB`). */
  lang?: string;
}

/**
 * SSR renderer for the Calibrate root wrapper.
 *
 * Emits a `<div>` with the Calibrate root classes and optional `dir`/`lang`
 * attributes, then injects the provided HTML content inside.
 *
 * @param props - Root wrapper configuration and inner HTML content.
 * @returns HTML string for the Calibrate root wrapper.
 */
export function renderClbrRoot(props: ClbrRootProps): string {
  const { brand = "msrd", children, dir, theme, lang } = props;

  const classAttr = cx(
    "clbr",
    `clbr-brand-${brand}`,
    theme ? `clbr-theme-${theme}` : undefined,
  );
  const dirAttr = dir ? ` dir="${dir}"` : "";
  const langAttr = lang ? ` lang="${lang}"` : "";

  return `<div class="${classAttr}"${dirAttr}${langAttr}>${children}</div>`;
}
