import type { ClbrComponentSpec } from "@measured/calibrate-core";
import { classify, hostInterface, pascalCase } from "../shared/spec.ts";

/**
 * Emit React wrapper source for `spec`. Returns unformatted source; caller
 * is responsible for running it through prettier before writing.
 */
export function emitWrapperSource(spec: ClbrComponentSpec): string {
  const archetype = classify(spec);
  if (archetype !== "pass-through") {
    throw new Error(
      `emitWrapperSource: archetype "${archetype}" not yet supported for "${spec.name}"`,
    );
  }
  return emitPassThrough(spec);
}

function emitPassThrough(spec: ClbrComponentSpec): string {
  const pascal = pascalCase(spec.name);
  const corePropsType = `Clbr${pascal}Props`;
  const buildFn = `buildClbr${pascal}`;
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
