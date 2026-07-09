#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const spec = process.argv[2];
const args = ["okf", "quality", "audit", ...(spec ? ["--spec", spec] : ["--all"]), "--json"];
const result = spawnSync("ge", args, { stdio: "inherit" });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
