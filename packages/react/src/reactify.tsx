import { type ClbrNode, serializeClbrNode } from "@measured/calibrate-core";
import {
  createElement,
  type DOMAttributes,
  Fragment,
  type ReactNode,
  type Ref,
} from "react";

/**
 * Native attrs a Calibrate React wrapper forwards to the root element.
 *
 * Restricted to the React `DOMAttributes` surface (event handlers, minus
 * `children` and `dangerouslySetInnerHTML`) plus `ref` and `autoFocus`.
 * Calibrate owns structural attrs (class, data-*, aria-*, id, href,
 * disabled, …) via its SPEC, so the adapter exposes only the interaction
 * surface consumers can't reach through component props.
 *
 * Fully general across element types — any `Element` subtype works without
 * adapter changes. Event handlers are element-specialized via the generic
 * (e.g. `onClick` on `HTMLAnchorElement` is typed as
 * `MouseEventHandler<HTMLAnchorElement>`).
 */
export type NativeAttrsFor<E extends Element> = Omit<
  DOMAttributes<E>,
  "children" | "dangerouslySetInnerHTML"
> & {
  ref?: Ref<E>;
  autoFocus?: boolean;
};

/**
 * Converts a Calibrate IR attr record into React props.
 *
 * - `class` -> `className`
 * - `for` -> `htmlFor`
 * - `false` / `undefined` attrs are dropped
 * - `true` becomes the valueless boolean form React expects
 * - string-valued boolean attrs (e.g. `download`) pass through as strings
 */
function toReactProps(
  attrs: Record<string, string | boolean | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    const reactKey =
      key === "class" ? "className" : key === "for" ? "htmlFor" : key;
    out[reactKey] = value;
  }
  return out;
}

function buildElementProps(
  node: Extract<ClbrNode, { kind: "element" }>,
  extras: Record<string, unknown>,
): { props: Record<string, unknown>; children: ReactNode[] | null } {
  const props: Record<string, unknown> = {
    ...toReactProps(node.attrs),
    ...extras,
  };
  const hasRaw = node.children.some((child) => child.kind === "raw");
  if (hasRaw) {
    // React forbids mixing `dangerouslySetInnerHTML` with `children`, so when
    // any child is raw we serialize every sibling into a single HTML string.
    props.dangerouslySetInnerHTML = {
      __html: node.children.map(serializeClbrNode).join(""),
    };
    return { props, children: null };
  }
  const children = node.children.map((child, index) =>
    renderNode(child, index),
  );
  return { props, children };
}

function renderNode(node: ClbrNode, key?: number): ReactNode {
  if (node.kind === "text") return node.value;
  if (node.kind === "raw") {
    // Raw nodes should be handled by the parent element. If a raw node
    // appears at the top level, wrap it in a fragment-like span.
    return createElement("span", {
      key,
      dangerouslySetInnerHTML: { __html: node.html },
    });
  }
  const { props, children } = buildElementProps(node, {});
  if (key !== undefined) props.key = key;
  return children === null
    ? createElement(node.tag, props)
    : createElement(node.tag, props, ...children);
}

/**
 * Renders a Calibrate IR tree as React elements, merging `rootExtras`
 * (event handlers, `ref`, `autoFocus`) into the root element's props.
 *
 * Non-element roots are wrapped in a fragment; `rootExtras` is ignored
 * in that case since there's no host element to attach handlers to.
 */
export function reactify(
  node: ClbrNode,
  rootExtras: Record<string, unknown> = {},
): ReactNode {
  if (node.kind !== "element") {
    return createElement(Fragment, null, renderNode(node));
  }
  const { props, children } = buildElementProps(node, rootExtras);
  return children === null
    ? createElement(node.tag, props)
    : createElement(node.tag, props, ...children);
}

/**
 * Picks the subset of caller props the adapter forwards to the root
 * element: `ref`, `autoFocus`, and any `on*` event handler.
 */
export function pickNativeExtras(
  source: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    if (key === "ref" || key === "autoFocus" || key.startsWith("on")) {
      out[key] = value;
    }
  }
  return out;
}
