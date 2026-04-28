#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { deepEqual, isObject, isTokenObject } from "./helpers/json.mjs";
import {
  buildBaseContext,
  buildMergedDoc,
  contextId,
  getResolutionModifierNames,
  matchesScope,
  readJson,
  resolveAliasValues,
  resolveContextSources,
} from "./resolve-context-tree.mjs";

/**
 * Pipeline stage that emits a consumer-facing JSON token artifact.
 *
 * Reads the resolver, fully resolves every relevant context permutation,
 * and emits a token-centric JSON artifact suitable for downstream tools
 * (docs sites, MCP, agents, framework adapters). Values stay in source
 * units (px) — language-agnostic and DTCG-faithful; rem conversion is a
 * CSS-specific concern that lives in the CSS pipeline only.
 */

const SCHEMA_VERSION = "1";

const cwd = process.cwd();

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
  }

  if (typeof args.resolver !== "string" || typeof args.out !== "string") {
    throw new Error(
      "Usage: node scripts/pipeline/prepare-json-output.mjs --resolver <resolver.json> --out <output.json>",
    );
  }

  return args;
}

/**
 * Computes the cartesian product of modifier-context tuples.
 *
 * @param {Array<Array<Record<string, string>>>} groups
 * @returns {Array<Record<string, string>>}
 */
function cartesianProduct(groups) {
  return groups.reduce(
    (acc, group) =>
      acc.flatMap((combo) => group.map((value) => ({ ...combo, ...value }))),
    [{}],
  );
}

/**
 * Enumerates the relevant context tuples to resolve for the consumer artifact.
 *
 * Base axes (no scope) cartesian-multiply normally. State axes (with scope)
 * only emit non-default values where the scope predicate matches. This mirrors
 * the same enumeration the CSS pipeline does, ensuring no missing or extra
 * context entries in the consumer JSON.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @param {Record<string, unknown>} modifierBuildDefs
 * @returns {Array<Record<string, string>>}
 */
function enumerateContexts(modifierOrder, modifiers, modifierBuildDefs) {
  const baseAxes = [];
  const stateAxes = [];

  for (const name of modifierOrder) {
    const modifierDef = modifierBuildDefs?.[name] ?? {};

    if (isObject(modifierDef.scope)) stateAxes.push(name);
    else baseAxes.push(name);
  }

  const baseGroups = baseAxes.map((axisName) => {
    const contexts = Object.keys(modifiers[axisName]?.contexts ?? {});

    if (contexts.length === 0) {
      throw new Error(`Modifier "${axisName}" has no contexts.`);
    }

    return contexts.map((ctx) => ({ [axisName]: ctx }));
  });

  const baseCombos = cartesianProduct(baseGroups);
  const out = [];

  for (const baseCombo of baseCombos) {
    out.push(buildBaseContext(modifierOrder, modifiers, baseCombo));

    for (const stateAxis of stateAxes) {
      const stateModifier = modifiers[stateAxis];
      const stateContexts = Object.keys(stateModifier?.contexts ?? {});
      const defaultState = stateModifier?.default ?? stateContexts[0];
      const stateModifierDef = modifierBuildDefs?.[stateAxis] ?? {};

      if (!matchesScope(baseCombo, stateModifierDef.scope)) continue;

      for (const stateContext of stateContexts) {
        if (stateContext === defaultState) continue;

        out.push(
          buildBaseContext(modifierOrder, modifiers, {
            ...baseCombo,
            [stateAxis]: stateContext,
          }),
        );
      }
    }
  }

  return out;
}

/**
 * Strips internal-only `$extensions` namespaces before emission.
 *
 * Keeps any third-party `$extensions` the source declares; removes
 * Calibrate-internal bridge / build metadata that consumers shouldn't depend
 * on.
 *
 * @param {unknown} node
 * @returns {unknown}
 */
function stripInternalExtensions(node) {
  if (!isObject(node)) return node;

  const out = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "$extensions" && isObject(value)) {
      const filtered = {};

      for (const [extKey, extValue] of Object.entries(value)) {
        if (extKey.startsWith("dev.msrd.calibrate")) continue;
        filtered[extKey] = extValue;
      }

      if (Object.keys(filtered).length > 0) out[key] = filtered;
      continue;
    }

    out[key] = value;
  }

  return out;
}

/**
 * Walks a resolved token tree and accumulates token entries in a flat map
 * keyed by dotted path. Each token entry collects per-context values plus
 * stable metadata (`$type`, `$description`, `$layer`).
 *
 * `$layer` reflects the tokenLayer the token belongs to (e.g. `primitive`,
 * `semantic`). Private-layer tokens (per resolver `tokenLayers.private`) are
 * wrapped under their layer name in the resolved tree (`primitive.color.…`),
 * so `path[0]` identifies them directly. Public-layer tokens (per
 * `tokenLayers.public`) are not wrapped — they sit at the top level by
 * domain — so they default to the public layer name.
 *
 * @param {unknown} node
 * @param {string} ctxKey
 * @param {Map<string, Record<string, unknown>>} accumulator
 * @param {{
 *  privateLayers: Set<string>,
 *  publicLayer: string
 * }} layerConfig
 * @param {string[]} pathStack
 */
