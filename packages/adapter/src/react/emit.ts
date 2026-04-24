import type { ClbrComponentSpec } from "@measured/calibrate-core";
import { classify, pascalCase, screamingSnake } from "../shared/spec.ts";

// -----------------------------------------------------------------------------
// Emit pipeline.
//
// Every wrapper is composed from a small number of orthogonal concerns:
//   - content archetype (pass-through or slotted)
//   - custom-element registration (defineClbr* useEffect)
//   - custom-event wiring (onEvent props, addEventListener useEffects, ref
//     merge)
//
// Each concern contributes to an `EmitParts` record; a single renderer joins
// them into a prettier-ready TSX source string.
// -----------------------------------------------------------------------------

interface EmitParts {
  coreValueImports: Set<string>;
  coreTypeImports: Set<string>;
  reactValueImports: Set<string>;
  reactTypeImports: Set<string>;
  constants: string[];
  helpers: string[];
  exportedTypes: string[];
  /** Extra lines added inside the `Props` type body. */
  propsTypeLines: string[];
  /** Lines added inside the function body, in order. */
  functionBody: string[];
  /** Full signature, e.g. `export function Banner(props: BannerProps): ... {`. */
  functionSignature: string;
  /** Final return expression for the function. */
  returnExpr: string;
}

function newParts(): EmitParts {
  return {
    coreValueImports: new Set(),
    coreTypeImports: new Set(),
    reactValueImports: new Set(),
    reactTypeImports: new Set(),
    constants: [],
    helpers: [],
    exportedTypes: [],
    propsTypeLines: [],
    functionBody: [],
    functionSignature: "",
    returnExpr: "",
  };
}

function renderParts(parts: EmitParts): string {
  const reactifyImports = ["pickNativeExtras", "reactify"];
  const reactifyTypes = ["NativeAttrsFor"];

  const imports: string[] = [];

  imports.push(
    renderImport(
      "@measured/calibrate-core",
      [...parts.coreValueImports],
      [...parts.coreTypeImports],
    ),
  );

  const reactValues = [...parts.reactValueImports];
  const reactTypes = [...parts.reactTypeImports];
  if (reactValues.length > 0 || reactTypes.length > 0) {
    imports.push(renderImport("react", reactValues, reactTypes));
  }

  imports.push(renderImport("../../reactify", reactifyImports, reactifyTypes));

  const sections: string[] = [imports.join("\n")];
  if (parts.constants.length > 0) sections.push(parts.constants.join("\n"));
  if (parts.helpers.length > 0) sections.push(parts.helpers.join("\n\n"));
  if (parts.exportedTypes.length > 0) {
    sections.push(parts.exportedTypes.join("\n\n"));
  }

  sections.push(
    `${parts.functionSignature} {\n${parts.functionBody.join("\n")}\n  return ${parts.returnExpr};\n}`,
  );

  return sections.join("\n\n") + "\n";
}

/**
 * Render a single import statement. If the import has only types and no
 * values, use the `import type { ... }` form so prettier + eslint stay
 * happy. Otherwise interleave values and types alphabetically with inline
 * `type` prefixes so the emitted order matches hand-authored convention.
 */
function renderImport(
  source: string,
  values: ReadonlyArray<string>,
  types: ReadonlyArray<string>,
): string {
  if (values.length === 0) {
    const sorted = [...types].sort();
    return `import type {\n${sorted.map((t) => `  ${t},`).join("\n")}\n} from "${source}";`;
  }
  const items = [
    ...values.map((v) => ({ key: v, text: v })),
    ...types.map((t) => ({ key: t, text: `type ${t}` })),
  ].sort((a, b) => a.key.localeCompare(b.key));
  return `import {\n${items.map((i) => `  ${i.text},`).join("\n")}\n} from "${source}";`;
}

// -----------------------------------------------------------------------------
// Top-level entry.
// -----------------------------------------------------------------------------

