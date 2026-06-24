#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const get = (name, fallback = "") => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};

const dir = resolve(get("dir", "."));
const readJson = (rel, fallback = null) => {
  const path = join(dir, rel);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
};

const spec = readJson("mock_systems/usecase-spec.json");
const manifest = readJson("fixtures/manifest.json");
const schema = readJson("mock_systems/schema.json");
const failures = [];
const warnings = [];

function fail(id, message, detail = {}) {
  failures.push({ id, message, ...detail });
}

function warn(id, message, detail = {}) {
  warnings.push({ id, message, ...detail });
}

if (!spec) fail("spec:missing", "mock_systems/usecase-spec.json is required");
if (!manifest) fail("manifest:missing", "fixtures/manifest.json is required");
if (!schema) fail("schema:missing", "mock_systems/schema.json is required");

const systems = new Set((spec?.systems || []).map((system) => system.id).filter(Boolean));
if (spec && systems.size === 0) fail("spec:systems", "spec.systems must contain canonical source systems");
const behavior = spec?.behaviorContract || null;
const toolIntents = Array.isArray(behavior?.toolIntents) ? behavior.toolIntents : [];
if (!behavior) {
  fail("behavior:missing", "spec.behaviorContract is required; synthesized/no-contract specs are not production-grade agent inputs");
} else {
  if (!behavior.role || behavior.role.length < 20) fail("behavior:role", "behaviorContract.role must be domain-specific");
  if (!behavior.primaryObjective || behavior.primaryObjective.length < 60) fail("behavior:objective", "behaviorContract.primaryObjective must describe the real workflow outcome");
  if (toolIntents.length < 3) fail("behavior:tool_intents", "behaviorContract.toolIntents must cover query/action/evidence workflow steps", { count: toolIntents.length });
  if (!Array.isArray(behavior.evidenceRequirements) || behavior.evidenceRequirements.length === 0) fail("behavior:evidence", "behaviorContract.evidenceRequirements must be non-empty");
  if (!Array.isArray(behavior.goldenEvals) || behavior.goldenEvals.length === 0) fail("behavior:golden_evals", "behaviorContract.goldenEvals must include at least one end-to-end prompt");
  for (const intent of toolIntents) {
    if (!systems.has(intent.sourceSystemId)) fail(`behavior:${intent.name}:system`, "tool intent sourceSystemId must exist in spec.systems", { sourceSystemId: intent.sourceSystemId });
  }
}

const rowMinimum = spec?.rowPolicy?.minimumRowsPerEntity || 1;
for (const contract of spec?.dataContracts || []) {
  if (!contract.sourceSystem || !contract.sourceSystemId) fail(`contract:${contract.entity}:system`, "data contract must name a source system", { entity: contract.entity });
  if (!systems.has(contract.sourceSystemId)) fail(`contract:${contract.entity}:registered`, "data contract sourceSystemId must exist in spec.systems", { sourceSystemId: contract.sourceSystemId });
  if ((contract.rows || 0) < rowMinimum) warn(`contract:${contract.entity}:rows`, "data contract row count is below row policy", { rows: contract.rows, rowMinimum });
  if (!contract.primaryKey) fail(`contract:${contract.entity}:pk`, "data contract must define a primary key");
}

for (const table of manifest?.tables || []) {
  const tableId = table.name || table.path || "table";
  if (!table.sourceSystem || !table.sourceSystemId) fail(`manifest:${tableId}:system`, "manifest table must include sourceSystem and sourceSystemId");
  if (table.sourceSystemId && !systems.has(table.sourceSystemId)) fail(`manifest:${tableId}:registered`, "manifest table sourceSystemId must exist in spec.systems", { sourceSystemId: table.sourceSystemId });
  if ((table.rowCount || 0) < rowMinimum) fail(`manifest:${tableId}:rows`, "manifest table row count is below row policy", { rowCount: table.rowCount, rowMinimum });
}

for (const tableDef of schema?.tables || []) {
  if (!tableDef._sourceSystem || !tableDef._sourceSystemId) fail(`schema:${tableDef.name}:system`, "schema table must include _sourceSystem and _sourceSystemId");
  for (const column of tableDef.columns || []) {
    if (column.type === "ref" && !column.ref) fail(`schema:${tableDef.name}.${column.name}:ref`, "ref column must declare target table.field");
  }
}

const toolText = existsSync(join(dir, "app/tools.py")) ? readFileSync(join(dir, "app/tools.py"), "utf8") : "";
if (!toolText) fail("tools:missing", "app/tools.py is required");
if (/query_mock_|mock data source|list_mock_systems/i.test(toolText)) fail("tools:generic_names", "tools must use canonical source-system names, not generic mock names");
for (const intent of toolIntents.filter((item) => ["action", "notification", "evidence_lookup", "calculation"].includes(item.kind))) {
  if (!toolText.includes(`def ${intent.name}`)) fail(`tools:${intent.name}:missing`, "behavior-contract action/evidence tool must be implemented", { intent: intent.name });
}
for (const system of spec?.systems || []) {
  const expected = String(system.id || "").replace(/[^a-zA-Z0-9_]/g, "_");
  if (expected && !toolText.includes(`query_${expected}_`) && !toolText.includes(`action_${expected}_`)) {
    warn(`tools:${system.id}:missing`, "no source-specific tool found for system", { system: system.name });
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  failures,
  warnings,
  summary: {
    systems: systems.size,
    contracts: spec?.dataContracts?.length || 0,
    tables: manifest?.tables?.length || 0,
    rowMinimum,
    behaviorTools: toolIntents.length,
    goldenEvals: behavior?.goldenEvals?.length || 0,
  },
}, null, 2));

process.exit(failures.length === 0 ? 0 : 1);
