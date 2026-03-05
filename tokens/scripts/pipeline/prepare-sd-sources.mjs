#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
function parseArgs(argv) {
  const args = {
    sourcesFile: null,
    outFile: null,
    resolver: "tokens/resolver/msrd.resolver.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--sources-file") args.sourcesFile = argv[i + 1];
    if (arg === "--out-file") args.outFile = argv[i + 1];
    if (arg === "--resolver") args.resolver = argv[i + 1];
  }

  if (!args.sourcesFile || !args.outFile) {
    throw new Error(
      "Usage: node tokens/scripts/pipeline/prepare-sd-sources.mjs --sources-file <sources.json> --out-file <tokens.json>",
    );
  }

  return args;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function parsePointer(pointer) {
  if (!pointer || pointer === "#") return [];
  if (!pointer.startsWith("#/")) throw new Error(`Unsupported JSON pointer: ${pointer}`);
  return pointer
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function getPath(obj, segments) {
  let current = obj;
  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;
    current = current[segment];
    if (current === undefined) return undefined;
  }
  return current;
}

async function resolveRefsInDocument(value, ownerFile, loader, stack = []) {
  if (Array.isArray(value)) {
    const items = [];
    for (const item of value) {
      // eslint-disable-next-line no-await-in-loop
      items.push(await resolveRefsInDocument(item, ownerFile, loader, stack));
    }
    return items;
  }
  if (!isObject(value)) return value;

  const keys = Object.keys(value);
  if (keys.length === 1 && keys[0] === "$ref") {
    const ref = value.$ref;
    const [filePart, pointerPart] = ref.split("#");
    const pointer = pointerPart ? `#${pointerPart}` : "#";
    const targetFile = filePart ? path.resolve(path.dirname(ownerFile), filePart) : ownerFile;
    const stackKey = `${ownerFile}->${ref}`;
    if (stack.includes(stackKey)) {
      throw new Error(`$ref cycle detected: ${stack.concat(stackKey).join(" | ")}`);
    }
    const targetDoc = await loader(targetFile);
    const targetValue = getPath(targetDoc, parsePointer(pointer));
    if (targetValue === undefined) {
      throw new Error(`$ref target not found: ${ref} (from ${ownerFile})`);
    }
    return resolveRefsInDocument(targetValue, targetFile, loader, stack.concat(stackKey));
  }

  const out = {};
  for (const [key, child] of Object.entries(value)) {
    // eslint-disable-next-line no-await-in-loop
    out[key] = await resolveRefsInDocument(child, ownerFile, loader, stack);
  }
  return out;
}

function normalizePublicLayerAliases(node, domain, localRootKeys, semanticDomainRoots, knownLayers) {
  const normalizeAliasString = (raw) => {
    const exactAlias = raw.match(/^\{([^}]+)\}$/);
    if (!exactAlias) return raw;
    const aliasPath = exactAlias[1];
    const first = aliasPath.split(".")[0];
    if (
      knownLayers.has(first) ||
      semanticDomainRoots.has(first) ||
      !localRootKeys.has(first)
    ) {
      return raw;
    }
    return `{${domain}.${aliasPath}}`;
  };

  const visit = (value) => {
    if (Array.isArray(value)) return value.map(visit);
    if (!isObject(value)) return typeof value === "string" ? normalizeAliasString(value) : value;
    const out = {};
    for (const [key, child] of Object.entries(value)) out[key] = visit(child);
    return out;
  };

  return visit(node);
}

async function discoverSemanticDomainRoots() {
  const root = path.join(cwd, "tokens", "src");
  const domains = new Set();

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        await walk(full);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const rel = path.relative(root, full).replaceAll(path.sep, "/");
      const parts = rel.split("/");
      const semanticIndex = parts.indexOf("semantic");
      if (semanticIndex === -1) continue;
      const next = parts[semanticIndex + 1];
      if (!next) continue;
      const domain = next.endsWith(".tokens.json")
        ? path.basename(next, ".tokens.json")
        : next;
      domains.add(domain);
    }
  }

  await walk(root);
  return domains;
}

function normalizeDtcgValueObjects(node) {
  if (Array.isArray(node)) return node.map(normalizeDtcgValueObjects);
  if (!isObject(node)) return node;

  if (
    Object.prototype.hasOwnProperty.call(node, "$value") &&
    isObject(node.$value) &&
    Object.prototype.hasOwnProperty.call(node.$value, "value") &&
    Object.prototype.hasOwnProperty.call(node.$value, "unit")
  ) {
    const { value, unit } = node.$value;
    if ((typeof value === "number" || typeof value === "string") && typeof unit === "string") {
      node.$value = `${value}${unit}`;
    }
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    node[key] = normalizeDtcgValueObjects(child);
  }
  return node;
}