export function emitWrapperSource(spec: ClbrComponentSpec): string {
  const parts = newParts();
  contributeContent(parts, spec);
  if (isCustomElement(spec)) contributeCustomElement(parts, spec);
  if (hasEvents(spec)) contributeEvents(parts, spec);
  return renderParts(parts);
}

/**
 * Emit the barrel `packages/react/src/index.ts` that re-exports every
 * generated wrapper plus its derived types.
 */
export function emitIndexSource(
  specs: ReadonlyArray<ClbrComponentSpec>,
): string {
  const sorted = [...specs].sort((a, b) => a.name.localeCompare(b.name));
  const blocks: string[] = [
    `export { defineClbrComponents as defineClbrAll } from "@measured/calibrate-core";`,
  ];
  for (const spec of sorted) {
    const pascal = pascalCase(spec.name);
    const names: string[] = [pascal];
    const events = Object.entries(spec.events);
    for (const [eventName, eventSpec] of events) {
      const action = stripClbrPrefix(eventName, spec.name);
      const baseName = `${pascal}${pascalCase(action)}`;
      if (eventSpec.detail) {
        names.push(`type ${baseName}Detail`);
        names.push(`type ${baseName}Event`);
      }
      names.push(`type ${baseName}Handler`);
    }
    names.push(`type ${pascal}Props`);
    names.sort((a, b) =>
      a.replace(/^type /, "").localeCompare(b.replace(/^type /, "")),
    );
    blocks.push(
      `export {\n${names.map((n) => `  ${n},`).join("\n")}\n} from "./components/${spec.name}/${spec.name}";`,
    );
  }
  return blocks.join("\n\n") + "\n";
}

function isCustomElement(spec: ClbrComponentSpec): boolean {
  const element = spec.output.element;
  if (typeof element !== "string") return false;
  return element.startsWith("clbr-");
}

function hasEvents(spec: ClbrComponentSpec): boolean {
  return Object.keys(spec.events).length > 0;
}

/**
 * HTML tag → DOM interface used in emitted `NativeAttrsFor<T>` type
 * expressions. Covers every tag currently referenced in core's
 * `output.element` strings; unmapped tags fall back to `HTMLElement`.
 */
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
 * DOM interface to use for this SPEC's host. Polymorphic (`switch`) hosts
 * take `HTMLElement` as the lowest common ancestor.
 */
function hostInterface(spec: ClbrComponentSpec): string {
  const element = spec.output.element;
  if (typeof element !== "string") return "HTMLElement";
  if (element.startsWith("clbr-")) return "HTMLElement";
  return ELEMENT_INTERFACE[element] ?? "HTMLElement";
}

// -----------------------------------------------------------------------------
// Content contributors.
//
// Either pass-through (scalar props only, no slot substitution) or slotted
// (one or more html slots substituted via sentinels; text slots stay scalar).
// -----------------------------------------------------------------------------

function contributeContent(parts: EmitParts, spec: ClbrComponentSpec): void {
  const archetype = classify(spec);
  switch (archetype) {
    case "pass-through":
      contributePassThrough(parts, spec);
      return;
    case "slotted":
      contributeSlotted(parts, spec);
      return;
    default: {
      const exhaustive: never = archetype;
      throw new Error(
        `contributeContent: unhandled archetype for "${spec.name}": ${JSON.stringify(exhaustive)}`,
      );
    }
  }
}

function contributePassThrough(
  parts: EmitParts,
  spec: ClbrComponentSpec,
): void {
  const pascal = pascalCase(spec.name);
  const buildFn = `buildClbr${pascal}`;
  const corePropsType = `Clbr${pascal}Props`;
  const element = hostInterface(spec);

  parts.coreValueImports.add(buildFn);
  parts.coreTypeImports.add(corePropsType);
  parts.exportedTypes.push(
    `export type ${pascal}Props = ${corePropsType} & NativeAttrsFor<${element}>;`,
  );
  parts.functionSignature = `export function ${pascal}(props: ${pascal}Props): ReturnType<typeof reactify>`;
  parts.returnExpr = `reactify(\n    ${buildFn}(props),\n    pickNativeExtras(props as unknown as Record<string, unknown>),\n  )`;
}

