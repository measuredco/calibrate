#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function parseArgs(argv) {
  const args = {
    resolver: "tokens/resolver/msrd.resolver.json",
    out: "tokens/build/css/clbrt.msrd.tokens.css",
    contexts: "tokens/build/json/clbrt.msrd.contexts.json",
    manifest: "tokens/build/sd/clbrt.msrd.css-manifest.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
    if (arg === "--contexts") args.contexts = argv[i + 1];
    if (arg === "--manifest") args.manifest = argv[i + 1];
  }

  return args;
}

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

function main() {
  const cli = parseArgs(process.argv.slice(2));

  run("node", [
    "tokens/scripts/prepare-sd-contexts.mjs",
    "--resolver",
    cli.resolver,
    "--out-tokens",
    cli.contexts,
    "--out-manifest",
    cli.manifest,
  ]);

  run(
    "pnpm",
    ["exec", "style-dictionary", "build", "--config", "tokens/style-dictionary.config.mjs"],
    {
      env: {
        ...process.env,
        TOKENS_CONTEXTS_FILE: path.resolve(cwd, cli.contexts),
        TOKENS_MANIFEST_FILE: path.resolve(cwd, cli.manifest),
        TOKENS_CSS_OUT: path.resolve(cwd, cli.out),
      },
    },
  );

  // eslint-disable-next-line no-console
  console.log(
    `Built token artifacts:\n- CSS: ${cli.out}\n- Contexts JSON: ${cli.contexts}\n- CSS manifest: ${cli.manifest}`,
  );
}

try {
  main();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
}