function deriveLayerAndDomain(relPath, knownLayers) {
  const parts = relPath.split("/");
  const layerIndex = parts.findIndex((part) => knownLayers.has(part));
  if (layerIndex === -1) throw new Error(`Cannot infer layer/domain for source: ${relPath}`);
  const layer = parts[layerIndex];
  const next = parts[layerIndex + 1];
  if (!next) throw new Error(`Cannot infer domain for source: ${relPath}`);
  const domain = next.endsWith(".tokens.json") ? path.basename(next, ".tokens.json") : next;
  let subdomain = null;
  if (layer === "component") {
    const maybeSubdomain = parts[layerIndex + 2];
    if (typeof maybeSubdomain === "string" && maybeSubdomain.length > 0) {
      subdomain = maybeSubdomain.endsWith(".tokens.json")
        ? path.basename(maybeSubdomain, ".tokens.json")
        : maybeSubdomain;
    }
  }
  return { layer, domain, subdomain };
}

async function buildMergedTokenObject(sources, layerConfig) {
  const rawCache = new Map();
  const resolvedCache = new Map();

  const loadRaw = async (filePath) => {
    const full = path.resolve(cwd, filePath);
    if (rawCache.has(full)) return rawCache.get(full);
    const doc = JSON.parse(await fs.readFile(full, "utf8"));
    rawCache.set(full, doc);
    return doc;
  };

  const loadResolved = async (filePath) => {
    const full = path.resolve(cwd, filePath);
    if (resolvedCache.has(full)) return resolvedCache.get(full);
    const raw = await loadRaw(filePath);
    const resolved = await resolveRefsInDocument(raw, full, loadRaw);
    resolvedCache.set(full, resolved);
    return resolved;
  };

  let merged = {};
  const semanticDomainRoots = await discoverSemanticDomainRoots();
  const knownLayers = new Set([...(layerConfig?.private ?? []), ...(layerConfig?.public ?? [])]);
  const privateLayers = new Set(layerConfig?.private ?? []);
  const publicLayers = new Set(layerConfig?.public ?? []);
  if (knownLayers.size === 0) {
    throw new Error("Resolver build.tokenLayers is required and cannot be empty.");
  }
  for (const sourcePath of sources) {
    // eslint-disable-next-line no-await-in-loop
    const resolvedDoc = await loadResolved(sourcePath);
    const relPath = sourcePath.replaceAll(path.sep, "/");
    const { layer, domain, subdomain } = deriveLayerAndDomain(relPath, knownLayers);

    const docBody = Object.fromEntries(
      Object.entries(resolvedDoc).filter(([k]) => k !== "$schema"),
    );
    const localRootKeys = new Set(
      Object.keys(docBody).filter((key) => !key.startsWith("$")),
    );

    const normalizedDoc =
      publicLayers.has(layer)
        ? normalizePublicLayerAliases(
            docBody,
            domain,
            localRootKeys,
            semanticDomainRoots,
            knownLayers,
          )
        : docBody;

    const wrapped =
      privateLayers.has(layer)
        ? { [layer]: { [domain]: normalizedDoc } }
        : layer === "component" && typeof subdomain === "string" && subdomain.length > 0
          ? { [domain]: { [subdomain]: normalizedDoc } }
          : { [domain]: normalizedDoc };

    merged = deepMerge(merged, wrapped);
  }

  return normalizeDtcgValueObjects(merged);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourcesDoc = JSON.parse(await fs.readFile(path.resolve(cwd, args.sourcesFile), "utf8"));
  const resolverDoc = JSON.parse(await fs.readFile(path.resolve(cwd, args.resolver), "utf8"));
  const layerConfig = resolverDoc?.$defs?.build?.tokenLayers;
  if (!isObject(layerConfig)) {
    throw new Error("Resolver missing $defs.build.tokenLayers metadata.");
  }

  if (!Array.isArray(sourcesDoc.sources)) {
    throw new Error(`Expected sources array in: ${args.sourcesFile}`);
  }

  const merged = await buildMergedTokenObject(sourcesDoc.sources, layerConfig);
  const outFull = path.resolve(cwd, args.outFile);
  await fs.mkdir(path.dirname(outFull), { recursive: true });
  await fs.writeFile(outFull, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});
