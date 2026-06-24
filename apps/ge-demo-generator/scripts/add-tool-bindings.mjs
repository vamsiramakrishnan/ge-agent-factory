#!/usr/bin/env node
// Codemod: add an explicit `binding` object to every tool in every simulator pack's
// tools.json, computed by REPLICATING THE ENGINE'S CURRENT CONVENTION RESOLUTION
// exactly (see mcp-service/simulator_runtime/generic.py -> build_generic_handlers).
//
// The binding must be behavior-preserving: for each tool it records the op +
// collection (+ primaryKey) that the engine would resolve TODAY via name-prefix
// matching and English pluralization. Tools that resolve to nothing under the
// convention are LEFT UNBOUND (these are pre-existing plugin-served or dead tools
// the hardened validator now surfaces).
//
// Usage:
//   bun scripts/add-tool-bindings.mjs --dry-run     # report counts, change nothing
//   bun scripts/add-tool-bindings.mjs --apply       # write bindings into tools.json
//   bun scripts/add-tool-bindings.mjs --apply --system coupa   # one system

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseFlagArgs, boolFlag } from "../../../tools/lib/cli-args.mjs";
import { writeJson } from "../../../tools/lib/json-io.mjs";
import { loadSimulatorRegistry } from "./ge-mock/simulators/registry.mjs";

// ── Pluralization, ported verbatim from generic.py ──────────────────────────
// _singular_candidates(collection)
function singularCandidates(collection) {
  const candidates = [collection];
  if (collection.endsWith("ies")) candidates.push(`${collection.slice(0, -3)}y`);
  if (/(?:ses|xes|zes|ches|shes)$/.test(collection)) candidates.push(collection.slice(0, -2));
  if (collection.endsWith("ves")) {
    candidates.push(`${collection.slice(0, -3)}f`);
    candidates.push(`${collection.slice(0, -3)}fe`);
  }
  if (collection.endsWith("s") && !collection.endsWith("ss")) candidates.push(collection.slice(0, -1));
  return [...new Set(candidates)];
}

// _plural_candidates(singular)
function pluralCandidates(singular) {
  const candidates = [singular, `${singular}s`];
  if (singular.endsWith("y") && singular.length > 1 && !"aeiou".includes(singular[singular.length - 2].toLowerCase())) {
    candidates.push(`${singular.slice(0, -1)}ies`);
  }
  if (/(?:s|x|z|ch|sh)$/.test(singular)) candidates.push(`${singular}es`);
  if (singular.endsWith("f")) candidates.push(`${singular.slice(0, -1)}ves`);
  if (singular.endsWith("fe")) candidates.push(`${singular.slice(0, -2)}ves`);
  return [...new Set(candidates)];
}

// find_collection_for_get(contract, singular)
function findCollectionForGet(collections, singular) {
  for (const candidate of pluralCandidates(singular)) {
    if (candidate in collections) return candidate;
  }
  for (const collection of Object.keys(collections)) {
    if (singularCandidates(collection).includes(singular)) return collection;
  }
  return null;
}

// ── Resolve the engine binding for a single tool (mirrors build_generic_handlers) ──
function resolveBinding({ name, collections, toolHandlers }) {
  // Order matches the engine's elif chain exactly.
  if (name.startsWith("search_")) {
    const collection = name.slice("search_".length);
    if (collection in collections) {
      return { op: "search", collection };
    }
    return null;
  }
  if (name.startsWith("get_")) {
    const collection = findCollectionForGet(collections, name.slice("get_".length));
    if (collection) {
      return { op: "get", collection, primaryKey: collections[collection].primaryKey };
    }
    return null;
  }
  if (name === "list_pending_approvals") {
    if ("approvals" in collections) return { op: "list_pending_approvals", collection: "approvals" };
    return null;
  }
  if (name === "list_audit_events") {
    return { op: "list_audit_events" };
  }
  if (name.startsWith("submit_") && name.endsWith("_update")) {
    const workflow = toolHandlers[name];
    if (workflow && workflow.collection in collections) {
      const collection = workflow.collection;
      const primaryKey = workflow.primaryKey || collections[collection].primaryKey;
      return { op: "submit", collection, primaryKey };
    }
    return null;
  }
  if (name === "poll_async_job") {
    return { op: "poll_async_job" };
  }
  return null;
}

