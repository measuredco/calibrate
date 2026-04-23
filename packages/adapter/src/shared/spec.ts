import type { ClbrComponentSpec } from "@measured/calibrate-core";

/**
 * Archetype of an emitted wrapper. Drives which React template the emitter
 * picks.
 *
 * Content handling follows SPEC semantics:
 * - `kind: "text"` → scalar string in React (SPEC says the value is
 *   escaped before render), so it needs no slot substitution and folds
 *   into `pass-through`.
 * - `kind: "html"` → trusted HTML string in core, opened up to ReactNode
 *   in React via sentinel substitution (`slotted-html` / `slotted-multi`).
 */
export type Archetype =
  | "pass-through"
  | "slotted-html"
  | "slotted-multi"
  | "structured-items"
  | "custom-element-with-events";

/**
 * Classify a SPEC into an archetype so the emitter can pick the right
 * template. As more components are added, new archetypes will surface and
 * need additional cases.
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
      return "pass-through";
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

/** SCREAMING_SNAKE_CASE a kebab/lower name for slot sentinel constants. */
export function screamingSnake(name: string): string {
  return name.replace(/[-\s]+/g, "_").toUpperCase();
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
