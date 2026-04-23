import type { ClbrComponentSpec } from "@measured/calibrate-core";
import {
  classify,
  hostInterface,
  pascalCase,
  screamingSnake,
} from "../shared/spec.ts";
import { REACT_OVERRIDES } from "./overrides.ts";

/**
 * Emit React wrapper source for `spec`. Returns unformatted source; caller
 * is responsible for running it through prettier before writing.
 */
export function emitWrapperSource(spec: ClbrComponentSpec): string {
  const archetype = classify(spec);
  switch (archetype) {
    case "pass-through":
      return emitPassThrough(spec);
    case "slotted-multi":
      return emitSlottedMulti(spec);
    default:
      throw new Error(
        `emitWrapperSource: archetype "${archetype}" not yet supported for "${spec.name}"`,
      );
  }
}

// -----------------------------------------------------------------------------
// Pass-through archetype.
//
// Covers:
// - `content.kind: "none"` (no content at all, e.g. Divider).
// - `content.kind: "text"` (scalar escaped string; per SPEC intent React
//   passes the string straight through — no slot substitution, no ReactNode
//   opening).
//
// Button's discriminated prop-union override branches to a different emit
// shape inside this archetype but remains pass-through at runtime.
// -----------------------------------------------------------------------------

function emitPassThrough(spec: ClbrComponentSpec): string {
  const pascal = pascalCase(spec.name);
  const buildFn = `buildClbr${pascal}`;
  const override = REACT_OVERRIDES[spec.name];

  if (override?.discriminatedProps) {
    return emitPassThroughDiscriminated(
      pascal,
      buildFn,
      override.discriminatedProps.cases,
    );
  }

  return emitPassThroughSimple(spec, pascal, buildFn);
}

function emitPassThroughSimple(
  spec: ClbrComponentSpec,
  pascal: string,
  buildFn: string,
): string {
  const corePropsType = `Clbr${pascal}Props`;
  const element = hostInterface(spec);

  return `import {
  ${buildFn},
  type ${corePropsType},
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ${pascal}Props = ${corePropsType} & NativeAttrsFor<${element}>;

export function ${pascal}(props: ${pascal}Props): ReturnType<typeof reactify> {
  return reactify(
    ${buildFn}(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
`;
}

function emitPassThroughDiscriminated(
  pascal: string,
  buildFn: string,
  cases: Readonly<
    Record<string, { readonly coreSuffix: string; readonly element: string }>
  >,
): string {
  const arms = Object.values(cases);
  const typeImports = arms
    .map((arm) => `  type Clbr${pascal}${arm.coreSuffix}Props,`)
    .join("\n");
  const unionArms = arms
    .map(
      (arm) =>
        `  | (Clbr${pascal}${arm.coreSuffix}Props & NativeAttrsFor<${arm.element}>)`,
    )
    .join("\n");

  return `import {
  ${buildFn},
${typeImports}
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ${pascal}Props =
${unionArms};

export function ${pascal}(props: ${pascal}Props) {
  return reactify(
    ${buildFn}(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
`;
}

// -----------------------------------------------------------------------------
// Slotted-multi archetype.
//
// SPEC `content.kind: "slots"` with per-slot kind of `"text"` or `"html"`.
// Html slots become `ReactNode` with sentinel substitution; text slots stay
// as scalar strings on the outer React type.
// -----------------------------------------------------------------------------

interface SlotInfo {
  prop: string;
  kind: "text" | "html";
  required: boolean;
}

function emitSlottedMulti(spec: ClbrComponentSpec): string {
  if (spec.content.kind !== "slots") {
    throw new Error(
      `emitSlottedMulti: expected "slots" content for "${spec.name}"`,
    );
  }

  const pascal = pascalCase(spec.name);
  const buildFn = `buildClbr${pascal}`;
  const corePropsType = `Clbr${pascal}Props`;
  const element = hostInterface(spec);

  const slots: ReadonlyArray<SlotInfo> = spec.content.slots.map((s) => ({
    prop: s.prop,
    kind: s.kind,
    required: spec.props[s.prop]?.required === true,
  }));

  const htmlSlots = slots.filter((s) => s.kind === "html");
  const htmlOmitUnion = htmlSlots.map((s) => `"${s.prop}"`).join(" | ");

  const sentinelName = (slot: SlotInfo) =>
    `SLOT_${screamingSnake(spec.name)}_${screamingSnake(slot.prop)}`;

  const sentinelDecls = htmlSlots
    .map(
      (s) =>
        `const ${sentinelName(s)} = "__CLBR_SLOT_${screamingSnake(spec.name)}_${screamingSnake(s.prop)}__";`,
    )
    .join("\n");

  const reactNodeExtras = htmlSlots
    .map((s) => `  ${s.prop}${s.required ? "" : "?"}: ReactNode;`)
    .join("\n");

  const specPropNames = Object.keys(spec.props);
  const destructureList = [...specPropNames, "...rest"].join(", ");

  const hasDecls = htmlSlots
    .filter((s) => !s.required)
    .map(
      (s) =>
        `  const has${pascalCase(s.prop)} = ${s.prop} != null && ${s.prop} !== false;`,
    )
    .join("\n");

  const buildArgs = specPropNames
    .map((p) => {
      const slot = slots.find((s) => s.prop === p);
      if (!slot || slot.kind === "text") return `    ${p},`;
      if (slot.required) return `    ${p}: ${sentinelName(slot)},`;
      return `    ${p}: has${pascalCase(p)} ? ${sentinelName(slot)} : undefined,`;
    })
    .join("\n");

  const slotsMapEntries = htmlSlots
    .map((s) =>
      s.required
        ? `    [${sentinelName(s)}]: ${s.prop},`
        : `    ...(has${pascalCase(s.prop)} ? { [${sentinelName(s)}]: ${s.prop} } : {}),`,
    )
    .join("\n");

  return `import {
  ${buildFn},
  type ${corePropsType},
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

${sentinelDecls}

export type ${pascal}Props = Omit<${corePropsType}, ${htmlOmitUnion}> & {
${reactNodeExtras}
} & NativeAttrsFor<${element}>;

export function ${pascal}(props: ${pascal}Props): ReturnType<typeof reactify> {
  const { ${destructureList} } = props;
${hasDecls}
  const node = ${buildFn}({
${buildArgs}
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
${slotsMapEntries}
    },
  );
}
`;
}
