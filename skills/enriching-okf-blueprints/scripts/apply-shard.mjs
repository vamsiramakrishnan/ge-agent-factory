#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const shardPath = process.argv[2];
if (!shardPath) {
  console.error("usage: apply-shard.mjs <shard.json>");
  process.exit(1);
}

const shard = JSON.parse(readFileSync(shardPath, "utf8"));
mkdirSync(join(".enrichment", "patches"), { recursive: true });

for (const spec of shard.specs || []) {
  const id = spec.id;
  const patchPath = join(".enrichment", "patches", `${id.replaceAll("/", "-")}.patch.json`);
  run("ge", ["okf", "enrich", "generate", "--spec", id, "--out", patchPath]);
  run("ge", ["okf", "enrich", "apply", "--patch", patchPath]);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
