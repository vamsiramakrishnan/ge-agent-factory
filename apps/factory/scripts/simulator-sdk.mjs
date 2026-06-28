#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { simulatorSdkPlan } from "../src/simulator-sdk.js";

const REPO_ROOT = resolve(new URL("../../..", import.meta.url).pathname);
const DEFAULT_REGISTRY = resolve(REPO_ROOT, "apps/factory/simulator-systems/registry.json");

function usage() {
  return `Usage:
  node apps/factory/scripts/simulator-sdk.mjs plan --spec spec.json [--simulator simulator.json]
  node apps/factory/scripts/simulator-sdk.mjs plan --spec spec.json --simulator-id workday --name Workday

Outputs the deterministic simulator/mock-data lifecycle plan Antigravity should use.
The plan prefers existing simulator registry entries and only scaffolds missing
systems when createIfMissing is true.`;
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    flags[key] = next && !next.startsWith("--") ? argv[++i] : "true";
  }
  return { positional, flags };
}

async function readJson(path, fallback = null) {
  if (!path) return fallback;
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

function simulatorFromFlags(flags, fileValue = {}) {
  return {
    ...fileValue,
    id: flags["simulator-id"] || flags.id || fileValue.id || fileValue.systemId,
    systemId: flags["simulator-id"] || flags.id || fileValue.systemId || fileValue.id,
    displayName: flags.name || flags.displayName || fileValue.displayName || fileValue.name,
    archetype: flags.archetype || fileValue.archetype,
    realism: flags.realism || fileValue.realism,
    objects: flags.objects || fileValue.objects,
    workflows: flags.workflows || fileValue.workflows,
    scale: flags.scale || fileValue.scale,
    createIfMissing: flags["create-if-missing"] == null
      ? fileValue.createIfMissing
      : !["false", "0", "no", "off"].includes(String(flags["create-if-missing"]).toLowerCase()),
  };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
if (flags.help || positional[0] !== "plan") {
  console.log(usage());
  process.exit(flags.help ? 0 : 1);
}

const spec = await readJson(flags.spec);
if (!spec) throw new Error("missing --spec");
const simulatorFile = await readJson(flags.simulator, {});
const registry = await readJson(flags.registry || DEFAULT_REGISTRY, { simulators: [] });
const plan = simulatorSdkPlan({
  spec,
  simulator: simulatorFromFlags(flags, simulatorFile),
  workspace: flags.workspace || null,
  usecaseId: flags.usecase || flags.scenario || null,
  sourceMap: flags.sourceMap || undefined,
  registry,
});

console.log(JSON.stringify(plan, null, 2));
if (!plan.ok) process.exit(2);
