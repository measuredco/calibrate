import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../helpers/spec";

export type ClbrBrand = "msrd" | "wrfr";
export type ClbrDirection = "ltr" | "rtl";
export type ClbrAppOverscrollBehavior = "none";
export type ClbrTheme = "light" | "dark";

export interface ClbrRootProps {
  /** Marks this root as the owning app root; emits `data-app-root` when true. @default false */
  appRoot?: boolean;
  /** Opts into `overscroll-behavior: none` integration hooks; emits `data-app-overscroll-behavior="none"`. */
  appOverscrollBehavior?: ClbrAppOverscrollBehavior;
  /** Brand variant applied to the root wrapper. @default "msrd" */
  brand?: ClbrBrand;
  /** Inner HTML content. Caller sanitizes untrusted content. */
  children: string;
  /** Optional explicit text direction. */
  dir?: ClbrDirection;
  /** Optional BCP47 language tag (e.g. `en-GB`). */
  lang?: string;
  /** Optional explicit theme variant. */
  theme?: ClbrTheme;
}

/**
 * Builds the IR tree for the Calibrate root component.
 *
 * @param props - Root component props.
 * @returns IR node for the Calibrate root component.
 */
export function buildClbrRoot({
  appOverscrollBehavior,
  appRoot,
  brand = "msrd",
  children,
  dir,
  lang,
  theme,
}: ClbrRootProps): ClbrNode {
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "clbr",
      "data-app-root": appRoot,
      "data-app-overscroll-behavior":
        appOverscrollBehavior === "none" ? "none" : undefined,
      "data-clbr-brand": brand,
      "data-clbr-theme": theme,
      lang: lang === "" ? undefined : lang,
      dir,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Calibrate root component.
 *
 * Emits a `<div>` with the Calibrate root class, required `data-clbr-brand`,
 * optional `data-clbr-theme`, and optional `dir`/`lang` attributes, then injects
 * the provided HTML content inside.
 *
 * @param props - Root component props.
 * @returns HTML string for the Calibrate root component.
 */
export function renderClbrRoot(props: ClbrRootProps): string {
  return serializeClbrNode(buildClbrRoot(props));
}

/** Declarative root contract mirror for tooling, docs, and adapters. */
export const CLBR_ROOT_SPEC: ClbrComponentSpec = {
  name: "root",
  description: "Mandatory top-level `root` wrapper for the Calibrate system.",
  output: { element: "div", class: "clbr" },
  content: { kind: "html", prop: "children" },
  props: {
    appOverscrollBehavior: {
      description: "Disables overscroll bounce for app-shell integrations.",
      type: { kind: "enum", values: ["none"] },
    },
    appRoot: {
      default: false,
      description: "Marks this wrapper as the app root.",
      type: { kind: "boolean" },
    },
    brand: {
      default: "msrd",
      description: "Brand identity applied to the wrapper.",
      type: { kind: "enum", values: ["msrd", "wrfr"] },
    },
    children: {
      description: "Content rendered inside the root.",
      required: true,
      type: { kind: "html" },
    },
    dir: {
      description: "Text direction.",
      type: { kind: "enum", values: ["ltr", "rtl"] },
    },
    lang: {
      description: "BCP47 language tag (e.g. `en-GB`).",
      type: { kind: "string" },
    },
    theme: {
      description: "Colour theme.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-app-overscroll-behavior",
        condition: {
          kind: "when-equals",
          prop: "appOverscrollBehavior",
          to: "none",
        },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "host" },
        attribute: "data-app-root",
        condition: { kind: "when-truthy", prop: "appRoot" },
      },
      {
        target: { on: "host" },
        attribute: "data-clbr-brand",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "brand" },
      },
      {
        target: { on: "host" },
        attribute: "data-clbr-theme",
        condition: { kind: "when-provided", prop: "theme" },
        value: { kind: "prop", prop: "theme" },
      },
      {
        target: { on: "host" },
        attribute: "dir",
        condition: { kind: "when-provided", prop: "dir" },
        value: { kind: "prop", prop: "dir" },
      },
      {
        target: { on: "host" },
        attribute: "lang",
        condition: { kind: "when-non-empty", prop: "lang" },
        value: { kind: "prop", prop: "lang" },
      },
    ],
  },
};
