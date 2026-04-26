import { type ClbrNode, serializeClbrNode } from "@measured/calibrate-core";
import {
  createElement,
  type DOMAttributes,
  Fragment,
  type ReactNode,
  type Ref,
} from "react";

/**
 * HTML-canonical attribute names React renames. `aria-*` / `data-*` are
 * pass-through. Small, hand-maintained; add entries when SSR-parity tests
 * or React dev warnings surface a miss.
 */
const ATTR_NAME_MAP: Readonly<Record<string, string>> = {
  autocomplete: "autoComplete",
  class: "className",
  for: "htmlFor",
  readonly: "readOnly",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-width": "strokeWidth",
  tabindex: "tabIndex",
};

/**
 * Native attrs a Calibrate React wrapper forwards to the root element:
 * React's `DOMAttributes` surface (event handlers, minus `children` and
 * `dangerouslySetInnerHTML`) plus `ref` and `autoFocus`. Everything else
 * (class, data-*, aria-*, id, href, disabled, …) is owned by core's SPEC.
 * The generic element-specialises event handler types.
 */
export type NativeAttrsFor<E extends Element> = Omit<
  DOMAttributes<E>,
  "children" | "dangerouslySetInnerHTML"
> & {
  ref?: Ref<E>;
  autoFocus?: boolean;
};

/**
 * Convert a Calibrate IR attr record into React props. Renames via
 * `ATTR_NAME_MAP`; drops `false` / `undefined`; maps `true` on `data-*`
 * to `""` (matches core SSR's valueless output — React otherwise
 * stringifies to `"true"`). Native bool attrs and `aria-*` booleans pass
 * through for React's spec-correct rendering.
 */
function toReactProps(
  attrs: Record<string, string | boolean | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    const reactKey = ATTR_NAME_MAP[key] ?? key;
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
  // React's `<textarea>` takes its initial content via `defaultValue` /
  // `value`, not children. Core emits the content as a single text child,
  // so lift that into the prop instead of passing children.
  if (node.tag === "textarea" && node.children.length > 0) {
    const content = node.children
      .map((child) => (child.kind === "text" ? child.value : ""))
      .join("");
    if (content.length > 0) props.defaultValue = content;
    return { props, children: null };
  }
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
  if (node.kind === "text") {
    if (node.value in slots) {
      return createElement(Fragment, { key }, slots[node.value]);
    }
    return node.value;
  }
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
 * Render a Calibrate IR tree as React elements. `rootExtras` merges into
 * the root element's props (event handlers, `ref`, `autoFocus`). `slots`
 * substitutes named sentinel children with ReactNodes (for wrappers like
 * `Page`). Non-element roots wrap in a fragment; `rootExtras` is ignored
 * there (no host to attach handlers to).
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
