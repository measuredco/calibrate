#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Pipeline entrypoint for building all resolver-discovered token targets.
 *
 * This script prepares context/manifest inputs, runs Style Dictionary for
 * public CSS output, derives a private manifest variant, and runs Style
 * Dictionary again for private primitive CSS output.
 */

const cwd = process.cwd();

/**
 * Builds a normalized POSIX-style path for stable CLI/env handoff.
 *
 * @param {...string} parts
 * @returns {string}
 */
function normalizePath(...parts) {
  return path.join(...parts).replaceAll(path.sep, "/");
}

/**
 * Derives output artifact paths for a resolver using naming conventions.
 *
 * @param {string} resolverPath
 * @param {Record<string, unknown>} resolverDoc
 * @returns {{
 *  key: string,
 *  resolver: string,
 *  out: string,
 *  outPrivate: string,
 *  contexts: string,
 *  manifest: string,
 *  manifestPrivate: string
 * }}
 */
function buildTargetConfigFromResolver(resolverPath, resolverDoc) {
  const resolverBase = path.basename(resolverPath);
  const resolverName = resolverBase.replace(/\.resolver\.json$/, "");
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const namespace =
    typeof buildDefs.namespace === "string" && buildDefs.namespace.length > 0
      ? buildDefs.namespace
      : "clbr";
  const brand =
    typeof buildDefs.brand === "string" && buildDefs.brand.length > 0
      ? buildDefs.brand
      : null;
  const outputKey = brand ?? resolverName;
  const fileBase = `${namespace}.${outputKey}`;

  return {
    key: outputKey,
    resolver: normalizePath("tokens", "resolver", resolverBase),
    out: normalizePath("tokens", "dist", "css", `${fileBase}.tokens.css`),
    outPrivate: normalizePath(
      "tokens",
      "dist",
      "private",
      "css",
      `${fileBase}.primitives.css`,
    ),
    contexts: normalizePath(
      "tokens",
      "build",
      "sd",
      `${fileBase}.contexts.json`,
    ),
    manifest: normalizePath(
      "tokens",
      "build",
      "sd",
      `${fileBase}.css-manifest.json`,
    ),
    manifestPrivate: normalizePath(
      "tokens",
      "build",
      "sd",
      `${fileBase}.css-private-manifest.json`,
    ),
  };
}

/**
 * Discovers resolver files and returns ordered build target configs.
 *
 * @returns {Promise<Array<{
 *  key: string,
 *  resolver: string,
 *  out: string,
 *  outPrivate: string,
 *  contexts: string,
 *  manifest: string,
 *  manifestPrivate: string
 * }>>}
 */
async function discoverBuildTargets() {
  const resolverDir = path.join(cwd, "tokens", "resolver");
  const entries = await fs.readdir(resolverDir, { withFileTypes: true });
  const resolvers = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".resolver.json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const targets = [];

  for (const resolverFile of resolvers) {
    const resolverPath = path.join(resolverDir, resolverFile);
    const resolverDoc = JSON.parse(await fs.readFile(resolverPath, "utf8"));
    targets.push(buildTargetConfigFromResolver(resolverPath, resolverDoc));
  }

  // Keep dependency-aware and deterministic build order: core first, then other targets alphabetically.
  targets.sort((a, b) => {
    if (a.key === "core") return -1;
    if (b.key === "core") return 1;
    return a.key.localeCompare(b.key);
  });

  return targets;
}

/**
 * Executes a command and throws with captured output on failure.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} [opts={}]
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
 * Writes a private CSS manifest variant from the public CSS manifest.
 *
 * @param {string} publicManifestPath
 * @param {string} privateManifestPath
 * @returns {Promise<void>}
 */
async function writePrivateCssManifest(
  publicManifestPath,
  privateManifestPath,
) {
  const publicManifest = JSON.parse(
    await fs.readFile(publicManifestPath, "utf8"),
  );
  const privateManifest = {
    ...publicManifest,
    targets: {
      ...publicManifest.targets,
      css: {
        ...(publicManifest?.targets?.css ?? {}),
        includeLayerRole: "private",
      },
    },
  };

  await fs.mkdir(path.dirname(privateManifestPath), { recursive: true });
  await fs.writeFile(
    privateManifestPath,
    `${JSON.stringify(privateManifest, null, 2)}\n`,
    "utf8",
  );
}

/**
 * Builds all discovered token targets and emits public/private CSS artifacts.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const buildTargets = await discoverBuildTargets();
  const outputs = [];

  for (const cfg of buildTargets) {
    run("node", [
      "tokens/scripts/pipeline/prepare-sd-contexts.mjs",
      "--resolver",
      cfg.resolver,
      "--out-tokens",
      cfg.contexts,
      "--out-manifest",
      cfg.manifest,
    ]);

    run(
      "pnpm",
      [
        "exec",
        "style-dictionary",
        "build",
        "--config",
        "tokens/style-dictionary.config.mjs",
      ],
      {
        env: {
          ...process.env,
          TOKENS_CONTEXTS_FILE: path.resolve(cwd, cfg.contexts),
          TOKENS_MANIFEST_FILE: path.resolve(cwd, cfg.manifest),
          TOKENS_CSS_OUT: path.resolve(cwd, cfg.out),
        },
      },
    );

    await writePrivateCssManifest(
      path.resolve(cwd, cfg.manifest),
      path.resolve(cwd, cfg.manifestPrivate),
    );

    run(
      "pnpm",
      [
        "exec",
        "style-dictionary",
        "build",
        "--config",
        "tokens/style-dictionary.config.mjs",
      ],
      {
        env: {
          ...process.env,
          TOKENS_CONTEXTS_FILE: path.resolve(cwd, cfg.contexts),
          TOKENS_MANIFEST_FILE: path.resolve(cwd, cfg.manifestPrivate),
          TOKENS_CSS_OUT: path.resolve(cwd, cfg.outPrivate),
        },
      },
    );

    outputs.push(cfg);
  }

  console.log(
    `Built token artifacts:\n${outputs
      .map(
        (cfg) =>
          `- CSS: ${cfg.out}\n  Private primitive CSS: ${cfg.outPrivate}\n  Contexts JSON: ${cfg.contexts}\n  CSS manifest: ${cfg.manifest}`,
      )
      .join("\n")}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
