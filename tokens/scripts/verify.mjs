#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const cwd = process.cwd();

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

try {
  run("pnpm", ["run", "tokens:build"], { stdio: "inherit" });
  const diff = spawnSync("git", ["diff", "--exit-code", "--", "tokens/dist"], {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (diff.status !== 0) {
    console.error(
      "tokens/dist is not up to date. Run `pnpm run tokens:build` and commit updated dist artifacts.",
    );
    if (diff.stdout) {
      console.error(diff.stdout);
    }
    if (diff.stderr) {
      console.error(diff.stderr);
    }
    process.exit(1);
  }

  console.log("tokens/dist is up to date.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