interface SlotInfo {
  prop: string;
  kind: "text" | "html";
  required: boolean;
}

function slotsFromContent(spec: ClbrComponentSpec): ReadonlyArray<SlotInfo> {
  if (spec.content.kind === "html") {
    return [
      {
        prop: spec.content.prop,
        kind: "html",
        required: spec.props[spec.content.prop]?.required === true,
      },
    ];
  }
  if (spec.content.kind === "slots") {
    return spec.content.slots.map((s) => ({
      prop: s.prop,
      kind: s.kind,
      required: spec.props[s.prop]?.required === true,
    }));
  }
  throw new Error(
    `slotsFromContent: content kind "${spec.content.kind}" is not slotted for "${spec.name}"`,
  );
}

function contributeSlotted(parts: EmitParts, spec: ClbrComponentSpec): void {
  const slots = slotsFromContent(spec);
  const htmlSlots = slots.filter((s) => s.kind === "html");

  // All-text slots have no ReactNode substitution work — the slot values
  // are scalar strings that flow straight through to buildClbr*. Route to
  // the pass-through emitter instead of generating an `Omit<X,>` with no
  // omission keys (which TS rejects).
  if (htmlSlots.length === 0) {
    contributePassThrough(parts, spec);
    return;
  }

  const pascal = pascalCase(spec.name);
  const buildFn = `buildClbr${pascal}`;
  const corePropsType = `Clbr${pascal}Props`;
  const element = hostInterface(spec);

  parts.coreValueImports.add(buildFn);
  parts.coreTypeImports.add(corePropsType);

  parts.reactTypeImports.add("ReactNode");

  const sentinelName = (slot: SlotInfo) =>
    `SLOT_${screamingSnake(spec.name)}_${screamingSnake(slot.prop)}`;

  for (const s of htmlSlots) {
    parts.constants.push(
      `const ${sentinelName(s)} = "__CLBR_SLOT_${screamingSnake(spec.name)}_${screamingSnake(s.prop)}__";`,
    );
  }

  const reactNodeExtras = htmlSlots
    .map((s) => `  ${s.prop}${s.required ? "" : "?"}: ReactNode;`)
    .join("\n");
  const htmlOmitUnion = htmlSlots.map((s) => `"${s.prop}"`).join(" | ");

  parts.exportedTypes.push(
    `export type ${pascal}Props = Omit<${corePropsType}, ${htmlOmitUnion}> & {\n${reactNodeExtras}\n} & NativeAttrsFor<${element}>;`,
  );
  parts.functionSignature = `export function ${pascal}(props: ${pascal}Props): ReturnType<typeof reactify>`;

  const specPropNames = Object.keys(spec.props);
  const destructureList = [...specPropNames, "...rest"].join(", ");

  parts.functionBody.push(`  const { ${destructureList} } = props;`);
  for (const s of htmlSlots.filter((x) => !x.required)) {
    parts.functionBody.push(
      `  const has${pascalCase(s.prop)} = ${s.prop} != null && ${s.prop} !== false;`,
    );
  }

  const buildArgs = specPropNames
    .map((p) => {
      const slot = slots.find((s) => s.prop === p);
      if (!slot || slot.kind === "text") return `    ${p},`;
      if (slot.required) return `    ${p}: ${sentinelName(slot)},`;
      return `    ${p}: has${pascalCase(p)} ? ${sentinelName(slot)} : undefined,`;
    })
    .join("\n");
  parts.functionBody.push(`  const node = ${buildFn}({`);
  parts.functionBody.push(buildArgs);
  parts.functionBody.push(`  });`);

  const slotsMapEntries = htmlSlots
    .map((s) =>
      s.required
        ? `    [${sentinelName(s)}]: ${s.prop},`
        : `    ...(has${pascalCase(s.prop)} ? { [${sentinelName(s)}]: ${s.prop} } : {}),`,
    )
    .join("\n");

  parts.returnExpr = `reactify(\n    node,\n    pickNativeExtras(rest as unknown as Record<string, unknown>),\n    {\n${slotsMapEntries}\n    },\n  )`;
}

