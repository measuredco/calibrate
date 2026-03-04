#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function parseArgs(argv) {
  const args = {
    target: "all",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") args.target = argv[i + 1];
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
  const buildTargets = {
    core: {
      resolver: "tokens/resolver/core.resolver.json",
      out: "tokens/dist/css/clbr.core.tokens.css",
      contexts: "tokens/dist/json/clbr.core.contexts.json",
      manifest: "tokens/build/sd/clbr.core.css-manifest.json",
    },
    msrd: {
      resolver: "tokens/resolver/msrd.resolver.json",
      out: "tokens/dist/css/clbr.msrd.tokens.css",
      contexts: "tokens/dist/json/clbr.msrd.contexts.json",
      manifest: "tokens/build/sd/clbr.msrd.css-manifest.json",
    },
  };

  let selectedTargets;
  if (cli.target === "all") selectedTargets = Object.keys(buildTargets);
  else if (Object.prototype.hasOwnProperty.call(buildTargets, cli.target)) selectedTargets = [cli.target];
  else {
    throw new Error(`Unknown --target "${cli.target}". Use one of: all, ${Object.keys(buildTargets).join(", ")}`);
  }

  const outputs = [];
  for (const target of selectedTargets) {
    const cfg = buildTargets[target];
    run("node", [
      "tokens/scripts/prepare-sd-contexts.mjs",
      "--resolver",
      cfg.resolver,
      "--out-tokens",
      cfg.contexts,
      "--out-manifest",
      cfg.manifest,
    ]);

    run(
      "pnpm",
      ["exec", "style-dictionary", "build", "--config", "tokens/style-dictionary.config.mjs"],
      {
        env: {
          ...process.env,
          TOKENS_CONTEXTS_FILE: path.resolve(cwd, cfg.contexts),
          TOKENS_MANIFEST_FILE: path.resolve(cwd, cfg.manifest),
          TOKENS_CSS_OUT: path.resolve(cwd, cfg.out),
        },
      },
    );
    outputs.push(cfg);
  }

  // eslint-disable-next-line no-console
  console.log(
    `Built token artifacts:\n${outputs
      .map(
        (cfg) =>
          `- CSS: ${cfg.out}\n  Contexts JSON: ${cfg.contexts}\n  CSS manifest: ${cfg.manifest}`,
      )
      .join("\n")}`,
  );
}

try {
  main();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
}