// Stable equality so a re-run on an already-correct binding is a no-op.
function bindingsEqual(a, b) {
  if (!a || !b) return false;
  return (
    a.op === b.op &&
    (a.collection ?? null) === (b.collection ?? null) &&
    (a.primaryKey ?? null) === (b.primaryKey ?? null)
  );
}

function processSystem(sim, { apply }) {
  const collections = sim.schema?.collections || {};
  const toolHandlers = sim.workflowCatalog?.toolHandlers || {};
  const toolsDoc = sim.toolCatalog;
  const result = {
    id: sim.id,
    tools: 0,
    added: 0,
    updated: 0,
    unchanged: 0,
    unbound: [],
    changed: false,
  };
  if (!toolsDoc || !Array.isArray(toolsDoc.tools)) return result;

  for (const tool of toolsDoc.tools) {
    result.tools += 1;
    const name = tool.name || "";
    const desired = resolveBinding({ name, collections, toolHandlers });
    if (!desired) {
      // Pre-existing dead/plugin-served tool: leave it unbound, surface as a warning.
      result.unbound.push(name);
      continue;
    }
    const existing = tool.binding && typeof tool.binding === "object" ? tool.binding : null;
    if (existing && bindingsEqual(existing, desired)) {
      result.unchanged += 1;
      continue;
    }
    if (existing) result.updated += 1;
    else result.added += 1;
    tool.binding = desired;
    result.changed = true;
  }

  if (apply && result.changed && sim.toolsPath) {
    const target = resolve(REPO_ROOT, sim.toolsPath);
    writeJson(target, toolsDoc);
  }
  return result;
}

const REPO_ROOT = resolve(new URL(".", import.meta.url).pathname, "../../..");

function main() {
  const { flags } = parseFlagArgs(process.argv.slice(2), { bareValue: "true" });
  const apply = boolFlag(flags, "apply", false);
  const dryRun = boolFlag(flags, "dry-run", false);
  if (apply && dryRun) throw new Error("--apply and --dry-run are mutually exclusive");
  if (!apply && !dryRun) {
    console.error("Specify --dry-run (report only) or --apply (write bindings).");
    process.exit(2);
  }

  const registry = loadSimulatorRegistry();
  const systems = flags.system
    ? registry.simulators.filter((s) => s.id === flags.system)
    : registry.simulators;
  if (!systems.length) throw new Error(`No simulator matched ${flags.system || "registry"}`);

  const results = systems.map((sim) => processSystem(sim, { apply }));
  const totals = results.reduce(
    (acc, r) => {
      acc.tools += r.tools;
      acc.added += r.added;
      acc.updated += r.updated;
      acc.unchanged += r.unchanged;
      acc.unbound += r.unbound.length;
      if (r.changed) acc.systemsChanged += 1;
      return acc;
    },
    { tools: 0, added: 0, updated: 0, unchanged: 0, unbound: 0, systemsChanged: 0 },
  );

  const mode = apply ? "APPLY" : "DRY-RUN";
  console.log(`add-tool-bindings (${mode}) — ${systems.length} systems`);
  for (const r of results) {
    const parts = [`+${r.added}`, `~${r.updated}`, `=${r.unchanged}`];
    let line = `  ${r.id.padEnd(28)} ${r.tools} tools  [${parts.join(" ")}]`;
    if (r.unbound.length) line += `  UNBOUND: ${r.unbound.join(", ")}`;
    console.log(line);
  }
  console.log(
    `\nTotals: ${totals.tools} tools  added=${totals.added} updated=${totals.updated} unchanged=${totals.unchanged} unbound=${totals.unbound} systemsChanged=${totals.systemsChanged}`,
  );
  if (totals.unbound) {
    console.log(
      "\nUnbound tools resolve to no generic handler under the engine convention.\n" +
        "These are served by per-system plugin handlers or are pre-existing dead tools;\n" +
        "the hardened validator surfaces them. No binding was invented for them.",
    );
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
