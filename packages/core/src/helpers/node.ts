import { attrs, escapeHtml } from "./html";

/**
 * Intermediate representation for rendered markup.
 *
 * Core renderers produce a `ClbrNode` tree which can be either:
 * - serialized to an HTML string for SSR/Web Components, or
 * - walked by a framework adapter (e.g. React) to produce native elements.
 */
export type ClbrNode =
  | {
      kind: "element";
      tag: string;
      attrs: Record<string, string | boolean | undefined>;
      children: ClbrNode[];
    }
  | { kind: "text"; value: string }
  | { kind: "raw"; html: string };

/** Serializes a `ClbrNode` tree to an HTML string. */
export function serializeClbrNode(node: ClbrNode): string {
  if (node.kind === "text") return escapeHtml(node.value);
  if (node.kind === "raw") return node.html;
  const attrString = attrs(node.attrs);
  const open = attrString ? `<${node.tag} ${attrString}>` : `<${node.tag}>`;
  const inner = node.children.map(serializeClbrNode).join("");
  return `${open}${inner}</${node.tag}>`;
}
