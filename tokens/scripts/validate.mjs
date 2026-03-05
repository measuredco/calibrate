#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const TOKENS_SRC_DIR = path.join(cwd, "tokens", "src");
const TOKENS_RESOLVER_DIR = path.join(cwd, "tokens", "resolver");
const TMP_VALIDATE_DIR = path.join(cwd, "tokens", "build", "tmp", "validate");

function rel(file) {
  return path.relative(cwd, file).replaceAll(path.sep, "/");
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });
  if (result.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed.\n${result.stdout || ""}\n${result.stderr || ""}`,
    );
  }
  return result;
}

async function listFiles(rootDir, predicate) {
  const out = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (predicate(full)) {
        out.push(full);
      }
    }
  }

  await walk(rootDir);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

function checkSchemaRefPath(filePath, schemaRef, expectedSchemaTail, errors) {
  if (typeof schemaRef !== "string" || schemaRef.length === 0) {
    errors.push(`${rel(filePath)}: missing or invalid "$schema"`);
    return;
  }

  if (schemaRef.startsWith("http://") || schemaRef.startsWith("https://")) {
    errors.push(
      `${rel(filePath)}: "$schema" must be local vendored path, got remote URL`,
    );
    return;
  }

  const resolved = path.resolve(path.dirname(filePath), schemaRef);
  if (!resolved.endsWith(expectedSchemaTail)) {
    errors.push(
      `${rel(filePath)}: "$schema" should resolve to "${expectedSchemaTail}", got "${schemaRef}"`,
    );
  }
}

async function validateTokenFile(filePath, errors) {
  let doc;
  try {
    doc = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${rel(filePath)}: invalid JSON (${error.message})`);
    return;
  }

  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    errors.push(`${rel(filePath)}: top-level must be a JSON object`);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(doc, "")) {
    errors.push(
      `${rel(filePath)}: invalid empty-string key found at top level`,
    );
  }

  checkSchemaRefPath(
    filePath,
    doc.$schema,
    `${path.sep}tokens${path.sep}schemas${path.sep}2025.10${path.sep}format.json`,
    errors,
  );

  if (typeof doc.$schema === "string" && !doc.$schema.startsWith("http")) {
    const resolved = path.resolve(path.dirname(filePath), doc.$schema);
    try {
      await fs.access(resolved);
    } catch {
      errors.push(
        `${rel(filePath)}: "$schema" path not found (${doc.$schema})`,
      );
    }
  }
}

async function validateResolverFile(filePath, errors) {
  let doc;
  try {
    doc = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${rel(filePath)}: invalid JSON (${error.message})`);
    return;
  }

  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    errors.push(`${rel(filePath)}: top-level must be a JSON object`);
    return;
  }

  checkSchemaRefPath(
    filePath,
    doc.$schema,
    `${path.sep}tokens${path.sep}schemas${path.sep}2025.10${path.sep}resolver.json`,
    errors,
  );

  if (typeof doc.$schema === "string" && !doc.$schema.startsWith("http")) {
    const resolved = path.resolve(path.dirname(filePath), doc.$schema);
    try {
      await fs.access(resolved);
    } catch {
      errors.push(
        `${rel(filePath)}: "$schema" path not found (${doc.$schema})`,
      );
    }
  }

  if (doc.version !== "2025.10") {
    errors.push(`${rel(filePath)}: resolver "version" must be "2025.10"`);
  }

  if (!Array.isArray(doc.resolutionOrder) || doc.resolutionOrder.length === 0) {
    errors.push(
      `${rel(filePath)}: resolver must define non-empty "resolutionOrder"`,
    );
  }

  if (typeof doc.modifiers !== "object" || doc.modifiers === null) {
    errors.push(`${rel(filePath)}: resolver must define "modifiers" object`);
    return;
  }

  const modifierNames = new Set(Object.keys(doc.modifiers));
  for (const entry of doc.resolutionOrder ?? []) {
    const ref = entry?.$ref;
    const match =
      typeof ref === "string" ? ref.match(/^#\/modifiers\/(.+)$/) : null;
    if (!match) continue;
    if (!modifierNames.has(match[1])) {
      errors.push(
        `${rel(filePath)}: resolutionOrder references missing modifier "${match[1]}"`,
      );
    }
  }
}

function ensureNoResolverSelectionErrors(resolverFiles, errors) {
  for (const resolverPath of resolverFiles) {
    const base = path.basename(resolverPath, ".resolver.json");
    const outTokens = path.join(TMP_VALIDATE_DIR, `${base}.contexts.json`);
    const outManifest = path.join(
      TMP_VALIDATE_DIR,
      `${base}.css-manifest.json`,
    );
    try {
      run("node", [
        "tokens/scripts/pipeline/prepare-sd-contexts.mjs",
        "--resolver",
        rel(resolverPath),
        "--out-tokens",
        rel(outTokens),
        "--out-manifest",
        rel(outManifest),
      ]);
    } catch (error) {
      errors.push(
        `${rel(resolverPath)}: failed context preparation (possible unresolved alias or cycle)\n${error.message}`,
      );
    }
  }
}

async function main() {
  const errors = [];

  const tokenFiles = await listFiles(TOKENS_SRC_DIR, (filePath) =>
    filePath.endsWith(".json"),
  );

  const resolverFiles = await listFiles(TOKENS_RESOLVER_DIR, (filePath) =>
    filePath.endsWith(".resolver.json"),
  );

  for (const tokenFile of tokenFiles) {
    await validateTokenFile(tokenFile, errors);
  }

  for (const resolverFile of resolverFiles) {
    await validateResolverFile(resolverFile, errors);
  }

  ensureNoResolverSelectionErrors(resolverFiles, errors);

  if (errors.length > 0) {
    console.error("Token validation failed:");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated ${tokenFiles.length} token files and ${resolverFiles.length} resolver files.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
