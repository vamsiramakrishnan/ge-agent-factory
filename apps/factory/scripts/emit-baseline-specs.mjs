#!/usr/bin/env node
// Programmatically emit a structurally-valid generationSpec + behaviorContract
// into every slide TSX that currently relies on the sync-script's synthesized
// fallback. Each emitted spec should pass the current downstream audit
// (apps/factory/scripts/audit-usecase-specs.mjs).
//
// Run from repo root:
//   node apps/factory/scripts/emit-baseline-specs.mjs
//
// Use --dry to skip writes, --only <substr> to filter, --limit N to cap.

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { generateSpec } from "./factory/baseline/spec.mjs";
import { generateBehaviorContract } from "./factory/baseline/behavior-contract.mjs";

const repoRoot = resolve(".");
const generatorDir = join(repoRoot, "apps/factory");
const catalogPath = join(generatorDir, "src/use-cases.js");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const val = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const DRY = flag("dry");
const ONLY = val("only");
const LIMIT = val("limit") ? Number(val("limit")) : null;

// ── Code emission ───────────────────────────────────────────────────────────

function emit(v, indent = 1) {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") {
    if (v === "__BEHAVIOR_CONTRACT_REF__") return "behaviorContract";
    return JSON.stringify(v);
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    const items = v.map((x) => innerPad + emit(x, indent + 1)).join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  if (typeof v === "object") {
    const entries = Object.entries(v);
    if (entries.length === 0) return "{}";
    const items = entries.map(([k, val]) => `${innerPad}${k}: ${emit(val, indent + 1)}`).join(",\n");
    return `{\n${items},\n${pad}}`;
  }
  return JSON.stringify(v);
}

function renderBlock(spec) {
  const bc = spec.behaviorContract === "__BEHAVIOR_CONTRACT_REF__" ? null : spec.behaviorContract;
  // Spec must be rendered with behaviorContract as a shorthand ref
  const specForRender = { ...spec };
  const behaviorContract = (() => {
    // We'll generate behaviorContract separately
    return spec.__behaviorContract;
  })();
  return null;
}

function emitConsts(behaviorContract, generationSpecLiteral) {
  const bcCode = emit(behaviorContract, 0);
  const gsCode = emit(generationSpecLiteral, 0);
  return [
    "",
    "const behaviorContract: AgentBehaviorContract = " + bcCode + ";",
    "",
    "const generationSpec: UseCaseGenerationSpec = " + gsCode + ";",
    "",
  ].join("\n");
}

// ── File mutation ───────────────────────────────────────────────────────────

const ARCH_IMPORT_RE = /import\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+["']([^"']*types\/architecture)["']\s*;?/m;

function extendArchImport(source) {
  const match = source.match(ARCH_IMPORT_RE);
  if (!match) {
    // Insert a fresh import after the first import line
    const firstImportEnd = source.indexOf("\n", source.indexOf("import "));
    const importLine = `\nimport type { UseCaseGenerationSpec, AgentBehaviorContract } from "../../../../types/architecture";`;
    return source.slice(0, firstImportEnd) + importLine + source.slice(firstImportEnd);
  }
  const existing = match[1].split(",").map((s) => s.trim()).filter(Boolean);
  const want = ["UseCaseGenerationSpec", "AgentBehaviorContract"];
  let changed = false;
  for (const w of want) if (!existing.includes(w)) { existing.push(w); changed = true; }
  if (!changed) return source;
  const replacement = match[0].replace(match[1], existing.join(", "));
  return source.replace(match[0], replacement);
}

function insertConstsBeforeExport(source, block) {
  // Find the FIRST `export const X = (` or `export function X(`
  const exportMatch = source.match(/^export\s+(?:const|function)\s+\w+\s*(?:=\s*)?\(/m);
  if (!exportMatch) return null;
  const idx = exportMatch.index;
  return source.slice(0, idx) + block + "\n" + source.slice(idx);
}

async function processOne(useCase) {
  const abs = resolve(generatorDir, useCase.sourcePath);
  let source = await readFile(abs, "utf8");
  if (/const\s+generationSpec\s*[:=]/.test(source) || /const\s+behaviorContract\s*[:=]/.test(source)) {
    return { skipped: true, reason: "already has const declarations" };
  }
  const spec = generateSpec(useCase);
  const behaviorContract = spec.behaviorContract === "__BEHAVIOR_CONTRACT_REF__" ? null : null;
  // Real behaviorContract was built inside generateSpec; pull it back via re-derivation
  // (we set spec.behaviorContract to the sentinel for rendering, but the actual object was returned by generateBehaviorContract)
  // Re-derive cleanly:
  const sourceSystemsForBC = spec.sourceSystems;
  const realBC = generateBehaviorContract(useCase, sourceSystemsForBC);
  const block = emitConsts(realBC, spec);

  source = extendArchImport(source);
  const next = insertConstsBeforeExport(source, block);
  if (!next) return { skipped: true, reason: "no export const found" };

  if (!DRY) {
    await writeFile(abs, next, "utf8");
  }
  return { ok: true, systems: spec.sourceSystems.length, entities: spec.entities.length, tools: realBC.toolIntents.length };
}

// ── Main ────────────────────────────────────────────────────────────────────

const mod = await import(`file://${catalogPath}`);
let targets = mod.getUseCases().filter((u) => !u.hasBehaviorContract);
if (ONLY) targets = targets.filter((u) => u.sourcePath.includes(ONLY) || u.id.includes(ONLY));
if (LIMIT) targets = targets.slice(0, LIMIT);

console.error(`Target count: ${targets.length}${DRY ? " (dry run)" : ""}`);

const results = { attempted: targets.length, succeeded: 0, skipped: [], failed: [] };
for (const u of targets) {
  try {
    const r = await processOne(u);
    if (r.ok) results.succeeded++;
    else if (r.skipped) results.skipped.push({ id: u.id, reason: r.reason });
  } catch (e) {
    results.failed.push({ id: u.id, file: u.sourcePath, error: e.message, stack: e.stack?.split("\n").slice(0, 4).join(" | ") });
  }
}

console.log(JSON.stringify(results, null, 2));
process.exit(results.failed.length === 0 ? 0 : 1);
