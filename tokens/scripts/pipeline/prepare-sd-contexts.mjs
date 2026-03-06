#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { isObject } from "./helpers/json.mjs";

/**
 * Pipeline stage that prepares resolved context overlays and CSS block manifests.
 *
 * This script resolves token sources for each context, computes emitted deltas
 * against configured base contexts, and writes:
 * - context token overlays for Style Dictionary input
 * - CSS block metadata (selectors/media/order) for formatter output
 */

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
    if (arg === "--out-tokens") args.outTokens = argv[i + 1];
    if (arg === "--out-manifest") args.outManifest = argv[i + 1];
  }

  if (
    typeof args.resolver !== "string" ||
    typeof args.outTokens !== "string" ||
    typeof args.outManifest !== "string"
  ) {
    throw new Error(
      "Usage: node tokens/scripts/pipeline/prepare-sd-contexts.mjs --resolver <resolver.json> --out-tokens <contexts.json> --out-manifest <manifest.json>",
    );
  }

  return args;
}

const cli = parseArgs(process.argv.slice(2));
const outManifestPath = path.resolve(cwd, cli.outManifest);
const outTokensPath = path.resolve(cwd, cli.outTokens);
const resolverPath = path.resolve(cwd, cli.resolver);
const tmpDir = path.join(cwd, "tokens", "build", "tmp");

/**
 * Runs a subprocess and throws with captured stdout/stderr on failure.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} opts
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });

  if (res.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed.\n${res.stdout || ""}\n${res.stderr || ""}`,
    );
  }

  return res;
}

/**
 * Extracts ordered modifier names from resolver `resolutionOrder` refs.
 *
 * @param {Record<string, unknown>} resolverDoc
 * @returns {string[]}
 */
