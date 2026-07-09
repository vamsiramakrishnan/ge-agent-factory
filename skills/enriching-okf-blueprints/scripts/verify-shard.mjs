#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const shardPath = process.argv[2];
if (!shardPath) {
  console.error("usage: verify-shard.mjs <shard.json>");
  process.exit(1);
}

const shard = JSON.parse(readFileSync(shardPath, "utf8"));
const minScore = String(shard.acceptance?.minScore ?? 75);

for (const spec of shard.specs || []) {
  run("ge", ["okf", "eval", "verify", "--spec", spec.id]);
  run("ge", ["okf", "quality", "audit", "--spec", spec.id, "--fail-under", minScore]);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
