#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function parseArgs(argv) {
  const args = {
    resolver: "tokens/resolver/msrd.resolver.json",
    outTokens: "tokens/dist/json/clbr.msrd.contexts.json",
    outManifest: "tokens/build/sd/clbr.msrd.css-manifest.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--out-tokens") args.outTokens = argv[i + 1];
    if (arg === "--out-manifest") args.outManifest = argv[i + 1];
  }

  return args;
}

const cli = parseArgs(process.argv.slice(2));
const resolverPath = path.resolve(cwd, cli.resolver);
const outTokensPath = path.resolve(cwd, cli.outTokens);
const outManifestPath = path.resolve(cwd, cli.outManifest);
const tmpDir = path.join(cwd, "tokens", "build", "tmp");

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

function getResolutionModifierNames(resolverDoc) {
  const refs = Array.isArray(resolverDoc?.resolutionOrder) ? resolverDoc.resolutionOrder : [];
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

function contextId(context, modifierOrder) {
  return modifierOrder
    .map((modifierName) => {
      const value = context?.[modifierName];
      if (value === undefined) {
        throw new Error(`Context is missing modifier "${modifierName}" required by resolutionOrder.`);
      }
      return String(value);
    })
    .join("-");
}

function parseAliasRef(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function toCssDimensionValue(rawValue) {
  if (typeof rawValue === "string") return rawValue;
  if (rawValue && typeof rawValue === "object") {
    const value = rawValue.value;
    const unit = rawValue.unit;
    if ((typeof value === "number" || typeof value === "string") && typeof unit === "string") {
      return `${value}${unit}`;
    }
  }
  return null;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTokenObject(value) {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, "$value");
}

function deepMerge(target, source) {
  if (Array.isArray(source)) return source.slice();
  if (!isObject(source)) return source;
  const out = isObject(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(out[key])) out[key] = deepMerge(out[key], value);
    else out[key] = deepMerge(undefined, value);
  }
  return out;
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pruneUnchanged(sourceNode, baseNode) {
  if (!isObject(sourceNode)) return sourceNode;

  if (isTokenObject(sourceNode)) {
    if (isTokenObject(baseNode) && deepEqual(sourceNode.$value, baseNode.$value)) {
      return null;
    }
    return sourceNode;
  }

  const out = {};

  for (const [key, value] of Object.entries(sourceNode)) {
    if (key.startsWith("$")) continue;
    const pruned = pruneUnchanged(value, isObject(baseNode) ? baseNode[key] : undefined);
    if (pruned !== null) out[key] = pruned;
  }

  if (Object.keys(out).length === 0) return null;

  for (const [key, value] of Object.entries(sourceNode)) {
    if (key.startsWith("$")) out[key] = value;
  }

  return out;
}

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

function resolveAliasValues(node, lookupRoot, stack = []) {
  const resolveValue = (value, localStack) => {
    if (Array.isArray(value)) return value.map((item) => resolveValue(item, localStack));
    if (isObject(value)) {
      const out = {};
      for (const [k, v] of Object.entries(value)) out[k] = resolveValue(v, localStack);
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
          throw new Error(`Alias target not found while resolving context token: {${alias}}`);
        }
        if (isObject(target) && Object.prototype.hasOwnProperty.call(target, "$value")) {
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

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

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

function inferCssAxes(modifierOrder, modifierBuildDefs) {
  const overlayAxes = modifierOrder.filter((modifierName) =>
    isObject(modifierBuildDefs?.[modifierName]?.scope),
  );
  const baseAxes = modifierOrder.filter((modifierName) => !overlayAxes.includes(modifierName));

  if (baseAxes.length === 0) {
    throw new Error("Resolver css build metadata requires at least one non-overlay modifier.");
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

async function resolveContextSources(ctx, modifierOrder) {
  const id = contextId(ctx, modifierOrder);
  const contextPath = path.join(tmpDir, `${id}.context.json`);
  const sourcesPath = path.join(tmpDir, `${id}.sources.json`);

  await fs.writeFile(contextPath, `${JSON.stringify(ctx, null, 2)}\n`, "utf8");

  run("node", [
    "tokens/scripts/resolve-token-sources.mjs",
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

async function buildMergedDoc(id, sources) {
  const sourcesPath = path.join(tmpDir, `${id}.merge.sources.json`);
  const tokensPath = path.join(tmpDir, `${id}.merge.tokens.json`);

  await fs.writeFile(sourcesPath, `${JSON.stringify({ sources }, null, 2)}\n`, "utf8");

  run("node", [
    "tokens/scripts/prepare-sd-sources.mjs",
    "--sources-file",
    path.relative(cwd, sourcesPath),
    "--resolver",
    path.relative(cwd, resolverPath),
    "--out-file",
    path.relative(cwd, tokensPath),
  ]);

  return readJson(tokensPath);
}

function getAxisDefault(modifierDoc, contexts) {
  return modifierDoc?.default ?? contexts[0];
}

function resolveAliasOrLiteral(value, lookupRoot, seen = new Set()) {
  if (typeof value !== "string") return value;
  const alias = parseAliasRef(value);
  if (!alias) return value;
  if (seen.has(alias)) {
    throw new Error(`Alias cycle detected while resolving media condition: ${Array.from(seen).join(" -> ")} -> ${alias}`);
  }
  const target = getByDottedPath(lookupRoot, alias);
  if (target === undefined) {
    throw new Error(`Alias target not found while resolving media condition: {${alias}}`);
  }
  const nextSeen = new Set(seen);
  nextSeen.add(alias);
  if (isObject(target) && Object.prototype.hasOwnProperty.call(target, "$value")) {
    return resolveAliasOrLiteral(target.$value, lookupRoot, nextSeen);
  }
  return resolveAliasOrLiteral(target, lookupRoot, nextSeen);
}

function resolveMediaSpec(spec, lookupRoot) {
  if (spec == null) return null;

  if (typeof spec === "string") {
    const resolved = resolveAliasOrLiteral(spec, lookupRoot);
    if (typeof resolved === "string" && resolved.trim().startsWith("(")) return resolved;
    const dimension = toCssDimensionValue(resolved);
    if (dimension) return `(min-width: ${dimension})`;
    throw new Error(`Unsupported mediaByContext string spec: ${spec}`);
  }

  if (isObject(spec)) {
    if (typeof spec.query === "string") return spec.query;
    if (Object.prototype.hasOwnProperty.call(spec, "minWidth")) {
      const minWidthValue = resolveAliasOrLiteral(spec.minWidth, lookupRoot);
      const dimension = toCssDimensionValue(minWidthValue);
      if (!dimension) {
        throw new Error(`Unsupported minWidth media spec value: ${JSON.stringify(spec.minWidth)}`);
      }
      return `(min-width: ${dimension})`;
    }
  }

  throw new Error(`Unsupported mediaByContext spec: ${JSON.stringify(spec)}`);
}

function resolveMediaByContext(contexts, defaultContext, mediaByContext, lookupRoot) {
  const out = {};
  for (const context of contexts) {
    if (context === defaultContext) {
      out[context] = null;
      continue;
    }
    const spec = mediaByContext?.[context];
    out[context] = spec == null ? null : resolveMediaSpec(spec, lookupRoot);
  }
  return out;
}

function buildContextMediaMap(contexts, defaultContext, modifierDef, lookupRoot) {
  const mediaByContext = {};
  for (const context of contexts) {
    const media = modifierDef?.contexts?.[context]?.media;
    if (!Array.isArray(media) || media.length === 0) continue;
    const resolved = media
      .map((entry) => resolveMediaSpec(entry, lookupRoot))
      .filter((value) => typeof value === "string" && value.length > 0);
    if (resolved.length > 0) mediaByContext[context] = resolved.join(" and ");
  }
  return resolveMediaByContext(contexts, defaultContext, mediaByContext, lookupRoot);
}

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

function resolveSelectorFromSpec(spec, contextName, selectorsMap = {}, naming = {}) {
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

function resolveMediaList(spec, lookupRoot) {
  const media = spec?.media;
  if (!Array.isArray(media) || media.length === 0) return [];
  return media
    .map((entry) => resolveMediaSpec(entry, lookupRoot))
    .filter((value) => typeof value === "string" && value.length > 0);
}

function mergeScope(defaultScope, overrideScope) {
  if (!isObject(defaultScope) && !isObject(overrideScope)) return null;
  if (!isObject(defaultScope)) return overrideScope;
  if (!isObject(overrideScope)) return defaultScope;
  return { ...defaultScope, ...overrideScope };
}

function resolveContextEmitTargets(modifierDef, contextName, selectorsMap = {}, naming = {}, lookupRoot) {
  const ctx = modifierDef?.contexts?.[contextName] ?? {};
  const variantDefaultsScope = isObject(modifierDef?.variantDefaults?.scope)
    ? modifierDef.variantDefaults.scope
    : null;
  const out = [];

  const baseSelector = resolveSelectorFromSpec(ctx, contextName, selectorsMap, naming);
  if (baseSelector) {
    out.push({
      kind: "base",
      selector: baseSelector,
      media: resolveMediaList(ctx, lookupRoot),
    });
  }

  const variants = Array.isArray(ctx.variants) ? ctx.variants : [];
  for (const variant of variants) {
    const selector = resolveSelectorFromSpec(variant, contextName, selectorsMap, naming);
    if (!selector) continue;
    out.push({
      kind: "variant",
      variantName:
        typeof variant.name === "string" && variant.name.length > 0 ? variant.name : undefined,
      deltaFromContext:
        typeof variant.deltaFromContext === "string" && variant.deltaFromContext.length > 0
          ? variant.deltaFromContext
          : null,
      scope: mergeScope(
        variantDefaultsScope,
        isObject(variant.scope) ? variant.scope : null,
      ),
      selector,
      media: resolveMediaList(variant, lookupRoot),
    });
  }

  return out;
}

function buildBaseContext(modifierOrder, modifiers, overrides = {}) {
  const out = {};
  for (const modifierName of modifierOrder) {
    const modifierDoc = modifiers?.[modifierName];
    const contexts = Object.keys(modifierDoc?.contexts ?? {});
    if (contexts.length === 0) {
      throw new Error(`Modifier "${modifierName}" has no contexts.`);
    }
    out[modifierName] = overrides[modifierName] ?? getAxisDefault(modifierDoc, contexts);
  }
  return out;
}

function matchesScope(selection, scope) {
  if (!isObject(scope)) return true;
  for (const [axis, allowed] of Object.entries(scope)) {
    if (!Array.isArray(allowed) || allowed.length === 0) continue;
    if (!allowed.includes(selection[axis])) return false;
  }
  return true;
}

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
    typeof buildDefs?.namespace === "string" && buildDefs.namespace.trim().length > 0
      ? buildDefs.namespace.trim()
      : null;
  const brand =
    typeof buildDefs?.brand === "string" && buildDefs.brand.trim().length > 0
      ? buildDefs.brand.trim()
      : null;
  const cssBuildDefs = buildDefs?.targets?.css;
  const layerDefs = buildDefs?.layers ?? {};
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
  const defaultResponsive = getAxisDefault(responsiveModifier, responsiveContexts);
  const responsiveDef = modifierBuildDefs?.[responsiveAxis] ?? null;

  const fullDocsByContextId = new Map();

  const getFullDoc = async (ctx) => {
    const id = contextId(ctx, modifierOrder);
    if (fullDocsByContextId.has(id)) return fullDocsByContextId.get(id);
    const sources = await resolveContextSources(ctx, modifierOrder);
    const doc = await buildMergedDoc(id, sources);
    fullDocsByContextId.set(id, doc);
    return doc;
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
      // eslint-disable-next-line no-await-in-loop
      await getFullDoc(ctx);
    }
  }

  const defaultContextDocId = contextId(buildBaseContext(modifierOrder, modifiers), modifierOrder);
  const mediaLookupRoot = fullDocsByContextId.get(defaultContextDocId);
  if (!mediaLookupRoot) {
    throw new Error(`Unable to resolve default context document for media lookup: ${defaultContextDocId}`);
  }
  const responsiveMedia = buildContextMediaMap(
    responsiveContexts,
    defaultResponsive,
    responsiveDef,
    mediaLookupRoot,
  );

  const contextsRoot = {};
  const blocks = [];
  const offEffectiveByContextId = new Map();
  const offOwnOverlayBySurface = new Map();
  for (const surfaceContext of surfaceContexts) offOwnOverlayBySurface.set(surfaceContext, {});

  for (const responsiveContext of responsiveContexts) {
    const deferredVariantBlocks = [];
    for (const surfaceContext of surfaceOrder) {
      const ctx = buildBaseContext(modifierOrder, modifiers, {
        [surfaceAxis]: surfaceContext,
        [responsiveAxis]: responsiveContext,
        ...defaultStateByAxis,
      });
      const id = contextId(ctx, modifierOrder);
      const fullDoc = fullDocsByContextId.get(id);
      const def = surfaceDefs?.[surfaceContext];
      const baseSurface = def?.baseContext ?? null;
      const baseDoc = baseSurface
        ? offEffectiveByContextId.get(
            contextId(
              buildBaseContext(modifierOrder, modifiers, {
                [surfaceAxis]: baseSurface,
                [responsiveAxis]: responsiveContext,
                ...defaultStateByAxis,
              }),
              modifierOrder,
            ),
          ) || {}
        : {};
      const ownOverlay = offOwnOverlayBySurface.get(surfaceContext) || {};
      const comparisonBase = deepMerge(baseDoc, ownOverlay);

      const prunedRaw = pruneUnchanged(fullDoc, comparisonBase);
      let emittedRaw = null;
      if (prunedRaw && Object.keys(prunedRaw).length > 0) {
        emittedRaw = prunedRaw;

        const emitTargets = resolveContextEmitTargets(
          modifierBuildDefs?.[surfaceAxis],
          surfaceContext,
          resolvedSelectorDefs,
          { namespace, brand },
          mediaLookupRoot,
        );
        let variantIndex = 0;
        for (const target of emitTargets) {
          if (target.kind === "variant" && target.scope && !matchesScope(ctx, target.scope)) {
            continue;
          }
          let blockId = id;
          let blockDocRaw = emittedRaw;

          if (target.kind === "variant" && target.deltaFromContext) {
            const compareCtx = buildBaseContext(modifierOrder, modifiers, {
              [surfaceAxis]: target.deltaFromContext,
              [responsiveAxis]: responsiveContext,
              ...defaultStateByAxis,
            });
            // eslint-disable-next-line no-await-in-loop
            const compareDoc = await getFullDoc(compareCtx);
            const variantRaw = pruneUnchanged(fullDoc, compareDoc);
            blockDocRaw = variantRaw && Object.keys(variantRaw).length > 0 ? variantRaw : null;
            if (!blockDocRaw) continue;
            variantIndex += 1;
            blockId = `${id}__variant${variantIndex}`;
            contextsRoot[blockId] = resolveAliasValues(blockDocRaw, fullDoc);
          }

          if (target.kind === "base") {
            contextsRoot[blockId] = resolveAliasValues(blockDocRaw, fullDoc);
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

      if (emittedRaw) {
        offOwnOverlayBySurface.set(surfaceContext, deepMerge(ownOverlay, emittedRaw));
      }
      const nextOverlay = offOwnOverlayBySurface.get(surfaceContext) || {};
      offEffectiveByContextId.set(id, deepMerge(baseDoc, nextOverlay));
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
      Array.isArray(scopeDef[responsiveAxis]) && scopeDef[responsiveAxis].length > 0
        ? scopeDef[responsiveAxis]
        : [defaultResponsive];
    const mediaByStateContext = buildContextMediaMap(
      stateContexts,
      defaultState,
      stateDef,
      mediaLookupRoot,
    );

    for (const stateContext of emitContexts) {
      const stateEffectiveBySurface = new Map();
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
          const onFullDoc = await getFullDoc(onCtx);

          const surfaceBuildDef = surfaceDefs?.[surfaceContext];
          const baseSurface = surfaceBuildDef?.baseContext ?? null;
          const offDoc = offEffectiveByContextId.get(
            contextId(
              buildBaseContext(modifierOrder, modifiers, {
                [surfaceAxis]: surfaceContext,
                [responsiveAxis]: responsiveContext,
                ...defaultStateByAxis,
                [stateAxis]: defaultState,
              }),
              modifierOrder,
            ),
          ) || {};
          const baseStateDoc =
            baseSurface && surfaceScopeSet.has(baseSurface)
              ? stateEffectiveBySurface.get(baseSurface) || {}
              : {};
          const comparisonBase = deepMerge(baseStateDoc, offDoc);
          const prunedRaw = pruneUnchanged(onFullDoc, comparisonBase);
          const emittedRaw = prunedRaw && Object.keys(prunedRaw).length > 0 ? prunedRaw : null;

          if (!emittedRaw) {
            stateEffectiveBySurface.set(surfaceContext, comparisonBase);
            continue;
          }

          const emitTargets = resolveContextEmitTargets(
            modifierBuildDefs?.[surfaceAxis],
            surfaceContext,
            resolvedSelectorDefs,
            { namespace, brand },
            mediaLookupRoot,
          );
          let variantIndex = 0;
          for (const target of emitTargets) {
            if (target.kind === "variant" && target.scope && !matchesScope(onCtx, target.scope)) {
              continue;
            }
            let blockId = onId;
            let blockDocRaw = emittedRaw;

            if (target.kind === "variant" && target.deltaFromContext) {
              const compareCtx = buildBaseContext(modifierOrder, modifiers, {
                [surfaceAxis]: target.deltaFromContext,
                [responsiveAxis]: responsiveContext,
                ...defaultStateByAxis,
                [stateAxis]: stateContext,
              });
              // eslint-disable-next-line no-await-in-loop
              const compareDoc = await getFullDoc(compareCtx);
              const variantRaw = pruneUnchanged(onFullDoc, compareDoc);
              blockDocRaw = variantRaw && Object.keys(variantRaw).length > 0 ? variantRaw : null;
              if (!blockDocRaw) continue;
              variantIndex += 1;
              blockId = `${onId}__variant${variantIndex}`;
              contextsRoot[blockId] = resolveAliasValues(blockDocRaw, onFullDoc);
            }

            if (target.kind === "base") {
              contextsRoot[blockId] = resolveAliasValues(blockDocRaw, onFullDoc);
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

          stateEffectiveBySurface.set(surfaceContext, deepMerge(comparisonBase, emittedRaw));
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
    layers: layerDefs,
    targets: {
      css: {
        includeLayerRole: "public",
      },
    },
    blocks,
  };

  await fs.writeFile(outTokensPath, `${JSON.stringify(contextsDoc, null, 2)}\n`, "utf8");
  await fs.writeFile(outManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await fs.rm(tmpDir, { recursive: true, force: true });

  // eslint-disable-next-line no-console
  console.log(`Wrote SD context tokens: ${path.relative(cwd, outTokensPath)}`);
  // eslint-disable-next-line no-console
  console.log(`Wrote SD manifest: ${path.relative(cwd, outManifestPath)}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});