function getResolutionModifierNames(resolverDoc) {
  const refs = Array.isArray(resolverDoc?.resolutionOrder)
    ? resolverDoc.resolutionOrder
    : [];
  const names = refs
    .map((entry) => {
      const ref = entry?.$ref;
      if (typeof ref !== "string") return null;
      const match = ref.match(/^#\/modifiers\/(.+)$/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  if (names.length === 0) {
    throw new Error(
      "Resolver resolutionOrder must reference modifiers (e.g. #/modifiers/size).",
    );
  }

  return names;
}

/**
 * Builds a stable context ID from resolution-order modifier values.
 *
 * @param {Record<string, unknown>} context
 * @param {string[]} modifierOrder
 * @returns {string}
 */
function contextId(context, modifierOrder) {
  return modifierOrder
    .map((modifierName) => {
      const value = context?.[modifierName];

      if (value === undefined) {
        throw new Error(
          `Context is missing modifier "${modifierName}" required by resolutionOrder.`,
        );
      }

      return String(value);
    })
    .join("-");
}

/**
 * Checks whether a value is a token object with a `$value` field.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isTokenObject(value) {
  return (
    isObject(value) && Object.prototype.hasOwnProperty.call(value, "$value")
  );
}

/**
 * Performs structural equality via JSON serialization for token values.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Parses `{alias.path}` syntax and returns the alias path when valid.
 *
 * @param {unknown} value
 * @returns {string | null}
 */
function parseAliasRef(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

/**
 * Normalizes raw dimension values to CSS dimension strings when possible.
 *
 * @param {unknown} rawValue
 * @returns {string | null}
 */
function toCssDimensionValue(rawValue) {
  if (typeof rawValue === "string") return rawValue;
  if (rawValue && typeof rawValue === "object") {
    const value = rawValue.value;
    const unit = rawValue.unit;

    if (
      (typeof value === "number" || typeof value === "string") &&
      typeof unit === "string"
    ) {
      return `${value}${unit}`;
    }
  }
  return null;
}

/**
 * Recursively removes tokens that are unchanged versus a comparison tree.
 *
 * @param {unknown} sourceNode
 * @param {unknown | undefined} baseNode
 * @returns {unknown | null}
 */
function pruneUnchanged(sourceNode, baseNode) {
  if (!isObject(sourceNode)) return sourceNode;
  if (isTokenObject(sourceNode)) {
    if (
      isTokenObject(baseNode) &&
      deepEqual(sourceNode.$value, baseNode.$value)
    ) {
      return null;
    }
    return sourceNode;
  }

  const out = {};

  for (const [key, value] of Object.entries(sourceNode)) {
    if (key.startsWith("$")) continue;

    const pruned = pruneUnchanged(
      value,
      isObject(baseNode) ? baseNode[key] : undefined,
    );

    if (pruned !== null) out[key] = pruned;
  }

  if (Object.keys(out).length === 0) return null;

  for (const [key, value] of Object.entries(sourceNode)) {
    if (key.startsWith("$")) out[key] = value;
  }

  return out;
}

/**
 * Reads a nested value by dotted path lookup.
 *
 * @param {unknown} root
 * @param {string} dotted
 * @returns {unknown | undefined}
 */
function getByDottedPath(root, dotted) {
  const parts = dotted.split(".");
  let current = root;

  for (const part of parts) {
    if (!isObject(current)) return undefined;

    current = current[part];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Safely reads a dotted path value, returning undefined for invalid input.
 *
 * @param {unknown} root
 * @param {string} dotted
 * @returns {unknown | undefined}
 */
function getByDottedPathOrUndefined(root, dotted) {
  if (!isObject(root) || typeof dotted !== "string" || dotted.length === 0)
    return undefined;

  return getByDottedPath(root, dotted);
}

/**
 * Parses a JSON Pointer string into path segments.
 *
 * @param {string} pointer
 * @returns {string[]}
 */
function parseJsonPointer(pointer) {
  if (!pointer || pointer === "#") return [];
  if (!pointer.startsWith("#/")) {
    throw new Error(`Unsupported JSON pointer: ${pointer}`);
  }

  return pointer
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}

/**
 * Reads a nested value by JSON Pointer lookup.
 *
 * @param {unknown} root
 * @param {string} pointer
 * @returns {unknown | undefined}
 */
function getByJsonPointer(root, pointer) {
  const segments = parseJsonPointer(pointer);
  let current = root;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;
    current = current[segment];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Resolves `$value` aliases recursively within a token tree with cycle checks.
 *
 * @param {unknown} node
 * @param {Record<string, unknown>} lookupRoot
 * @param {string[]} stack
 * @returns {unknown}
 */
function resolveAliasValues(node, lookupRoot, stack = []) {
  const resolveValue = (value, localStack) => {
    if (Array.isArray(value))
      return value.map((item) => resolveValue(item, localStack));

    if (isObject(value)) {
      const out = {};

      for (const [k, v] of Object.entries(value))
        out[k] = resolveValue(v, localStack);

      return out;
    }
    if (typeof value === "string") {
      const alias = parseAliasRef(value);

      if (alias) {
        if (localStack.includes(alias)) {
          throw new Error(
            `Alias cycle detected while resolving context token: ${localStack.join(" -> ")} -> ${alias}`,
          );
        }

        const target = getByDottedPath(lookupRoot, alias);

        if (target === undefined) {
          throw new Error(
            `Alias target not found while resolving context token: {${alias}}`,
          );
        }

        if (
          isObject(target) &&
          Object.prototype.hasOwnProperty.call(target, "$value")
        ) {
          return resolveValue(target.$value, localStack.concat(alias));
        }
        return resolveValue(target, localStack.concat(alias));
      }
    }
    return value;
  };

  if (Array.isArray(node)) {
    return node.map((item) => resolveAliasValues(item, lookupRoot, stack));
  }
  if (!isObject(node)) return node;

  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    return { ...node, $value: resolveValue(node.$value, stack) };
  }

  const out = {};

  for (const [key, value] of Object.entries(node)) {
    out[key] = resolveAliasValues(value, lookupRoot, stack);
  }

  return out;
}

/**
 * Reads and parses a JSON file from disk.
 *
 * @param {string} filePath
 * @returns {Promise<unknown>}
 */
async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

/**
 * Topologically orders surface contexts using `baseContext` dependencies.
 *
 * @param {string[]} surfaceContexts
 * @param {Record<string, unknown>} defs
 * @returns {string[]}
 */
function buildSurfaceOrder(surfaceContexts, defs) {
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();
  const visit = (context) => {
    if (visited.has(context)) return;
    if (visiting.has(context)) {
      throw new Error(`Cycle detected in surface base graph at "${context}".`);
    }

    visiting.add(context);

    const base = defs?.[context]?.baseContext ?? null;

    if (base) visit(base);

    visiting.delete(context);
    visited.add(context);
    ordered.push(context);
  };

  for (const context of surfaceContexts) visit(context);

  return ordered;
}

/**
 * Infers surface, responsive, and state axes from resolver CSS build metadata.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifierBuildDefs
 * @returns {{ surfaceAxis: string, responsiveAxis: string, stateAxes: string[] }}
 */
function inferCssAxes(modifierOrder, modifierBuildDefs) {
  const overlayAxes = modifierOrder.filter((modifierName) =>
    isObject(modifierBuildDefs?.[modifierName]?.scope),
  );
  const baseAxes = modifierOrder.filter(
    (modifierName) => !overlayAxes.includes(modifierName),
  );

  if (baseAxes.length === 0) {
    throw new Error(
      "Resolver css build metadata requires at least one non-overlay modifier.",
    );
  }

  const hasSelector = (modifierName) =>
    Object.values(modifierBuildDefs?.[modifierName]?.contexts ?? {}).some(
      (ctx) =>
        (typeof ctx?.selector === "string" && ctx.selector.length > 0) ||
        (typeof ctx?.selectorRef === "string" && ctx.selectorRef.length > 0),
    );
  const hasMedia = (modifierName) =>
    Object.values(modifierBuildDefs?.[modifierName]?.contexts ?? {}).some(
      (ctx) => Array.isArray(ctx?.media) && ctx.media.length > 0,
    );
  const surfaceAxis = baseAxes.find(hasSelector) ?? baseAxes[0];
  const responsiveAxis =
    baseAxes.find((axis) => axis !== surfaceAxis && hasMedia(axis)) ??
    baseAxes.find((axis) => axis !== surfaceAxis) ??
    surfaceAxis;

  return {
    surfaceAxis,
    responsiveAxis,
    stateAxes: overlayAxes,
  };
}

/**
 * Builds a merged token document for one context via the source-merge pipeline.
 *
 * @param {string} id
 * @param {string[]} sources
 * @returns {Promise<unknown>}
 */
async function buildMergedDoc(id, sources) {
  const sourcesPath = path.join(tmpDir, `${id}.merge.sources.json`);
  const tokensPath = path.join(tmpDir, `${id}.merge.tokens.json`);

  await fs.writeFile(
    sourcesPath,
    `${JSON.stringify({ sources }, null, 2)}\n`,
    "utf8",
  );

  run("node", [
    "tokens/scripts/pipeline/prepare-sd-sources.mjs",
    "--sources-file",
    path.relative(cwd, sourcesPath),
    "--resolver",
    path.relative(cwd, resolverPath),
    "--out-file",
    path.relative(cwd, tokensPath),
  ]);

  return readJson(tokensPath);
}

/**
 * Resolves ordered token source file paths for a specific context.
 *
 * @param {Record<string, unknown>} ctx
 * @param {string[]} modifierOrder
 * @returns {Promise<string[]>}
 */
async function resolveContextSources(ctx, modifierOrder) {
  const id = contextId(ctx, modifierOrder);
  const contextPath = path.join(tmpDir, `${id}.context.json`);
  const sourcesPath = path.join(tmpDir, `${id}.sources.json`);

  await fs.writeFile(contextPath, `${JSON.stringify(ctx, null, 2)}\n`, "utf8");

  run("node", [
    "tokens/scripts/pipeline/resolve-token-sources.mjs",
    "--resolver",
    path.relative(cwd, resolverPath),
    "--context",
    path.relative(cwd, contextPath),
    "--out",
    path.relative(cwd, sourcesPath),
  ]);

  const sourcesDoc = JSON.parse(await fs.readFile(sourcesPath, "utf8"));

  if (!Array.isArray(sourcesDoc.sources) || sourcesDoc.sources.length === 0) {
    throw new Error(`No sources resolved for context ${id}`);
  }
  return sourcesDoc.sources;
}

/**
 * Returns the configured modifier default context, or the first context key.
 *
 * @param {Record<string, unknown>} modifierDoc
 * @param {string[]} contexts
 * @returns {string}
 */
function getAxisDefault(modifierDoc, contexts) {
  return modifierDoc?.default ?? contexts[0];
}

/**
 * Resolves alias strings to terminal literal values with cycle protection.
 *
 * @param {unknown} value
 * @param {Record<string, unknown>} lookupRoot
 * @param {Set<string>} seen
 * @returns {unknown}
 */
function resolveAliasOrLiteral(value, lookupRoot, seen = new Set()) {
  if (typeof value !== "string") return value;

  const alias = parseAliasRef(value);

  if (!alias) return value;
  if (seen.has(alias)) {
    throw new Error(
      `Alias cycle detected while resolving media condition: ${Array.from(seen).join(" -> ")} -> ${alias}`,
    );
  }

  const target = getByDottedPath(lookupRoot, alias);

  if (target === undefined) {
    throw new Error(
      `Alias target not found while resolving media condition: {${alias}}`,
    );
  }

  const nextSeen = new Set(seen);

  nextSeen.add(alias);

  if (
    isObject(target) &&
    Object.prototype.hasOwnProperty.call(target, "$value")
  ) {
    return resolveAliasOrLiteral(target.$value, lookupRoot, nextSeen);
  }
  return resolveAliasOrLiteral(target, lookupRoot, nextSeen);
}

/**
 * Normalizes media specs into CSS media query strings.
 *
 * @param {unknown} spec
 * @param {Record<string, unknown>} lookupRoot
 * @param {Record<string, unknown> | null} sharedMedia
 * @returns {string | null}
 */
function resolveMediaSpec(spec, lookupRoot, sharedMedia = null) {
  if (spec == null) return null;

  if (typeof spec === "string") {
    const resolved = resolveAliasOrLiteral(spec, lookupRoot);

    if (typeof resolved === "string" && resolved.trim().startsWith("("))
      return resolved;

    const dimension = toCssDimensionValue(resolved);

    if (dimension) return `(min-width: ${dimension})`;

    throw new Error(`Unsupported mediaByContext string spec: ${spec}`);
  }

  if (isObject(spec)) {
    if (typeof spec.mediaRef === "string" && spec.mediaRef.length > 0) {
      const referenced = getByDottedPathOrUndefined(sharedMedia, spec.mediaRef);
      if (referenced === undefined) {
        throw new Error(`Unknown mediaRef: ${spec.mediaRef}`);
      }
      return resolveMediaSpec(referenced, lookupRoot, sharedMedia);
    }
    if (typeof spec.query === "string") return spec.query;
    if (Object.prototype.hasOwnProperty.call(spec, "minWidth")) {
      const minWidthValue = resolveAliasOrLiteral(spec.minWidth, lookupRoot);
      const dimension = toCssDimensionValue(minWidthValue);
      if (!dimension) {
        throw new Error(
          `Unsupported minWidth media spec value: ${JSON.stringify(spec.minWidth)}`,
        );
      }
      return `(min-width: ${dimension})`;
    }
  }

  throw new Error(`Unsupported mediaByContext spec: ${JSON.stringify(spec)}`);
}

/**
 * Builds a context-to-media map, skipping media for the default context.
 *
 * @param {{
 *  contexts: string[],
 *  defaultContext: string,
 *  mediaByContext: Record<string, unknown>,
 *  lookupRoot: Record<string, unknown>,
 *  sharedMedia?: Record<string, unknown> | null
 * }} options
 * @returns {Record<string, string | null>}
 */
function resolveMediaByContext({
  contexts,
  defaultContext,
  mediaByContext,
  lookupRoot,
  sharedMedia = null,
}) {
  const out = {};

  for (const context of contexts) {
    if (context === defaultContext) {
      out[context] = null;

      continue;
    }

    const spec = mediaByContext?.[context];

    out[context] =
      spec == null ? null : resolveMediaSpec(spec, lookupRoot, sharedMedia);
  }

  return out;
}

/**
 * Builds media query mapping for modifier contexts from resolver metadata.
 *
 * @param {{
 *  contexts: string[],
 *  defaultContext: string,
 *  modifierDef: Record<string, unknown>,
 *  lookupRoot: Record<string, unknown>,
 *  sharedMedia?: Record<string, unknown> | null
 * }} options
 * @returns {Record<string, string | null>}
 */
function buildContextMediaMap({
  contexts,
  defaultContext,
  modifierDef,
  lookupRoot,
  sharedMedia = null,
}) {
  const mediaByContext = {};

  for (const context of contexts) {
    const media = modifierDef?.contexts?.[context]?.media;

    if (!Array.isArray(media) || media.length === 0) continue;

    const resolved = media
      .map((entry) => resolveMediaSpec(entry, lookupRoot, sharedMedia))
      .filter((value) => typeof value === "string" && value.length > 0);

    if (resolved.length > 0) mediaByContext[context] = resolved.join(" and ");
  }

  return resolveMediaByContext({
    contexts,
    defaultContext,
    mediaByContext,
    lookupRoot,
    sharedMedia,
  });
}

/**
 * Applies namespace/brand token replacements to template strings.
 *
 * @param {unknown} value
 * @param {Record<string, string>} naming
 * @returns {string}
 */
function applyNamingTemplate(value, naming = {}) {
  if (typeof value !== "string") return value;

  const replacements = {
    namespace: naming.namespace ?? "",
    brand: naming.brand ?? "",
  };

  return value.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    if (!Object.prototype.hasOwnProperty.call(replacements, key)) return match;

    return String(replacements[key]);
  });
}

/**
 * Builds default variant scope using defaults of non-target modifier axes.
 *
 * @param {string} modifierName
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @returns {Record<string, string[]> | null}
 */
function buildDefaultScopeForModifier(modifierName, modifierOrder, modifiers) {
  const scope = {};

  for (const axis of modifierOrder) {
    if (axis === modifierName) continue;

    const modifierDoc = modifiers?.[axis];
    const contexts = Object.keys(modifierDoc?.contexts ?? {});

    if (contexts.length === 0) continue;

    scope[axis] = [getAxisDefault(modifierDoc, contexts)];
  }

  return Object.keys(scope).length > 0 ? scope : null;
}

/**
 * Merges default and override variant scopes.
 *
 * @param {Record<string, string[]> | null} defaultScope
 * @param {Record<string, string[]> | null} overrideScope
 * @returns {Record<string, string[]> | null}
 */
function mergeScope(defaultScope, overrideScope) {
  if (!isObject(defaultScope) && !isObject(overrideScope)) return null;
  if (!isObject(defaultScope)) return overrideScope;
  if (!isObject(overrideScope)) return defaultScope;

  return { ...defaultScope, ...overrideScope };
}

/**
 * Resolves and filters media entries declared on a context/variant spec.
 *
 * @param {unknown} spec
 * @param {Record<string, unknown>} lookupRoot
 * @param {Record<string, unknown> | null} sharedMedia
 * @returns {string[]}
 */
function resolveMediaList(spec, lookupRoot, sharedMedia = null) {
  const media = spec?.media;

  if (!Array.isArray(media) || media.length === 0) return [];

  return media
    .map((entry) => resolveMediaSpec(entry, lookupRoot, sharedMedia))
    .filter((value) => typeof value === "string" && value.length > 0);
}

/**
 * Resolves selector text from inline selector or selector reference metadata.
 *
 * @param {unknown} spec
 * @param {string} contextName
 * @param {Record<string, string>} selectorsMap
 * @param {Record<string, string>} naming
 * @returns {string | null}
 */
function resolveSelectorFromSpec(
  spec,
  contextName,
  selectorsMap = {},
  naming = {},
) {
  if (!isObject(spec)) return null;
  if (typeof spec.selector === "string" && spec.selector.length > 0) {
    return applyNamingTemplate(spec.selector, naming);
  }
  if (typeof spec.selectorRef === "string" && spec.selectorRef.length > 0) {
    const resolved = selectorsMap?.[spec.selectorRef];

    if (typeof resolved !== "string" || resolved.length === 0) {
      throw new Error(
        `Unknown selectorRef "${spec.selectorRef}" for context "${contextName}".`,
      );
    }

    return applyNamingTemplate(resolved, naming);
  }

  return null;
}

/**
 * Derives base and variant CSS emission targets for one context.
 *
 * @param {{
 *  modifierName: string,
 *  modifierOrder: string[],
 *  modifiers: Record<string, unknown>,
 *  modifierDef: Record<string, unknown>,
 *  contextName: string,
 *  selectorsMap?: Record<string, string>,
 *  naming?: Record<string, string>,
 *  lookupRoot: Record<string, unknown>,
 *  sharedMedia?: Record<string, unknown> | null
 * }} options
 * @returns {Array<Record<string, unknown>>}
 */
function resolveContextEmitTargets({
  modifierName,
  modifierOrder,
  modifiers,
  modifierDef,
  contextName,
  selectorsMap = {},
  naming = {},
  lookupRoot,
  sharedMedia = null,
}) {
  const ctx = modifierDef?.contexts?.[contextName] ?? {};
  const variantDefaultsMode =
    typeof modifierDef?.variantDefaults?.scopeMode === "string"
      ? modifierDef.variantDefaults.scopeMode
      : "defaults";
  const variantDefaultsModeScope =
    variantDefaultsMode === "defaults"
      ? buildDefaultScopeForModifier(modifierName, modifierOrder, modifiers)
      : null;
  const variantDefaultsScope = isObject(modifierDef?.variantDefaults?.scope)
    ? modifierDef.variantDefaults.scope
    : null;
  const out = [];
  const baseSelector = resolveSelectorFromSpec(
    ctx,
    contextName,
    selectorsMap,
    naming,
  );

  if (baseSelector) {
    out.push({
      kind: "base",
      selector: baseSelector,
      media: resolveMediaList(ctx, lookupRoot, sharedMedia),
    });
  }

  const variants = Array.isArray(ctx.variants) ? ctx.variants : [];

  for (const variant of variants) {
    const selector = resolveSelectorFromSpec(
      variant,
      contextName,
      selectorsMap,
      naming,
    );

    if (!selector) continue;

    out.push({
      kind: "variant",
      variantName:
        typeof variant.name === "string" && variant.name.length > 0
          ? variant.name
          : undefined,
      deltaFromContext:
        typeof variant.deltaFromContext === "string" &&
        variant.deltaFromContext.length > 0
          ? variant.deltaFromContext
          : null,
      scope: mergeScope(
        mergeScope(variantDefaultsModeScope, variantDefaultsScope),
        isObject(variant.scope) ? variant.scope : null,
      ),
      selector,
      media: resolveMediaList(variant, lookupRoot, sharedMedia),
    });
  }

  return out;
}

/**
 * Builds a fully-specified context object from defaults and explicit overrides.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @param {unknown} overrides
 * @returns {Record<string, string>}
 */
function buildBaseContext(modifierOrder, modifiers, overrides = {}) {
  const out = {};

  for (const modifierName of modifierOrder) {
    const modifierDoc = modifiers?.[modifierName];
    const contexts = Object.keys(modifierDoc?.contexts ?? {});

    if (contexts.length === 0) {
      throw new Error(`Modifier "${modifierName}" has no contexts.`);
    }

    out[modifierName] =
      overrides[modifierName] ?? getAxisDefault(modifierDoc, contexts);
  }

  return out;
}

/**
 * Checks whether a resolved context satisfies a variant scope constraint.
 *
 * @param {Record<string, string>} selection
 * @param {Record<string, string[]> | null} scope
 * @returns {boolean}
 */
function matchesScope(selection, scope) {
  if (!isObject(scope)) return true;

  for (const [axis, allowed] of Object.entries(scope)) {
    if (!Array.isArray(allowed) || allowed.length === 0) continue;
    if (!allowed.includes(selection[axis])) return false;
  }

  return true;
}

/**
 * Resolves shared media definitions from inline config or external `mediaRef`.
 *
 * @param {Record<string, unknown>} buildDefs
 * @param {string} resolverFilePath
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function resolveSharedMediaFromBuild(buildDefs, resolverFilePath) {
  const inlineMedia = buildDefs?.shared?.media;

  if (isObject(inlineMedia)) return inlineMedia;

  const mediaRef = buildDefs?.shared?.mediaRef;

  if (typeof mediaRef !== "string" || mediaRef.length === 0) return null;

  const [filePart, pointerPart] = mediaRef.split("#");
  const pointer = pointerPart ? `#${pointerPart}` : "#";
  const targetPath = path.resolve(path.dirname(resolverFilePath), filePart);
  const targetDoc = await readJson(targetPath);
  const targetValue = getByJsonPointer(targetDoc, pointer);

  if (!isObject(targetValue)) {
    throw new Error(
      `Resolver shared.mediaRef did not resolve to an object: ${mediaRef}`,
    );
  }

  return targetValue;
}

/**
 * Builds context token overlays and CSS block manifests for Style Dictionary.
 *
 * @returns {Promise<void>}
 */
async function main() {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(path.dirname(outTokensPath), { recursive: true });
  await fs.mkdir(path.dirname(outManifestPath), { recursive: true });

  const resolverDoc = await readJson(resolverPath);
  const modifierOrder = getResolutionModifierNames(resolverDoc);
  const modifiers = resolverDoc?.modifiers ?? {};
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const namespace =
    typeof buildDefs?.namespace === "string" &&
    buildDefs.namespace.trim().length > 0
      ? buildDefs.namespace.trim()
      : null;
  const brand =
    typeof buildDefs?.brand === "string" && buildDefs.brand.trim().length > 0
      ? buildDefs.brand.trim()
      : null;
  const cssBuildDefs = buildDefs?.targets?.css;
  const tokenLayerDefs = buildDefs?.tokenLayers ?? {};
  const sharedMedia = await resolveSharedMediaFromBuild(
    buildDefs,
    resolverPath,
  );
  const modifierBuildDefs = cssBuildDefs?.modifiers ?? {};
  const selectorDefs = cssBuildDefs?.selectors ?? {};
  const resolvedSelectorDefs = Object.fromEntries(
    Object.entries(selectorDefs).map(([key, value]) => [
      key,
      applyNamingTemplate(value, { namespace, brand }),
    ]),
  );
  const { surfaceAxis, responsiveAxis, stateAxes } = inferCssAxes(
    modifierOrder,
    modifierBuildDefs,
  );
  const surfaceDefs = modifierBuildDefs?.[surfaceAxis]?.contexts ?? {};
  const surfaceModifier = modifiers?.[surfaceAxis];
  const responsiveModifier = modifiers?.[responsiveAxis];

  if (!surfaceModifier?.contexts || !responsiveModifier?.contexts) {
    throw new Error(
      `Resolver is missing required modifiers for css build axes: surface="${surfaceAxis}", responsive="${responsiveAxis}".`,
    );
  }
  if (!surfaceDefs) {
    throw new Error(
      `Resolver missing $defs.build.targets.css.modifiers.${surfaceAxis} metadata.`,
    );
  }

  const surfaceContexts = Object.keys(surfaceModifier.contexts);
  const responsiveContexts = Object.keys(responsiveModifier.contexts);
  const surfaceOrder = buildSurfaceOrder(surfaceContexts, surfaceDefs);
  const defaultResponsive = getAxisDefault(
    responsiveModifier,
    responsiveContexts,
  );
  const responsiveDef = modifierBuildDefs?.[responsiveAxis] ?? null;
  const fullDocsByContextId = new Map();
  const resolvedDocsByContextId = new Map();
  const getFullDoc = async (ctx) => {
    const id = contextId(ctx, modifierOrder);
    if (fullDocsByContextId.has(id)) return fullDocsByContextId.get(id);
    const sources = await resolveContextSources(ctx, modifierOrder);
    const doc = await buildMergedDoc(id, sources);
    fullDocsByContextId.set(id, doc);
    return doc;
  };
  const getResolvedDoc = async (ctx) => {
    const id = contextId(ctx, modifierOrder);
    if (resolvedDocsByContextId.has(id)) return resolvedDocsByContextId.get(id);
    const fullDoc = await getFullDoc(ctx);
    const resolved = resolveAliasValues(fullDoc, fullDoc);
    resolvedDocsByContextId.set(id, resolved);
    return resolved;
  };
  const defaultStateByAxis = {};

  for (const axis of stateAxes) {
    const modifier = modifiers?.[axis];

    if (!modifier?.contexts) continue;

    const contexts = Object.keys(modifier.contexts);

    if (contexts.length === 0) continue;

    defaultStateByAxis[axis] = getAxisDefault(modifier, contexts);
  }

  for (const surfaceContext of surfaceContexts) {
    for (const responsiveContext of responsiveContexts) {
      const ctx = buildBaseContext(modifierOrder, modifiers, {
        [surfaceAxis]: surfaceContext,
        [responsiveAxis]: responsiveContext,
        ...defaultStateByAxis,
      });

      await getFullDoc(ctx);
    }
  }

  const defaultContextDocId = contextId(
    buildBaseContext(modifierOrder, modifiers),
    modifierOrder,
  );
  const mediaLookupRoot = fullDocsByContextId.get(defaultContextDocId);
  if (!mediaLookupRoot) {
    throw new Error(
      `Unable to resolve default context document for media lookup: ${defaultContextDocId}`,
    );
  }
  const responsiveMedia = buildContextMediaMap({
    contexts: responsiveContexts,
    defaultContext: defaultResponsive,
    modifierDef: responsiveDef,
    lookupRoot: mediaLookupRoot,
    sharedMedia,
  });
  const contextsRoot = {};
  const blocks = [];
  const previousOffOverlayBySurface = new Map();

  for (const surfaceContext of surfaceContexts)
    previousOffOverlayBySurface.set(surfaceContext, {});

  for (
    let responsiveIndex = 0;
    responsiveIndex < responsiveContexts.length;
    responsiveIndex += 1
  ) {
    const responsiveContext = responsiveContexts[responsiveIndex];
    const deferredVariantBlocks = [];

    for (const surfaceContext of surfaceOrder) {
      const ctx = buildBaseContext(modifierOrder, modifiers, {
        [surfaceAxis]: surfaceContext,
        [responsiveAxis]: responsiveContext,
        ...defaultStateByAxis,
      });
      const id = contextId(ctx, modifierOrder);
      const fullDocResolved = await getResolvedDoc(ctx);
      const def = surfaceDefs?.[surfaceContext];
      const baseSurface = def?.baseContext ?? null;
      const baseDocResolved = baseSurface
        ? await getResolvedDoc(
            buildBaseContext(modifierOrder, modifiers, {
              [surfaceAxis]: baseSurface,
              [responsiveAxis]: responsiveContext,
              ...defaultStateByAxis,
            }),
          )
        : {};

      // Overlay for this surface at this responsive context (removes inherited/base tokens).
      const currentOverlayResolved =
        pruneUnchanged(fullDocResolved, baseDocResolved) || {};

      const previousOverlayResolved =
        previousOffOverlayBySurface.get(surfaceContext) || {};

      // Emit only the delta from previous responsive overlay for this surface.
      const prunedResolved = pruneUnchanged(
        currentOverlayResolved,
        previousOverlayResolved,
      );

      if (prunedResolved && Object.keys(prunedResolved).length > 0) {
        const emittedResolved = prunedResolved;
        const emitTargets = resolveContextEmitTargets({
          modifierName: surfaceAxis,
          modifierOrder,
          modifiers,
          modifierDef: modifierBuildDefs?.[surfaceAxis],
          contextName: surfaceContext,
          selectorsMap: resolvedSelectorDefs,
          naming: { namespace, brand },
          lookupRoot: mediaLookupRoot,
          sharedMedia,
        });
        let variantIndex = 0;

        for (const target of emitTargets) {
          if (
            target.kind === "variant" &&
            target.scope &&
            !matchesScope(ctx, target.scope)
          ) {
            continue;
          }

          let blockId = id;
          let blockDocResolved = emittedResolved;

          if (target.kind === "variant" && target.deltaFromContext) {
            const compareCtx = buildBaseContext(modifierOrder, modifiers, {
              [surfaceAxis]: target.deltaFromContext,
              [responsiveAxis]: responsiveContext,
              ...defaultStateByAxis,
            });
            const compareResolved = await getResolvedDoc(compareCtx);
            const variantResolved = pruneUnchanged(
              fullDocResolved,
              compareResolved,
            );

            blockDocResolved =
              variantResolved && Object.keys(variantResolved).length > 0
                ? variantResolved
                : null;

            if (!blockDocResolved) continue;

            variantIndex += 1;
            blockId = `${id}__variant${variantIndex}`;
            contextsRoot[blockId] = blockDocResolved;
          }

          if (target.kind === "base") {
            contextsRoot[blockId] = blockDocResolved;
          }

          const media = [...target.media];
          const responsiveCond = responsiveMedia[responsiveContext];

          if (responsiveCond) media.push(responsiveCond);

          const block = {
            id: blockId,
            comment: `${surfaceContext} | ${responsiveContext} | default-states${
              target.variantName ? ` | variant:${target.variantName}` : ""
            }`,
            selector: target.selector,
            media,
          };

          if (target.kind === "variant") deferredVariantBlocks.push(block);
          else blocks.push(block);
        }
      }

      previousOffOverlayBySurface.set(surfaceContext, currentOverlayResolved);
    }
    blocks.push(...deferredVariantBlocks);
  }

  for (const stateAxis of stateAxes) {
    const stateModifier = modifiers?.[stateAxis];

    if (!stateModifier?.contexts) continue;

    const stateContexts = Object.keys(stateModifier.contexts);
    const defaultState = getAxisDefault(stateModifier, stateContexts);
    const stateDef = modifierBuildDefs?.[stateAxis] ?? null;

    if (!stateDef) continue;

    const emitContexts =
      stateContexts.length === 1
        ? [...stateContexts]
        : stateContexts.filter((ctx) => ctx !== defaultState);
    const scopeDef = isObject(stateDef.scope) ? stateDef.scope : {};
    const surfaceScope =
      Array.isArray(scopeDef[surfaceAxis]) && scopeDef[surfaceAxis].length > 0
        ? scopeDef[surfaceAxis]
        : surfaceContexts;
    const responsiveScope =
      Array.isArray(scopeDef[responsiveAxis]) &&
      scopeDef[responsiveAxis].length > 0
        ? scopeDef[responsiveAxis]
        : [defaultResponsive];
    const mediaByStateContext = buildContextMediaMap({
      contexts: stateContexts,
      defaultContext: defaultState,
      modifierDef: stateDef,
      lookupRoot: mediaLookupRoot,
      sharedMedia,
    });

    for (const stateContext of emitContexts) {
      const surfaceScopeSet = new Set(surfaceScope);

      for (const surfaceContext of surfaceOrder) {
        if (!surfaceScopeSet.has(surfaceContext)) continue;

        for (const responsiveContext of responsiveScope) {
          const onCtx = buildBaseContext(modifierOrder, modifiers, {
            [surfaceAxis]: surfaceContext,
            [responsiveAxis]: responsiveContext,
            ...defaultStateByAxis,
            [stateAxis]: stateContext,
          });
          const onId = contextId(onCtx, modifierOrder);
          const onFullDocResolved = await getResolvedDoc(onCtx);
          const offCtx = buildBaseContext(modifierOrder, modifiers, {
            [surfaceAxis]: surfaceContext,
            [responsiveAxis]: responsiveContext,
            ...defaultStateByAxis,
            [stateAxis]: defaultState,
          });

          // Compare state overrides against the fully resolved default-state context,
          // not incremental emitted overlays, to avoid over-emitting unchanged tokens.
          const offDoc = await getResolvedDoc(offCtx);
          const comparisonBase = offDoc;
          const prunedResolved = pruneUnchanged(
            onFullDocResolved,
            comparisonBase,
          );
          const emittedResolved =
            prunedResolved && Object.keys(prunedResolved).length > 0
              ? prunedResolved
              : null;

          if (!emittedResolved) {
            continue;
          }

          const emitTargets = resolveContextEmitTargets({
            modifierName: surfaceAxis,
            modifierOrder,
            modifiers,
            modifierDef: modifierBuildDefs?.[surfaceAxis],
            contextName: surfaceContext,
            selectorsMap: resolvedSelectorDefs,
            naming: { namespace, brand },
            lookupRoot: mediaLookupRoot,
            sharedMedia,
          });
          let variantIndex = 0;

          for (const target of emitTargets) {
            if (
              target.kind === "variant" &&
              target.scope &&
              !matchesScope(onCtx, target.scope)
            ) {
              continue;
            }

            let blockId = onId;
            let blockDocResolved = emittedResolved;

            if (target.kind === "variant" && target.deltaFromContext) {
              const compareCtx = buildBaseContext(modifierOrder, modifiers, {
                [surfaceAxis]: target.deltaFromContext,
                [responsiveAxis]: responsiveContext,
                ...defaultStateByAxis,
                [stateAxis]: stateContext,
              });

              const compareResolved = await getResolvedDoc(compareCtx);
              const variantResolved = pruneUnchanged(
                onFullDocResolved,
                compareResolved,
              );

              blockDocResolved =
                variantResolved && Object.keys(variantResolved).length > 0
                  ? variantResolved
                  : null;

              if (!blockDocResolved) continue;

              variantIndex += 1;
              blockId = `${onId}__variant${variantIndex}`;
              contextsRoot[blockId] = blockDocResolved;
            }

            if (target.kind === "base") {
              contextsRoot[blockId] = blockDocResolved;
            }

            const media = [...target.media];
            const responsiveCond = responsiveMedia[responsiveContext];
            const stateCond = mediaByStateContext[stateContext] ?? null;

            if (responsiveCond) media.push(responsiveCond);
            if (stateCond) media.push(stateCond);

            blocks.push({
              id: blockId,
              comment: `${surfaceContext} | ${responsiveContext} | ${stateAxis}:${stateContext}${
                target.variantName ? ` | variant:${target.variantName}` : ""
              }`,
              selector: target.selector,
              media,
            });
          }
        }
      }
    }
  }

  const contextsDoc = {
    ...(namespace ? { namespace } : {}),
    ...(brand ? { brand } : {}),
    contexts: contextsRoot,
  };

  const manifest = {
    source: path.relative(cwd, resolverPath),
    ...(namespace ? { namespace } : {}),
    ...(brand ? { brand } : {}),
    tokenLayers: tokenLayerDefs,
    targets: {
      css: {
        includeLayerRole: "public",
        ...(typeof cssBuildDefs?.layer === "string" &&
        cssBuildDefs.layer.length > 0
          ? { layer: cssBuildDefs.layer }
          : {}),
        ...(Array.isArray(cssBuildDefs?.layerOrder) &&
        cssBuildDefs.layerOrder.length > 0
          ? { layerOrder: cssBuildDefs.layerOrder }
          : {}),
      },
    },
    blocks,
  };

  await fs.writeFile(
    outTokensPath,
    `${JSON.stringify(contextsDoc, null, 2)}\n`,
    "utf8",
  );
  await fs.writeFile(
    outManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log(`Wrote SD context tokens: ${path.relative(cwd, outTokensPath)}`);
  console.log(`Wrote SD manifest: ${path.relative(cwd, outManifestPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
