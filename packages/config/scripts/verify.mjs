#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for editor-tooling artifacts.
 *
 * Re-runs the system pipeline (which writes generated files into this
 * package's `editor/` directory) and fails if the regenerated artifacts
 * differ from the checked-in state. Catches source/output drift the same
 * way `@measured/calibrate-tokens` verifies its JSON outputs.
 */

const cwd = process.cwd();

/**
 * Runs a subprocess inheriting stdio and throws on non-zero exit.
 *
 * @param {string} cmd
 * @param {string[]} args
 */
function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd, stdio: "inherit" });

  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed.`);
  }
}

async function main() {
  run("pnpm", ["--filter", "@measured/calibrate-system", "build"]);

  const diff = spawnSync("git", ["diff", "--exit-code", "--", "editor"], {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (diff.status !== 0) {
    process.stdout.write(diff.stdout || "");
    process.stderr.write(diff.stderr || "");
    throw new Error(
      "packages/config/editor is not up to date. Run `pnpm --filter @measured/calibrate-system build` and commit updated artifacts.",
    );
  }

  console.log("packages/config/editor is up to date.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
