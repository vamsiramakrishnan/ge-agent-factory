#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { resolveHarnessPython } from "../src/harness-python.js";
import { writeJson } from "@ge/std/json-io";

function arg(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

const workspaceDir = resolve(arg("dir", "."));
const provider = arg("provider", "antigravity-sdk");
const artifactsDir = join(workspaceDir, "artifacts");
mkdirSync(artifactsDir, { recursive: true });

function checkPythonModule(moduleName) {
  const python = resolveHarnessPython();
  const result = spawnSync(python, ["-c", `import ${moduleName}`], { encoding: "utf8" });
  return {
    ok: result.status === 0,
    command: [python, "-c", `import ${moduleName}`],
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function checkBinary(bin, args = ["--version"]) {
  const result = spawnSync(bin, args, { encoding: "utf8" });
  return {
    ok: result.status === 0,
    command: [bin, ...args],
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    error: result.status === 0 ? null : result.error?.message || null,
  };
}

const checks = [];
if (provider === "antigravity-sdk") checks.push({ name: "google-antigravity-sdk", ...checkPythonModule("google.antigravity") });
if (provider === "agy") checks.push({ name: "agy-cli", ...checkBinary("agy") });
checks.push({ name: "node", ...checkBinary("node", ["--version"]) });

const report = {
  kind: "ge.harness.runtime_preflight",
  provider,
  workspaceDir,
  ok: checks.every((item) => item.ok),
  checks,
  generatedAt: new Date().toISOString(),
};

writeJson(join(artifactsDir, "harness-runtime-preflight.json"), report);
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
