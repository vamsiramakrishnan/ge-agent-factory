#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseFlagArgs, boolFlag } from "@ge/std/cli-args";
import { loadSimulatorRegistry } from "./factory/simulators/registry.mjs";

// Seed/schema paths in the registry are repo-root-relative. Resolve against the
// repo root (three levels up from this script) rather than process.cwd(), so the
// validator works from any working directory.
const REPO_ROOT = resolve(new URL(".", import.meta.url).pathname, "../../..");

const BINDING_OPS = new Set([
  "search",
  "get",
  "create",
  "submit",
  "list_pending_approvals",
  "list_audit_events",
  "poll_async_job",
]);

// Pluralization ported from generic.py, used to map `*_id` field names to the
// collection they reference when the schema does not carry an explicit `ref:` type.
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

function collectionForSingular(collections, singular) {
  for (const candidate of pluralCandidates(singular)) {
    if (candidate in collections) return candidate;
  }
  for (const collection of Object.keys(collections)) {
    if (singularCandidates(collection).includes(singular)) return collection;
  }
  return null;
}

function fieldType(fieldSpec) {
  if (typeof fieldSpec === "string") {
    if (fieldSpec.startsWith("enum:")) return "string";
    if (fieldSpec.startsWith("ref:")) return "string";
    if (fieldSpec.startsWith("array:")) return "array";
    return fieldSpec;
  }
  if (fieldSpec && typeof fieldSpec === "object") return fieldSpec.type || "object";
  return null;
}

function semanticExpectation(field) {
  if (/(^|_)count$|_count$|_qty$|^quantity$|^score$|^duration_seconds$|^duration_hours$|^member_count$|^row_count$|^audience_size$/.test(field)) return { type: "integer" };
  if (/^amount$|_amount$|^balance$|^budget$|^burn_rate$|^target$|^value$|^salary_band$/.test(field)) return { type: "number" };
  if (/^compliance_required$|^required$|^active$|^enabled$/.test(field)) return { type: "boolean" };
  if (field === "date" || field.endsWith("_date")) return { type: "string", format: "date" };
  if (field === "at" || field.endsWith("_at")) return { type: "string", format: "date-time" };
  if (field === "email" || field.endsWith("_email")) return { type: "string", format: "email" };
  return null;
}

function fieldFormat(fieldSpec) {
  if (fieldSpec && typeof fieldSpec === "object") return fieldSpec.format || null;
  return null;
}

function loadSeed(simulator) {
  if (!simulator.seedPath) return null;
  try {
    return JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.seedPath), "utf8"));
  } catch {
    return null;
  }
}

// Resolve the (collection, primaryKey) a field references, or null if it is not a
// foreign key. Honours an explicit `ref:collection.field` type first; otherwise
// falls back to the `*_id` naming convention, mapping the singular stem to a
// collection via the same pluralization the engine uses. The field is only treated
// as an FK when the target collection actually exists in the schema.
function refTargetForField(collections, field, fieldSpec) {
  if (typeof fieldSpec === "string" && fieldSpec.startsWith("ref:")) {
    const body = fieldSpec.slice("ref:".length);
    const [collection, refField] = body.split(".");
    if (collection && collections[collection]) {
      return { collection, primaryKey: refField || collections[collection].primaryKey };
    }
    return null;
  }
  if (field.endsWith("_id")) {
    const stem = field.slice(0, -"_id".length);
    if (!stem) return null;
    const collection = collectionForSingular(collections, stem);
    if (collection) return { collection, primaryKey: collections[collection].primaryKey };
  }
  return null;
}

// Index of primaryKey values present in each collection's seed rows.
function seedPrimaryKeyIndex(collections, seed) {
  const index = {};
  for (const [collection, spec] of Object.entries(collections)) {
    const primaryKey = spec.primaryKey;
    const rows = Array.isArray(seed?.[collection]) ? seed[collection] : [];
    const keys = new Set();
    for (const row of rows) {
      if (row && row[primaryKey] !== undefined && row[primaryKey] !== null) keys.add(row[primaryKey]);
    }
    index[collection] = keys;
  }
  return index;
}

function seedContainsSampleValue(value) {
  if (typeof value === "string") return value.startsWith("sample_");
  if (Array.isArray(value)) return value.some(seedContainsSampleValue);
  if (value && typeof value === "object") return Object.values(value).some(seedContainsSampleValue);
  return false;
}

