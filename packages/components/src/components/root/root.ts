export type ClbrBrand = "msrd" | "wrfr";
export type ClbrDirection = "ltr" | "rtl";

export interface ClbrRootProps {
  children: string;
  brand?: ClbrBrand;
  dir?: ClbrDirection;
  lang?: string;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * SSR renderer for Calibrate root wrapper.
 *
 * This defines the global `.clbr` scope with brand and direction attributes.
 */
export function renderClbrRoot(input: ClbrRootProps): string {
  const { brand = "msrd", children, className, dir, lang } = input;

  const finalClassName = cx("clbr", `clbr-brand-${brand}`, className);
  const dirAttr = dir ? ` dir="${dir}"` : "";
  const langAttr = lang ? ` lang="${lang}"` : "";

  return `<div class="${finalClassName}"${dirAttr}${langAttr}>${children}</div>`;
}
