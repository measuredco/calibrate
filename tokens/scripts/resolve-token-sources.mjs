#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();

function parseArgs(argv) {
  const args = {
    resolver: null,
    context: null,
    out: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--context") args.context = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
  }

  if (!args.resolver || !args.context || !args.out) {
    throw new Error(
      "Usage: node tokens/scripts/resolve-token-sources.mjs --resolver <resolver.json> --context <context.json> --out <sources.json>",
    );
  }

  return args;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePointer(pointer) {
  if (!pointer.startsWith("#/")) throw new Error(`Unsupported pointer: ${pointer}`);
  return pointer
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function getByPointer(root, pointer) {
  const segments = parsePointer(pointer);
  let current = root;
  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;
    current = current[segment];
    if (current === undefined) return undefined;
  }
  return current;
}

function normalizeRef(baseFile, ref) {
  if (ref.startsWith("#/")) return ref;
  const fileOnly = ref.split("#")[0];
  const abs = path.resolve(path.dirname(baseFile), fileOnly);
  return path.relative(cwd, abs).replaceAll(path.sep, "/");
}

function pushUnique(list, seen, value) {
  if (seen.has(value)) return;
  seen.add(value);
  list.push(value);
}

function resolveSourceArray({
  resolverDoc,
  resolverPath,
  sourceArray,
  output,
  seen,
  stack,
}) {
  for (const source of sourceArray) {
    if (!isObject(source)) {
      throw new Error("Unsupported non-object source entry in resolver.");
    }

    if (Object.prototype.hasOwnProperty.call(source, "$ref")) {
      const ref = source.$ref;
      if (typeof ref !== "string") {
        throw new Error("Source $ref must be a string.");
      }

      if (!ref.startsWith("#/")) {
        pushUnique(output, seen, normalizeRef(resolverPath, ref));
        continue;
      }

      if (stack.includes(ref)) {
        throw new Error(`Circular internal resolver reference: ${stack.join(" -> ")} -> ${ref}`);
      }

      const target = getByPointer(resolverDoc, ref);
      if (!target) throw new Error(`Resolver internal reference not found: ${ref}`);

      // Set reference.
      if (ref.startsWith("#/sets/")) {
        if (!Array.isArray(target.sources)) {
          throw new Error(`Set ${ref} has no sources array.`);
        }
        resolveSourceArray({
          resolverDoc,
          resolverPath,
          sourceArray: target.sources,
          output,
          seen,
          stack: [...stack, ref],
        });
        continue;
      }

      // Modifier reference in resolutionOrder.
      if (ref.startsWith("#/modifiers/")) {
        throw new Error(
          `Unexpected modifier ref inside source array: ${ref}. Modifiers are only resolved via resolutionOrder.`,
        );
      }

      throw new Error(`Unsupported internal resolver reference: ${ref}`);
    } else {
      // Inline tokens are valid per spec, but cannot be passed as SD source paths.
      throw new Error(
        "Inline token sources are not supported by this adapter yet; use file or set references.",
      );
    }
  }
}

function resolveOrderedSources({ resolverDoc, resolverPath, contextInput }) {
  if (!Array.isArray(resolverDoc.resolutionOrder)) {
    throw new Error("Resolver must include resolutionOrder array.");
  }

  const output = [];
  const seen = new Set();

  for (const item of resolverDoc.resolutionOrder) {
    if (!isObject(item) || typeof item.$ref !== "string") {
      throw new Error("resolutionOrder entries must be $ref objects.");
    }

    const ref = item.$ref;
    if (!ref.startsWith("#/modifiers/") && !ref.startsWith("#/sets/")) {
      throw new Error(`Unsupported resolutionOrder ref: ${ref}`);
    }

    if (ref.startsWith("#/sets/")) {
      const setObj = getByPointer(resolverDoc, ref);
      if (!setObj || !Array.isArray(setObj.sources)) {
        throw new Error(`Set in resolutionOrder has no sources: ${ref}`);
      }
      resolveSourceArray({
        resolverDoc,
        resolverPath,
        sourceArray: setObj.sources,
        output,
        seen,
        stack: [ref],
      });
      continue;
    }

    const modifierObj = getByPointer(resolverDoc, ref);
    if (!modifierObj || !isObject(modifierObj.contexts)) {
      throw new Error(`Modifier in resolutionOrder has no contexts: ${ref}`);
    }

    const modifierName = ref.split("/").at(-1);
    const selected = contextInput[modifierName] ?? modifierObj.default;
    if (typeof selected !== "string" || selected.length === 0) {
      throw new Error(`No selected context for modifier "${modifierName}" and no default provided.`);
    }

    const sourceArray = modifierObj.contexts[selected];
    if (!Array.isArray(sourceArray)) {
      throw new Error(
        `Modifier "${modifierName}" does not contain context "${selected}".`,
      );
    }

    resolveSourceArray({
      resolverDoc,
      resolverPath,
      sourceArray,
      output,
      seen,
      stack: [ref, `#/modifiers/${modifierName}/contexts/${selected}`],
    });
  }

  return output;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const resolverPath = path.resolve(cwd, args.resolver);
  const contextPath = path.resolve(cwd, args.context);

  const resolverDoc = JSON.parse(await fs.readFile(resolverPath, "utf8"));
  const contextInput = JSON.parse(await fs.readFile(contextPath, "utf8"));

  const orderedSources = resolveOrderedSources({
    resolverDoc,
    resolverPath,
    contextInput,
  });

  const payload = {
    resolver: path.relative(cwd, resolverPath).replaceAll(path.sep, "/"),
    context: path.relative(cwd, contextPath).replaceAll(path.sep, "/"),
    inputs: contextInput,
    sources: orderedSources,
  };

  if (args.out) {
    const outPath = path.resolve(cwd, args.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    // eslint-disable-next-line no-console
    console.log(`Wrote ordered sources to ${path.relative(cwd, outPath)}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload, null, 2));
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});
