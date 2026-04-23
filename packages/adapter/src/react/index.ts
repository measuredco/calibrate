import type { ClbrComponentSpec } from "@measured/calibrate-core";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { emitWrapperSource } from "./emit.ts";

// Core's main entry defines custom element classes at module load (e.g.
// `class extends HTMLElement {}`), which throws in Node. Stub the base class
// so class bodies evaluate cleanly — we never call `defineClbr*()`, so no
// actual custom-element registration happens. TODO: replace with a
// `@measured/calibrate-core/specs` Node-safe subpath export.
(globalThis as unknown as { HTMLElement: unknown }).HTMLElement ??= class {};
(globalThis as unknown as { customElements: unknown }).customElements ??= {
  define: () => {},
  get: () => undefined,
};

const {
  CLBR_BUTTON_SPEC,
  CLBR_DIVIDER_SPEC,
  CLBR_HEADING_SPEC,
  CLBR_LINK_SPEC,
  CLBR_LOGO_SPEC,
} = await import("@measured/calibrate-core");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REACT_COMPONENTS_DIR = resolve(
  __dirname,
  "../../../react/src/components",
);

const TARGETS: ReadonlyArray<ClbrComponentSpec> = [
  CLBR_BUTTON_SPEC,
  CLBR_DIVIDER_SPEC,
  CLBR_HEADING_SPEC,
  CLBR_LINK_SPEC,
  CLBR_LOGO_SPEC,
];

async function emit(spec: ClbrComponentSpec): Promise<void> {
  const raw = emitWrapperSource(spec);
  const formatted = await prettier.format(raw, { parser: "typescript" });
  const outDir = resolve(REACT_COMPONENTS_DIR, spec.name);
  const outPath = resolve(outDir, `${spec.name}.tsx`);
  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, formatted);
  console.log(`  wrote ${outPath}`);
}

async function main(): Promise<void> {
  console.log(`generating ${TARGETS.length} React wrapper(s)`);
  for (const spec of TARGETS) {
    await emit(spec);
  }
  console.log("done");
}

await main();