function walkTokens(node, ctxKey, accumulator, layerConfig, pathStack = []) {
  if (!isObject(node)) return;

  if (isTokenObject(node)) {
    const dottedPath = pathStack.join(".");
    const $layer = layerConfig.privateLayers.has(pathStack[0])
      ? pathStack[0]
      : layerConfig.publicLayer;

    if (!accumulator.has(dottedPath)) {
      accumulator.set(dottedPath, {
        path: [...pathStack],
        $layer,
        contexts: {},
      });
    }

    const entry = accumulator.get(dottedPath);
    const stripped = stripInternalExtensions(node);

    if (entry.$type === undefined && stripped.$type !== undefined) {
      entry.$type = stripped.$type;
    }
    if (
      entry.$description === undefined &&
      stripped.$description !== undefined
    ) {
      entry.$description = stripped.$description;
    }

    const contextValue = { $value: stripped.$value };

    if (stripped.$extensions !== undefined) {
      contextValue.$extensions = stripped.$extensions;
    }

    entry.contexts[ctxKey] = contextValue;
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walkTokens(value, ctxKey, accumulator, layerConfig, pathStack.concat(key));
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const resolverPath = path.resolve(cwd, args.resolver);
  const outPath = path.resolve(cwd, args.out);
  const tmpDir = path.join(cwd, "build", "tmp-json");

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(path.dirname(outPath), { recursive: true });

  const resolverDoc = await readJson(resolverPath);
  const modifierOrder = getResolutionModifierNames(resolverDoc);
  const modifiers = resolverDoc?.modifiers ?? {};
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const namespace =
    typeof buildDefs?.namespace === "string" ? buildDefs.namespace : null;
  const brand = typeof buildDefs?.brand === "string" ? buildDefs.brand : null;
  const cssBuildDefs = buildDefs?.targets?.css ?? {};
  const modifierBuildDefs = cssBuildDefs?.modifiers ?? {};
  const tokenLayerDefs = buildDefs?.tokenLayers ?? {};
  const privateLayers = new Set(
    Array.isArray(tokenLayerDefs?.private) ? tokenLayerDefs.private : [],
  );
  const publicLayerNames = Array.isArray(tokenLayerDefs?.public)
    ? tokenLayerDefs.public
    : [];
  const publicLayer = publicLayerNames[0] ?? "semantic";
  const layerConfig = { privateLayers, publicLayer };

  const defaultContext = buildBaseContext(modifierOrder, modifiers);
  const defaultContextId = contextId(defaultContext, modifierOrder);
  const allContexts = enumerateContexts(
    modifierOrder,
    modifiers,
    modifierBuildDefs,
  );

  const accumulator = new Map();

  for (const ctx of allContexts) {
    const id = contextId(ctx, modifierOrder);
    const sources = await resolveContextSources({
      cwd,
      resolverPath,
      tmpDir,
      ctx,
      modifierOrder,
    });
    const fullDoc = await buildMergedDoc({
      cwd,
      resolverPath,
      tmpDir,
      id,
      sources,
    });
    const resolved = resolveAliasValues(fullDoc, fullDoc);

    walkTokens(resolved, id, accumulator, layerConfig);
  }

  const sortedKeys = Array.from(accumulator.keys()).sort();
  const tokens = {};

  for (const key of sortedKeys) {
    const entry = accumulator.get(key);
    const tokenOut = { path: entry.path, $layer: entry.$layer };

    if (entry.$type !== undefined) tokenOut.$type = entry.$type;
    if (entry.$description !== undefined) {
      tokenOut.$description = entry.$description;
    }

    // Default-context value sits at the token level (matches DTCG resolver
    // intent: "context overrides only what's needed"). Tokens that exist
    // outside the default context but not in it have no top-level `$value` —
    // their entries live entirely in `contextOverrides`.
    const defaultValue = entry.contexts[defaultContextId];

    if (defaultValue !== undefined) {
      tokenOut.$value = defaultValue.$value;
      if (defaultValue.$extensions !== undefined) {
        tokenOut.$extensions = defaultValue.$extensions;
      }
    }

    const contextOverrides = {};

    for (const [ctxId, ctxValue] of Object.entries(entry.contexts)) {
      if (ctxId === defaultContextId) continue;
      if (defaultValue !== undefined && deepEqual(ctxValue, defaultValue)) {
        continue;
      }
      contextOverrides[ctxId] = ctxValue;
    }

    if (Object.keys(contextOverrides).length > 0) {
      tokenOut.contextOverrides = contextOverrides;
    }

    tokens[key] = tokenOut;
  }

  const output = {
    $schemaVersion: SCHEMA_VERSION,
    namespace,
    brand,
    modifierOrder,
    defaultContext: defaultContextId,
    tokens,
  };

  await fs.writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log(`Wrote consumer JSON: ${path.relative(cwd, outPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
