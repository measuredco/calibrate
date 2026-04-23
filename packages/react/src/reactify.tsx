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
 * - `true` on a native boolean attr (e.g. `disabled`) stays as `true` so
 *   React emits the valueless form; `true` on a `data-*` attr becomes
 *   `""` to match core SSR's valueless output (React would otherwise
 *   stringify custom boolean props to `"true"`). `aria-*` booleans pass
 *   through so React emits the correct `"true"` / `"false"` strings the
 *   spec requires (e.g. `aria-expanded`).
 * - string-valued attrs pass through as strings
 */
function toReactProps(
  attrs: Record<string, string | boolean | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    const reactKey =
      key === "class" ? "className" : key === "for" ? "htmlFor" : key;
    out[reactKey] = value === true && key.startsWith("data-") ? "" : value;
  }
  return out;
}

function buildElementProps(
  node: Extract<ClbrNode, { kind: "element" }>,
  extras: Record<string, unknown>,
  slots: Record<string, ReactNode>,
): { props: Record<string, unknown>; children: ReactNode[] | null } {
  const props: Record<string, unknown> = {
    ...toReactProps(node.attrs),
    ...extras,
  };
  const hasUnmatchedRaw = node.children.some(
    (child) => child.kind === "raw" && !(child.html in slots),
  );
  if (hasUnmatchedRaw) {
    // React forbids mixing `dangerouslySetInnerHTML` with `children`, so when
    // any child is unmatched raw HTML we serialize every sibling into a
    // single HTML string. Wrappers must avoid placing slot sentinels
    // alongside unrelated raw HTML siblings.
    props.dangerouslySetInnerHTML = {
      __html: node.children.map(serializeClbrNode).join(""),
    };
    return { props, children: null };
  }
  const children = node.children.map((child, index) => {
    if (child.kind === "raw" && child.html in slots) {
      return createElement(Fragment, { key: index }, slots[child.html]);
    }
    return renderNode(child, index, slots);
  });
  return { props, children };
}

function renderNode(
  node: ClbrNode,
  key: number | undefined,
  slots: Record<string, ReactNode>,
): ReactNode {
  if (node.kind === "text") return node.value;
  if (node.kind === "raw") {
    if (node.html in slots) {
      return createElement(Fragment, { key }, slots[node.html]);
    }
    // Raw nodes should be handled by the parent element. If a raw node
    // appears at the top level, wrap it in a fragment-like span.
    return createElement("span", {
      key,
      dangerouslySetInnerHTML: { __html: node.html },
    });
  }
  const { props, children } = buildElementProps(node, {}, slots);
  if (key !== undefined) props.key = key;
  return children === null
    ? createElement(node.tag, props)
    : createElement(node.tag, props, ...children);
}

/**
 * Renders a Calibrate IR tree as React elements, merging `rootExtras`
 * (event handlers, `ref`, `autoFocus`) into the root element's props.
 * Slot sentinels passed via `slots` substitute raw IR children with the
 * corresponding React node, enabling named-slot wrappers (e.g. `Page`).
 *
 * Non-element roots are wrapped in a fragment; `rootExtras` is ignored
 * in that case since there's no host element to attach handlers to.
 */
export function reactify(
  node: ClbrNode,
  rootExtras: Record<string, unknown> = {},
  slots: Record<string, ReactNode> = {},
): ReactNode {
  if (node.kind !== "element") {
    return createElement(Fragment, null, renderNode(node, undefined, slots));
  }
  const { props, children } = buildElementProps(node, rootExtras, slots);
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