function validateSimulator(simulator, { strict = false } = {}) {
  const errors = [];
  const warnings = [];
  if (!simulator.id) errors.push("missing simulator id");
  if (!simulator.schema) errors.push("missing schema");
  if (!simulator.toolCatalog) errors.push("missing tool catalog");
  if (!simulator.projection) errors.push("missing projection rules");
  if (!simulator.materialization) errors.push("missing materialization rules");

  const collections = simulator.schema?.collections || {};
  for (const [name, collection] of Object.entries(collections)) {
    if (!collection.primaryKey) errors.push(`schema collection ${name} missing primaryKey`);
    const fieldEntries = Object.entries(collection.fields || {});
    const weakFields = fieldEntries
      .filter(([field]) => field !== collection.primaryKey)
      .filter(([field, spec]) => {
        if (typeof spec === "string" && spec.startsWith("enum:")) return false;
        const expected = semanticExpectation(field);
        if (!expected) return false;
        if (fieldType(spec) !== expected.type) return true;
        if (expected.format && fieldFormat(spec) !== expected.format) return true;
        return false;
      })
      .map(([field]) => field);
    if (weakFields.length) {
      warnings.push(`schema collection ${name} has weak semantic fields: ${weakFields.join(", ")}`);
    }
  }

  const seed = loadSeed(simulator);
  for (const [collection, rows] of Object.entries(seed || {})) {
    if (Array.isArray(rows) && rows.some(seedContainsSampleValue)) {
      warnings.push(`seed collection ${collection} contains sample_* placeholder values`);
    }
  }

  const toolNames = new Set();
  const toolList = simulator.toolCatalog?.tools || [];
  const workflowHandlers = simulator.workflowCatalog?.toolHandlers || {};
  for (const tool of toolList) {
    if (!tool.name) errors.push("tool catalog contains unnamed tool");
    if (tool.name) toolNames.add(tool.name);
    if (!tool.inputSchema) warnings.push(`tool ${tool.name} missing inputSchema`);

    // ── Explicit binding checks ──
    const binding = tool.binding && typeof tool.binding === "object" ? tool.binding : null;
    if (!binding) {
      const msg = `tool ${tool.name} has no explicit binding`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    } else {
      if (!BINDING_OPS.has(binding.op)) {
        errors.push(`tool ${tool.name} binding has unknown op ${binding.op}`);
      } else if (binding.op === "list_audit_events" || binding.op === "poll_async_job") {
        // No collection requirement: list_audit_events is collection-free; the
        // poll handler is provided generically and binds no collection.
      } else if (binding.op === "submit") {
        // A submit binding must resolve to a workflow handler whose collection exists,
        // else it is a silent dead tool that resolves to no handler at runtime.
        const workflow = workflowHandlers[tool.name];
        if (!workflow) {
          errors.push(`tool ${tool.name} submit binding has no workflow handler (silent dead tool)`);
        } else if (!collections[workflow.collection]) {
          errors.push(`tool ${tool.name} submit binding workflow collection ${workflow.collection} missing from schema`);
        } else if (binding.collection && binding.collection !== workflow.collection) {
          errors.push(`tool ${tool.name} submit binding collection ${binding.collection} disagrees with workflow collection ${workflow.collection}`);
        }
      } else {
        // search / get / list_pending_approvals all require a real collection.
        const collection = binding.collection || (binding.op === "list_pending_approvals" ? "approvals" : undefined);
        if (!collection) {
          errors.push(`tool ${tool.name} binding op ${binding.op} missing collection`);
        } else if (!collections[collection]) {
          errors.push(`tool ${tool.name} binding collection ${collection} missing from schema (silent dead tool)`);
        }
      }
    }
  }
  for (const name of simulator.tools || []) {
    if (!toolNames.has(name)) errors.push(`registry tool ${name} missing from tools.json`);
  }

  const roleNames = new Set(simulator.roles || []);
  for (const [toolName, workflow] of Object.entries(simulator.workflowCatalog?.toolHandlers || {})) {
    if (!toolNames.has(toolName)) errors.push(`workflow handler ${toolName} missing from tools.json`);
    if (!workflow.primitive) warnings.push(`workflow handler ${toolName} missing primitive`);
    if (!workflow.collection) errors.push(`workflow handler ${toolName} missing collection`);
    else if (!collections[workflow.collection]) errors.push(`workflow handler ${toolName} collection ${workflow.collection} missing from schema`);
    const primaryKey = workflow.primaryKey || collections[workflow.collection]?.primaryKey;
    if (!primaryKey) errors.push(`workflow handler ${toolName} missing primaryKey`);
    for (const role of workflow.allowedRoles || []) {
      if (roleNames.size && !roleNames.has(role)) errors.push(`workflow handler ${toolName} unknown allowed role ${role}`);
    }
    for (const blocker of workflow.approvalBlockers || []) {
      const blockerCollection = blocker.collection || "approvals";
      if (!collections[blockerCollection]) errors.push(`workflow handler ${toolName} approval blocker collection ${blockerCollection} missing from schema`);
    }
  }

  for (const mapping of simulator.projection?.collectionMappings || []) {
    if (!mapping.simulatorCollection) errors.push("projection mapping missing simulatorCollection");
    else if (!collections[mapping.simulatorCollection]) errors.push(`projection collection ${mapping.simulatorCollection} missing from schema`);
    if (!mapping.realizedObjects?.length) warnings.push(`projection ${mapping.simulatorCollection} has no realizedObjects`);
    if (!mapping.graphKinds?.length) warnings.push(`projection ${mapping.simulatorCollection} has no graphKinds`);
  }

  for (const [collection, rules] of Object.entries(simulator.materialization?.collections || {})) {
    if (!collections[collection]) errors.push(`materialization collection ${collection} missing from schema`);
    const primaryKey = rules.primaryKey || collections[collection]?.primaryKey;
    if (!primaryKey) errors.push(`materialization collection ${collection} missing primaryKey`);
    if (!rules.fieldAliases?.[primaryKey]) warnings.push(`materialization collection ${collection} has no aliases for primary key ${primaryKey}`);
  }

  // ── FK closure (error): every non-null FK value in the seed must resolve to a
  // primaryKey present in the referenced collection. Covers explicit `ref:` types
  // and `*_id` names that map to a known collection. ──
  if (seed) {
    const pkIndex = seedPrimaryKeyIndex(collections, seed);
    for (const [collection, spec] of Object.entries(collections)) {
      const rows = Array.isArray(seed[collection]) ? seed[collection] : [];
      const fields = spec.fields || {};
      for (const [field, fieldSpec] of Object.entries(fields)) {
        const target = refTargetForField(collections, field, fieldSpec);
        if (!target) continue;
        // Self-reference to the row's own primary key is not an FK; skip it.
        if (target.collection === collection && target.primaryKey === spec.primaryKey && field === spec.primaryKey) continue;
        const validKeys = pkIndex[target.collection];
        if (!validKeys) continue;
        const dangling = new Set();
        for (const row of rows) {
          if (!row) continue;
          const raw = row[field];
          if (raw === undefined || raw === null || raw === "") continue;
          const values = Array.isArray(raw) ? raw : [raw];
          for (const value of values) {
            if (value === null || value === undefined || value === "") continue;
            if (!validKeys.has(value)) dangling.add(`${value}`);
          }
        }
        for (const value of dangling) {
          errors.push(`dangling FK ${collection}.${field} -> ${target.collection}.${target.primaryKey}: ${value}`);
        }
      }
    }
  }

  // ── Non-empty collections (warn; error under --strict). ──
  if (seed) {
    for (const collection of Object.keys(collections)) {
      if (collection === "audit_events" || collection === "async_jobs") continue;
      const rows = Array.isArray(seed[collection]) ? seed[collection] : [];
      if (rows.length === 0) {
        const msg = `seed collection ${collection} is empty`;
        if (strict) errors.push(msg);
        else warnings.push(msg);
      }
    }
  }

  // ── Scenario coverage (warn): seeds should exercise declared transitions,
  // approval blockers, and failure modes. ──
  if (seed) {
    for (const [toolName, workflow] of Object.entries(workflowHandlers)) {
      const collection = workflow.collection;
      const rows = Array.isArray(seed[collection]) ? seed[collection] : [];
      const stateField = workflow.stateField || "status";
      const transitions = workflow.transitions || {};
      const sourceStates = Object.keys(transitions).filter((s) => s !== "*" && (transitions[s] || []).length);
      if (sourceStates.length) {
        const present = new Set(rows.map((row) => row && row[stateField]));
        const covered = sourceStates.some((state) => present.has(state));
        if (!covered) {
          warnings.push(`workflow ${toolName} has no seed row in any transition source state (${sourceStates.join(", ")})`);
        }
      }
      for (const blocker of workflow.approvalBlockers || []) {
        const blockerCollection = blocker.collection || "approvals";
        const sourceField = blocker.sourceRecordField || "source_record_id";
        const states = new Set(blocker.states || ["requested", "pending", "pending_approval"]);
        const approvalRows = Array.isArray(seed[blockerCollection]) ? seed[blockerCollection] : [];
        const sourceIds = new Set(rows.map((row) => row && row[workflow.primaryKey || collections[collection]?.primaryKey]));
        const matching = approvalRows.some(
          (row) => row && states.has(row.state) && sourceIds.has(row[sourceField]),
        );
        if (!matching) {
          warnings.push(`workflow ${toolName} approval blocker has no matching pending ${blockerCollection} row`);
        }
      }
      const failureModes = workflow.failureModes || {};
      for (const mode of Object.keys(failureModes)) {
        // A failure mode is "exercised" when there is at least one seed row in this
        // collection it could fire against; an empty collection cannot exercise it.
        if (rows.length === 0) {
          warnings.push(`workflow ${toolName} declares failure mode ${mode} with no seed rows to exercise it`);
        }
      }
    }
  }

  const boundTools = toolList.filter((tool) => tool.binding && typeof tool.binding === "object").length;

  return {
    id: simulator.id,
    ok: errors.length === 0,
    errors,
    warnings,
    tools: toolNames.size,
    boundTools,
    collections: Object.keys(collections).length,
    workflowHandlers: Object.keys(simulator.workflowCatalog?.toolHandlers || {}).length,
  };
}

function main() {
  const { flags } = parseFlagArgs(process.argv.slice(2), { bareValue: "true" });
  const strict = boolFlag(flags, "strict", false);
  const registry = loadSimulatorRegistry();
  const systems = flags.system
    ? registry.simulators.filter((simulator) => simulator.id === flags.system)
    : registry.simulators;
  if (!systems.length) throw new Error(`No simulator matched ${flags.system || "registry"}`);
  const results = systems.map((simulator) => validateSimulator(simulator, { strict }));
  const report = {
    ok: results.every((result) => result.ok),
    strict,
    simulators: results,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok || flags.check === "true" && !report.ok) process.exit(2);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
