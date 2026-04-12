import { attrs } from "../../helpers/html";

export type ClbrBrand = "msrd" | "wrfr";
export type ClbrDirection = "ltr" | "rtl";
export type ClbrAppOverscrollBehavior = "none";
export type ClbrTheme = "light" | "dark";

/**
 * Props for the Calibrate root wrapper renderer.
 */
export interface ClbrRootProps {
  /**
   * Marks this root as the owning app root.
   * Emits `data-app-root` only when `true`.
   * @default false
   */
  appRoot?: boolean;
  /**
   * Opts this root into `overscroll-behavior: none` integration hooks.
   * Emits `data-app-overscroll-behavior="none"` when provided.
   */
  appOverscrollBehavior?: ClbrAppOverscrollBehavior;
  /**
   * Brand variant applied to the root wrapper.
   * @default "msrd"
   */
  brand?: ClbrBrand;
  /**
   * Inner HTML content to render inside the root wrapper.
   * Caller is responsible for sanitizing untrusted content.
   */
  children: string;
  /** Optional explicit text direction for the root wrapper. */
  dir?: ClbrDirection;
  /** Optional BCP47 language tag for the root wrapper (e.g. `en-GB`). */
  lang?: string;
  /** Optional explicit theme variant class to apply on the root wrapper. */
  theme?: ClbrTheme;
}

/**
 * SSR renderer for the Calibrate root component.
 *
 * Emits a `<div>` with the Calibrate root class, required `data-brand`,
 * optional `data-theme`, and optional `dir`/`lang` attributes, then injects
 * the provided HTML content inside.
 *
 * @param props - Root component props.
 * @returns HTML string for the Calibrate root component.
 */
export function renderClbrRoot(props: ClbrRootProps): string {
  const {
    appOverscrollBehavior,
    appRoot,
    brand = "msrd",
    children,
    dir,
    lang,
    theme,
  } = props;

  const rootAttrs = attrs({
    class: "clbr",
    "data-app-root": appRoot,
    "data-app-overscroll-behavior":
      appOverscrollBehavior === "none" ? "none" : undefined,
    "data-brand": brand,
    "data-theme": theme,
    lang: lang === "" ? undefined : lang,
    dir,
  });

  return `<div ${rootAttrs}>${children}</div>`;
}

/** Declarative root contract mirror for tooling, docs, and adapters. */
export const CLBR_ROOT_SPEC = {
  name: "root",
  output: {
    element: "div",
  },
  props: {
    appOverscrollBehavior: {
      required: false,
      type: "enum",
      values: ["none"],
    },
    appRoot: {
      default: false,
      required: false,
      type: "boolean",
    },
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
        behavior: "emit",
        target: "data-app-overscroll-behavior",
        value: "none",
        when: "appOverscrollBehavior is provided",
      },
      {
        behavior: "emit",
        target: "data-app-root",
        when: "appRoot is true",
      },
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
        when: "lang is a non-empty string",
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
