import type { ClbrComponentSpec } from "@measured/calibrate-core";

export type Archetype =
  | "pass-through"
  | "slotted-text"
  | "slotted-html"
  | "slotted-multi"
  | "structured-items"
  | "custom-element-with-events";

/**
 * Classify a SPEC into an archetype so the emitter can pick the right
 * template. Intentionally conservative at v0 — as more components are added,
 * new archetypes or sub-archetypes will surface and need additional cases.
 */
export function classify(spec: ClbrComponentSpec): Archetype {
  const hasEvents = Object.keys(spec.events).length > 0;
  const content = spec.content;

  if (content.kind === "structured") return "structured-items";
  if (hasEvents) return "custom-element-with-events";

  switch (content.kind) {
    case "none":
      return "pass-through";
    case "text":
      return "slotted-text";
    case "html":
      return "slotted-html";
    case "slots":
      return "slotted-multi";
    default: {
      const exhaustive: never = content;
      throw new Error(
        `classify: unhandled content kind for "${spec.name}": ${JSON.stringify(exhaustive)}`,
      );
    }
  }
}

/** PascalCase a kebab/lower component name for type + function identifiers. */
export function pascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");
}

/** Map a literal host element name to its DOM interface. */
const ELEMENT_INTERFACE: Record<string, string> = {
  a: "HTMLAnchorElement",
  article: "HTMLElement",
  aside: "HTMLElement",
  button: "HTMLButtonElement",
  div: "HTMLDivElement",
  figure: "HTMLElement",
  footer: "HTMLElement",
  header: "HTMLElement",
  hr: "HTMLHRElement",
  input: "HTMLInputElement",
  label: "HTMLLabelElement",
  li: "HTMLLIElement",
  main: "HTMLElement",
  nav: "HTMLElement",
  ol: "HTMLOListElement",
  p: "HTMLParagraphElement",
  section: "HTMLElement",
  span: "HTMLSpanElement",
  textarea: "HTMLTextAreaElement",
  ul: "HTMLUListElement",
};

/**
 * Resolve the DOM interface to use for `NativeAttrsFor<T>`. For polymorphic
 * hosts (switch on prop) we take the lowest common ancestor, which is
 * `HTMLElement` in every current case.
 */
export function hostInterface(spec: ClbrComponentSpec): string {
  const element = spec.output.element;
  if (typeof element === "string") {
    if (element.startsWith("clbr-")) return "HTMLElement";
    return ELEMENT_INTERFACE[element] ?? "HTMLElement";
  }
  return "HTMLElement";
}