// -----------------------------------------------------------------------------
// Custom-element contributor.
//
// `clbr-*` hosts call `defineClbr<Pascal>()` from a mount-time useEffect.
// -----------------------------------------------------------------------------

function contributeCustomElement(
  parts: EmitParts,
  spec: ClbrComponentSpec,
): void {
  const pascal = pascalCase(spec.name);
  const defineFn = `defineClbr${pascal}`;

  parts.coreValueImports.add(defineFn);
  parts.reactValueImports.add("useEffect");

  parts.functionBody.push(`  useEffect(() => {\n    ${defineFn}();\n  }, []);`);
}

// -----------------------------------------------------------------------------
// Event contributor.
//
// Each spec.events entry becomes a typed `<Pascal><Action>Handler`, an
// optional `on<Action>` prop, and a useEffect that
// addEventListener/removeEventListener via core's event-name constant.
// A callback ref merges the internal host ref with any caller-provided
// ref so both coexist.
// -----------------------------------------------------------------------------

function contributeEvents(parts: EmitParts, spec: ClbrComponentSpec): void {
  const pascal = pascalCase(spec.name);
  const events = Object.entries(spec.events);

  parts.reactValueImports.add("useEffect");
  parts.reactValueImports.add("useRef");
  parts.reactValueImports.add("useCallback");
  parts.reactTypeImports.add("Ref");
  parts.reactTypeImports.add("RefCallback");

  parts.helpers.push(
    [
      `function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {`,
      `  if (typeof ref === "function") ref(value);`,
      `  else if (ref) (ref as { current: T | null }).current = value;`,
      `}`,
    ].join("\n"),
  );

  const eventInfos = events.map(([eventName, eventSpec]) => {
    const action = stripClbrPrefix(eventName, spec.name);
    const actionPascal = pascalCase(action);
    const handlerProp = `on${actionPascal}`;
    const baseName = `${pascal}${actionPascal}`;
    const handlerTypeName = `${baseName}Handler`;
    const detailTypeName = `${baseName}Detail`;
    const eventTypeName = `${baseName}Event`;
    const eventConstant = `CLBR_${screamingSnake(spec.name)}_EVENT_${screamingSnake(action)}`;
    return {
      eventName,
      action,
      actionPascal,
      handlerProp,
      handlerTypeName,
      detailTypeName,
      eventTypeName,
      eventConstant,
      detail: eventSpec.detail,
    };
  });

  // The content contributor pushed the Props type as the only entry.
  // Take it out, register handler types before it, then re-push the
  // modified Props type with handler fields injected.
  const propsType = parts.exportedTypes.shift();
  if (!propsType) throw new Error("contributeEvents: no Props type emitted");

  for (const info of eventInfos) {
    parts.coreValueImports.add(info.eventConstant);
    if (info.detail) {
      parts.exportedTypes.push(
        `export type ${info.detailTypeName} = ${info.detail};`,
      );
      parts.exportedTypes.push(
        `export type ${info.eventTypeName} = CustomEvent<${info.detailTypeName}>;`,
      );
      parts.exportedTypes.push(
        `export type ${info.handlerTypeName} = (event: ${info.eventTypeName}) => void;`,
      );
    } else {
      parts.exportedTypes.push(
        `export type ${info.handlerTypeName} = (event: Event) => void;`,
      );
    }
    parts.propsTypeLines.push(
      `  ${info.handlerProp}?: ${info.handlerTypeName};`,
    );
  }

  // Inject handler fields into the Props type via regex rewrite of what
  // the content contributor already pushed. This is fragile — the pattern
  // assumes the Props type ends in ` & NativeAttrsFor<X>;` (optionally
  // preceded by a `}` from a slot-overlay block). If the content
  // contributor ever emits a different Props shape this regex will
  // silently fall through to the no-op branch and the injected
  // `handlerBlock` will be lost. Consider refactoring to a structured
  // "Props-type parts" accumulator if the shapes diverge further.
  const handlerBlock = `{\n${parts.propsTypeLines.join("\n")}\n}`;
  const injected = propsType.replace(
    /\n\} & NativeAttrsFor<([^>]+)>;$/,
    (_, iface) => `\n} & NativeAttrsFor<${iface}> & ${handlerBlock};`,
  );
  const finalType =
    injected === propsType
      ? propsType.replace(
          / & NativeAttrsFor<([^>]+)>;$/,
          (_, iface) => ` & NativeAttrsFor<${iface}> & ${handlerBlock};`,
        )
      : injected;
  parts.exportedTypes.push(finalType);

  // Destructure event handlers + caller ref from props. Content contributors
  // have either already destructured props themselves (slotted) or rely on
  // `props` directly (pass-through). Detect by presence of a leading `const
  // { ... } = props;` line and extend it; otherwise insert one.
  const handlerDestructures = eventInfos.map((i) => i.handlerProp);
  const firstLine = parts.functionBody[0] ?? "";
  let destructuredRest = false;
  if (firstLine.startsWith("  const {") && firstLine.endsWith("= props;")) {
    parts.functionBody[0] = firstLine.replace(
      /const \{ /,
      `const { ${handlerDestructures.join(", ")}, ref: callerRef, `,
    );
  } else {
    parts.functionBody.unshift(
      `  const { ${handlerDestructures.join(", ")}, ref: callerRef, ...rest } = props;`,
    );
    destructuredRest = true;
  }

  parts.functionBody.push(`  const elRef = useRef<HTMLElement | null>(null);`);

  for (const info of eventInfos) {
    parts.functionBody.push(
      [
        `  useEffect(() => {`,
        `    const el = elRef.current;`,
        `    if (!el || !${info.handlerProp}) return;`,
        `    el.addEventListener(${info.eventConstant}, ${info.handlerProp} as EventListener);`,
        `    return () =>`,
        `      el.removeEventListener(${info.eventConstant}, ${info.handlerProp} as EventListener);`,
        `  }, [${info.handlerProp}]);`,
      ].join("\n"),
    );
  }

  parts.functionBody.push(
    [
      `  const mergedRef = useCallback<RefCallback<HTMLElement>>(`,
      `    (node) => {`,
      `      elRef.current = node;`,
      `      assignRef(callerRef, node);`,
      `    },`,
      `    [callerRef],`,
      `  );`,
    ].join("\n"),
  );

  // Rewrite the return to thread `mergedRef` through pickNativeExtras. The
  // content contributors produced either a pass-through return (uses
  // `props`) or a slotted return (uses `rest`). If events forced a rest
  // destructure into the body, redirect pickNativeExtras to the new `rest`
  // so event handlers don't leak onto the host via `on*` pass-through.
  const existing = parts.returnExpr;
  const source = destructuredRest ? "rest" : "$1";
  const threaded = existing.replace(
    /pickNativeExtras\((props|rest) as unknown as Record<string, unknown>\)/,
    `{\n    ...pickNativeExtras(${source} as unknown as Record<string, unknown>),\n    ref: mergedRef,\n  }`,
  );
  parts.returnExpr = threaded;
}

function stripClbrPrefix(eventName: string, componentName: string): string {
  const prefix = `clbr-${componentName}-`;
  if (!eventName.startsWith(prefix)) {
    throw new Error(
      `stripClbrPrefix: "${eventName}" doesn't start with "${prefix}"`,
    );
  }
  return eventName.slice(prefix.length);
}
