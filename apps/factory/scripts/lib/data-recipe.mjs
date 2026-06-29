/**
 * data-recipe.mjs — shared, deterministic data-generation library for simulator packs.
 *
 * One recipe contract, two realization tiers:
 *   - Snowfakery (high-fidelity, out-of-process): `toSnowfakeryYaml(recipe)`
 *   - Faker/offline fallback (in-process, zero external deps): `generateWithFaker(recipe, {seed})`
 *
 * Both tiers read the SAME normalized recipe produced by `buildRecipe(contract, {seed})`,
 * which derives a generator per field directly from a pack's schema field types
 * (`enum:a|b`, `ref:collection.field`, `*_id`, and value heuristics on name/email/date/...).
 *
 * The recipe orders collections so that foreign-key referents are generated before
 * referrers (topological closure), and the Faker tier resolves every FK to a real,
 * already-generated primary key — so the produced seed is referentially consistent.
 *
 * `scenarioCoverageRows(contract)` reads workflows.json toolHandlers and synthesizes
 * rows that exercise each declared transition source state, each approval blocker, and
 * each failure mode — so a generated demo actually hits approval gates and state machines.
 *
 * `applyMaterialization(rows, materialization, collection)` re-implements the
 * alias + defaults + template logic from materialize-simulator-seeds.mjs so generated
 * rows land in the canonical collection shape the engine consumes.
 */

import { snakeCase } from "@ge/std/naming";

// Re-exported for back-compat; the canonical (change-case) implementation lives
// in @ge/std/naming so the simulator-seed pipeline shares one casing.
export { snakeCase };

// ── deterministic PRNG ────────────────────────────────────────────────────────
// mulberry32: tiny, fast, fully deterministic given a 32-bit seed. We deliberately
// never call Math.random()/Date.now() so identical (contract, seed) => identical bytes.
export function makeRng(seed) {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stable 32-bit string hash (FNV-1a). Used to fold a field/collection name into a
// per-field seed so two fields with the same generator never produce identical streams.
function hashString(value) {
  let hash = 0x811c9dc5;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function rngFor(seed, ...parts) {
  return makeRng((Number(seed) >>> 0) ^ hashString(parts.join("|")));
}

function pick(rng, list) {
  if (!list.length) return null;
  return list[Math.floor(rng() * list.length) % list.length];
}

function intBetween(rng, min, max) {
  if (max < min) return min;
  return min + Math.floor(rng() * (max - min + 1));
}

// ── naming (kept in sync with @ge/std/naming) ─────────────────
// ── schema field-type parsing ──────────────────────────────────────────────────
// Pack schema field values are strings like "string", "number", "boolean",
// "enum:a|b|c", "ref:collection.field". Normalize into a structured descriptor.
export function parseFieldType(spec) {
  const text = String(spec || "string").trim();
  if (text.startsWith("enum:")) {
    return { kind: "enum", values: text.slice(5).split("|").map((v) => v.trim()).filter(Boolean) };
  }
  if (text.startsWith("ref:")) {
    const [collection, field] = text.slice(4).split(".");
    return { kind: "ref", collection: (collection || "").trim(), field: (field || "id").trim() };
  }
  if (text === "number" || text === "integer" || text === "int") return { kind: "number" };
  if (text === "boolean" || text === "bool") return { kind: "boolean" };
  return { kind: "string" };
}

// Value heuristics applied to plain `string` fields by their NAME, so generated rows
// look realistic (emails, dates, names, statuses, money) without per-pack config.
function stringGeneratorFor(fieldName) {
  const name = String(fieldName).toLowerCase();
  if (/(^|_)(id)$/.test(name) || name === "number") return { gen: "code", prefix: codePrefix(fieldName) };
  if (name.includes("email")) return { gen: "email" };
  if (name.includes("date") || name.endsWith("_at") || name.includes("timestamp")) return { gen: "date" };
  if (name.includes("amount") || name.includes("price") || name.includes("premium") || name.includes("cost") || name.includes("salary")) return { gen: "money" };
  if (name.includes("name") || name === "title" || name === "manager" || name === "author" || name === "approver" || name === "owner" || name === "assigned_to" || name === "caller" || name === "requested_by" || name === "requested_for") return { gen: "name" };
  if (name.includes("description") || name.includes("notes") || name === "note" || name === "comments" || name === "body" || name === "workaround" || name === "root_cause" || name.endsWith("_plan")) return { gen: "sentence" };
  if (name.includes("uri") || name.includes("url")) return { gen: "uri" };
  if (name.includes("version")) return { gen: "version" };
  return { gen: "word" };
}

function codePrefix(fieldName) {
  const cleaned = snakeCase(fieldName).replace(/_id$/, "");
  const letters = cleaned.replace(/_/g, "").slice(0, 3).toUpperCase();
  return (letters || "ROW") + "-";
}

// ── value realization (Faker tier; pure JS, no @faker-js dependency) ───────────
const WORDS = ["alpha", "bravo", "delta", "echo", "nova", "orbit", "vector", "matrix", "cipher", "quantum", "atlas", "summit", "harbor", "meridian", "cascade", "pioneer"];
const FIRST = ["Avery", "Jordan", "Riley", "Casey", "Morgan", "Quinn", "Sasha", "Devin", "Noah", "Priya", "Marco", "Lena", "Sofia", "Dwayne", "Noor", "Kai"];
const LAST = ["Johnson", "Raman", "Silva", "Becker", "Kallio", "Ortiz", "Fischer", "Nguyen", "Patel", "Costa", "Hassan", "Ibrahim", "Reyes", "Tan", "Okafor", "Singh"];
const SENTENCES = ["Generated record for simulation coverage.", "Awaiting downstream action in the workflow.", "Synthetic detail for deterministic fixtures.", "Pending review before state advances.", "Captured during automated seed generation."];

function realizeValue(generator, rng, index) {
  switch (generator.gen) {
    case "code":
      return `${generator.prefix}${String(index + 1).padStart(4, "0")}`;
    case "email": {
      const first = pick(rng, FIRST).toLowerCase();
      const last = pick(rng, LAST).toLowerCase();
      return `${first}.${last}${index}@example.com`;
    }
    case "name":
      return `${pick(rng, FIRST)} ${pick(rng, LAST)}`;
    case "date": {
      // Deterministic date within 2025-01-01 .. 2026-12-31.
      const start = Date.UTC(2025, 0, 1);
      const span = Date.UTC(2026, 11, 31) - start;
      const ts = start + Math.floor(rng() * span);
      return new Date(ts).toISOString();
    }
    case "money":
      return intBetween(rng, 100, 50000);
    case "sentence":
      return pick(rng, SENTENCES);
    case "uri":
      return `https://example.com/${pick(rng, WORDS)}/${index + 1}`;
    case "version":
      return `${intBetween(rng, 1, 12)}.${intBetween(rng, 0, 9)}.${intBetween(rng, 0, 9)}`;
    case "word":
    default:
      return `${pick(rng, WORDS)}_${index + 1}`;
  }
}

// ── buildRecipe ────────────────────────────────────────────────────────────────
/**
 * Normalize a pack contract into a recipe object.
 *
 * `contract` accepts { schema, projection, materialization, workflows, id }.
 * Returns:
 *   {
 *     id, seed,
 *     order: [collection, ...]            // topologically sorted (referents first)
 *     collections: {
 *       [name]: {
 *         primaryKey,
 *         count,                          // target row count
 *         fields: { [field]: descriptor } // generator chosen per field
 *         refs: [{ field, collection, refField }]   // FK edges out of this collection
 *       }
 *     }
 *   }
 */
export function buildRecipe(contract, { seed = 42, count } = {}) {
  const schema = contract?.schema || {};
  const collectionsSchema = schema.collections || {};
  const collections = {};
  const edges = new Map();

  for (const [name, spec] of Object.entries(collectionsSchema)) {
    const primaryKey = spec.primaryKey || "id";
    const fields = {};
    const refs = [];
    for (const [field, rawType] of Object.entries(spec.fields || {})) {
      const parsed = parseFieldType(rawType);
      if (field === primaryKey) {
        fields[field] = { kind: "pk", generator: { gen: "code", prefix: codePrefix(field) } };
        continue;
      }
      if (parsed.kind === "ref") {
        fields[field] = { kind: "ref", collection: parsed.collection, refField: parsed.field };
        refs.push({ field, collection: parsed.collection, refField: parsed.field });
        continue;
      }
      // Untyped `*_id` (no explicit ref:) that names a known collection => infer FK.
      if (parsed.kind === "string" && field.endsWith("_id") && field !== primaryKey) {
        const inferred = inferRefCollection(field, collectionsSchema);
        if (inferred && inferred !== name) {
          const refField = collectionsSchema[inferred].primaryKey || "id";
          fields[field] = { kind: "ref", collection: inferred, refField };
          refs.push({ field, collection: inferred, refField });
          continue;
        }
      }
      if (parsed.kind === "enum") {
        fields[field] = { kind: "enum", values: parsed.values };
      } else if (parsed.kind === "number") {
        fields[field] = { kind: "number" };
      } else if (parsed.kind === "boolean") {
        fields[field] = { kind: "boolean" };
      } else {
        fields[field] = { kind: "string", generator: stringGeneratorFor(field) };
      }
    }
    const resolvedCount = count !== undefined ? Number(count) : defaultCountFor(name, spec);
    collections[name] = {
      primaryKey,
      // audit_events (and any explicit 0) stays empty; everything else gets >=1 row.
      count: Math.max(resolvedCount === 0 ? 0 : 1, resolvedCount),
      fields,
      refs,
    };
    edges.set(name, refs.map((r) => r.collection).filter((c) => c && c !== name));
  }

  return {
    id: contract?.id || schema.id || "recipe",
    seed: Number(seed) >>> 0,
    order: topoSort(Object.keys(collections), edges),
    collections,
  };
}

// audit_events is an output log, not generated source data; keep it minimal.
function defaultCountFor(name, spec) {
  if (name === "audit_events") return 0;
  if (spec.primaryKey && spec.description && /relationship|edge|link/i.test(spec.description)) return 6;
  return 8;
}

function inferRefCollection(field, collectionsSchema) {
  const base = field.replace(/_id$/, "");
  for (const candidate of [base, `${base}s`, base.endsWith("y") ? `${base.slice(0, -1)}ies` : null]) {
    if (candidate && collectionsSchema[candidate]) return candidate;
  }
  return null;
}

// Kahn topological sort: referents (FK targets) come before referrers. Cycles
// (e.g. ci_relationships -> configuration_items self/peer refs) degrade gracefully:
// remaining nodes are appended in declared order, and the Faker tier self-references
// to the in-progress collection when its target hasn't been generated yet.
function topoSort(nodes, edges) {
  const indegree = new Map(nodes.map((n) => [n, 0]));
  for (const [, deps] of edges) {
    for (const dep of deps) {
      if (indegree.has(dep)) indegree.set(dep, indegree.get(dep) + 1);
    }
  }
  // We want targets first, so process by "is anyone pointing AT me first".
  // Build reverse adjacency: dep -> [dependents].
  const dependents = new Map(nodes.map((n) => [n, []]));
  const outdegree = new Map(nodes.map((n) => [n, 0]));
  for (const [node, deps] of edges) {
    const unique = [...new Set(deps.filter((d) => nodes.includes(d) && d !== node))];
    outdegree.set(node, unique.length);
    for (const dep of unique) dependents.get(dep).push(node);
  }
  const ready = nodes.filter((n) => outdegree.get(n) === 0);
  const ordered = [];
  const seen = new Set();
  while (ready.length) {
    const node = ready.shift();
    if (seen.has(node)) continue;
    seen.add(node);
    ordered.push(node);
    for (const dependent of dependents.get(node)) {
      outdegree.set(dependent, outdegree.get(dependent) - 1);
      if (outdegree.get(dependent) === 0) ready.push(dependent);
    }
  }
  for (const node of nodes) if (!seen.has(node)) ordered.push(node);
  return ordered;
}

// ── generateWithFaker ──────────────────────────────────────────────────────────
/**
 * Deterministically generate rows for every collection in recipe.order.
 * FK fields resolve to a primary key already generated for the referenced collection
 * (or, for self/forward-cyclic refs, to a key within this same collection), so the
 * output is referentially closed.
 *
 * Returns: { [collection]: row[] }
 */
export function generateWithFaker(recipe, { seed } = {}) {
  const baseSeed = (Number(seed ?? recipe.seed) >>> 0) || 0;
  const generated = {};
  const pkIndex = {}; // collection -> [pk values]

  for (const name of recipe.order) {
    const spec = recipe.collections[name];
    if (!spec) continue;
    const rows = [];
    const pkRng = rngFor(baseSeed, name, spec.primaryKey);
    for (let i = 0; i < spec.count; i += 1) {
      const row = {};
      // Primary key first so self-references can resolve.
      row[spec.primaryKey] = realizeValue(spec.fields[spec.primaryKey]?.generator || { gen: "code", prefix: codePrefix(spec.primaryKey) }, pkRng, i);
      for (const [field, desc] of Object.entries(spec.fields)) {
        if (field === spec.primaryKey) continue;
        row[field] = realizeField(field, desc, { baseSeed, collection: name, index: i, pkIndex, currentPk: row[spec.primaryKey], generated });
      }
      rows.push(row);
    }
    generated[name] = rows;
    pkIndex[name] = rows.map((r) => r[spec.primaryKey]);
  }

  // Second pass: repair forward/cyclic FKs. On the first pass a reference whose target
  // collection had not been generated yet fell back to self (a wrong-collection value).
  // Now that every collection's PK pool exists, rebind those to a real referent PK so
  // the output is fully FK-closed even across dependency cycles.
  for (const name of recipe.order) {
    const spec = recipe.collections[name];
    if (!spec) continue;
    for (const ref of spec.refs) {
      const pool = pkIndex[ref.collection];
      if (!pool || !pool.length) continue;
      const poolSet = new Set(pool.map(String));
      generated[name].forEach((row, i) => {
        const value = row[ref.field];
        if (value === null || value === undefined || value === "") return;
        if (!poolSet.has(String(value))) {
          const rng = rngFor(baseSeed, name, ref.field, "repair");
          row[ref.field] = pool[Math.floor(rng() * pool.length) % pool.length] ?? pool[i % pool.length];
        }
      });
    }
  }
  return generated;
}

function realizeField(field, desc, { baseSeed, collection, index, pkIndex, currentPk, generated }) {
  const rng = rngFor(baseSeed, collection, field);
  if (desc.kind === "enum") {
    return pick(rng, desc.values.length ? desc.values : ["unknown"]);
  }
  if (desc.kind === "number") {
    return intBetween(rng, 0, 100);
  }
  if (desc.kind === "boolean") {
    return rng() < 0.5;
  }
  if (desc.kind === "ref") {
    const pool = pkIndex[desc.collection] || (generated[desc.collection] || []).map((r) => r[desc.refField]);
    if (pool && pool.length) {
      return pool[Math.floor(rng() * pool.length) % pool.length];
    }
    // Forward/cyclic reference not yet generated: fall back to self so the value is
    // still a real PK in this collection rather than a dangling string.
    return currentPk;
  }
  return realizeValue(desc.generator || stringGeneratorFor(field), rng, index);
}

// ── toSnowfakeryYaml ────────────────────────────────────────────────────────────
/**
 * Render the recipe as a Snowfakery recipe string with a PINNED seed. FK fields use
 * `${{reference(...)}}` against the prior object; primary keys/codes use sequential
 * values keyed on `${{unique_id}}` so a Snowfakery run is also deterministic.
 */
export function toSnowfakeryYaml(recipe) {
  const lines = [
    "# Generated by scripts/lib/data-recipe.mjs — high-fidelity tier.",
    "# Deterministic: seed is pinned; the offline Faker tier reads the same recipe.",
    "- snowfakery_version: 3",
    `- option: seed`,
    `  default: ${recipe.seed}`,
  ];
  const known = new Set(recipe.order);
  for (const name of recipe.order) {
    const spec = recipe.collections[name];
    if (!spec || !spec.count) continue;
    lines.push(`- object: ${name}`);
    lines.push(`  count: ${spec.count}`);
    lines.push("  fields:");
    for (const [field, desc] of Object.entries(spec.fields)) {
      if (desc.kind === "pk") {
        lines.push(`    ${field}: "${snowExpr(`'${codePrefix(field)}' & unique_id`)}"`);
      } else if (desc.kind === "ref") {
        if (known.has(desc.collection) && desc.collection !== name) {
          lines.push(`    ${field}: "${snowExpr(`reference('${desc.collection}').${desc.refField}`)}"`);
        } else {
          lines.push(`    ${field}: "${snowExpr("unique_id")}"`);
        }
      } else if (desc.kind === "enum") {
        lines.push(`    ${field}:`);
        lines.push("      random_choice:");
        for (const value of desc.values) lines.push(`        - ${yamlScalar(value)}`);
      } else if (desc.kind === "number") {
        lines.push(`    ${field}:`);
        lines.push("      random_number:");
        lines.push("        min: 0");
        lines.push("        max: 100");
      } else if (desc.kind === "boolean") {
        lines.push(`    ${field}:`);
        lines.push("      random_choice:");
        lines.push("        - true");
        lines.push("        - false");
      } else {
        lines.push(`    ${field}:`);
        lines.push(...snowfakeryStringField(desc.generator || stringGeneratorFor(field)));
      }
    }
  }
  return lines.join("\n") + "\n";
}

function snowfakeryStringField(generator) {
  switch (generator.gen) {
    case "email":
      return ["      fake: Email"];
    case "name":
      return ["      fake: Name"];
    case "date":
      return ["      date_between:", '        start_date: "2025-01-01"', '        end_date: "2026-12-31"'];
    case "money":
      return ["      random_number:", "        min: 100", "        max: 50000"];
    case "sentence":
      return ["      fake: Sentence"];
    case "uri":
      return ["      fake: Url"];
    case "code":
      // Non-PK code-shaped string (e.g. a free `number` field): pin to a unique id.
      return [`      I_have_a_value: "${snowExpr(`'${generator.prefix}' & unique_id`)}"`];
    case "version":
    case "word":
    default:
      return ["      fake: Word"];
  }
}

function snowExpr(expression) {
  return `\${{${expression}}}`;
}

function yamlScalar(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(String(value));
}

// ── scenarioCoverageRows ────────────────────────────────────────────────────────
/**
 * For every workflow in workflows.json toolHandlers, synthesize rows that make the
 * demo exercise the workflow:
 *   - >=1 row in EACH source state that has an outgoing transition (so any declared
 *     transition can be taken).
 *   - >=1 row + a matching pending approval row for EACH approvalBlocker (so the
 *     approval gate actually fires).
 *   - a tagged row per declared failureMode key (so failure injection has a target).
 *
 * Rows are returned as an overlay: { [collection]: row[] } to be merged by PK with
 * the generated/seeded data. Generated PKs are stable & namespaced ("COV-...") so
 * repeated runs are idempotent.
 */
export function scenarioCoverageRows(contract) {
  const workflows = contract?.workflows || {};
  const handlers = workflows.toolHandlers || {};
  const schema = contract?.schema || {};
  const collectionsSchema = schema.collections || {};
  const overlay = {};
  const ensure = (name) => (overlay[name] = overlay[name] || []);

  let approvalCounter = 0;
  for (const [toolName, workflow] of Object.entries(handlers)) {
    const collection = workflow.collection;
    if (!collection || !collectionsSchema[collection]) continue;
    const primaryKey = workflow.primaryKey || collectionsSchema[collection].primaryKey || "id";
    const stateField = workflow.stateField || "state";
    const transitions = workflow.transitions || {};
    const rows = ensure(collection);

    // One row per source state with at least one outgoing transition target.
    for (const [sourceState, targets] of Object.entries(transitions)) {
      if (!Array.isArray(targets) || targets.length === 0) continue;
      const id = covId(toolName, "state", sourceState);
      rows.push(scaffoldRow(collectionsSchema[collection], primaryKey, id, {
        [stateField]: sourceState,
        last_note: `coverage: ${sourceState} can transition to ${targets.join(", ")}`,
      }));
    }

    // Approval blockers: a blocked row + a pending approval pointing at it.
    for (const blocker of workflow.approvalBlockers || []) {
      approvalCounter += 1;
      const blockedTarget = (blocker.blockedTargetStates || [])[0];
      // Put the record in a source state from which the blocked target is reachable.
      const reachableEntry = Object.entries(transitions).find(
        ([, targets]) => Array.isArray(targets) && targets.includes(blockedTarget),
      );
      const sourceForBlocked = (reachableEntry && reachableEntry[0]) || Object.keys(transitions)[0];
      const recordId = covId(toolName, "blocked", String(approvalCounter));
      rows.push(scaffoldRow(collectionsSchema[collection], primaryKey, recordId, {
        [stateField]: sourceForBlocked,
        last_note: `coverage: pending approval blocks transition to ${blockedTarget}`,
      }));
      const approvalCollection = blocker.collection || "approvals";
      if (collectionsSchema[approvalCollection]) {
        const approvalPk = collectionsSchema[approvalCollection].primaryKey || "approval_id";
        const sourceField = blocker.sourceRecordField || "source_record_id";
        const pendingState = (blocker.states || ["requested"])[0];
        ensure(approvalCollection).push(scaffoldRow(collectionsSchema[approvalCollection], approvalPk, covId(toolName, "approval", String(approvalCounter)), {
          [sourceField]: recordId,
          state: pendingState,
          comments: `coverage: gates ${recordId} (${toolName})`,
        }));
      }
    }

    // Failure modes: one tagged row per declared failure key.
    const failureModes = { ...(workflow.failureModes || {}) };
    const firstState = Object.keys(transitions)[0];
    for (const failureKey of Object.keys(failureModes)) {
      const id = covId(toolName, "fail", failureKey);
      rows.push(scaffoldRow(collectionsSchema[collection], primaryKey, id, {
        [stateField]: firstState,
        last_note: `coverage: failure-mode target for ${failureKey}`,
      }));
    }
  }
  return overlay;
}

function covId(toolName, kind, suffix) {
  return `COV-${snakeCase(toolName)}-${kind}-${snakeCase(suffix) || "x"}`.toUpperCase();
}

// Build a schema-shaped row: PK + provided overrides + deterministic defaults for any
// remaining declared field, so coverage rows are valid records the engine can read.
function scaffoldRow(collectionSchema, primaryKey, id, overrides) {
  const row = { [primaryKey]: id, ...overrides };
  const rng = rngFor(hashString(id), id);
  let i = 0;
  for (const [field, rawType] of Object.entries(collectionSchema.fields || {})) {
    if (row[field] !== undefined) continue;
    const parsed = parseFieldType(rawType);
    if (parsed.kind === "enum") row[field] = parsed.values[0] ?? "unknown";
    else if (parsed.kind === "number") row[field] = 0;
    else if (parsed.kind === "boolean") row[field] = false;
    else if (parsed.kind === "ref") row[field] = null;
    else row[field] = realizeValue(stringGeneratorFor(field), rng, i);
    i += 1;
  }
  return row;
}

// ── applyMaterialization ────────────────────────────────────────────────────────
// Faithful re-implementation of materialize-simulator-seeds.mjs alias/defaults/template
// logic so generated rows are normalized into the canonical collection shape.

function firstValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]) !== "") return row[key];
  }
  return null;
}

function renderTemplate(value, { objectName, id, index }) {
  if (typeof value !== "string") return value;
  return value
    .replaceAll("{object}", snakeCase(objectName))
    .replaceAll("{id}", String(id || ""))
    .replaceAll("{n}", String(index + 1));
}

/**
 * Normalize one row for a collection using a materialization contract.
 * Mirrors normalizeForCollection() in materialize-simulator-seeds.mjs.
 */
export function normalizeForCollection(materialization, collection, objectName, row, index) {
  const id = firstValue(row, ["id", "source_record_id", `${snakeCase(objectName)}_id`]) || `${snakeCase(objectName)}_${index + 1}`;
  const record = { ...row };
  const rules = materialization?.collections?.[collection] || {};
  const aliases = rules.fieldAliases || {};
  for (const [field, candidates] of Object.entries(aliases)) {
    const value = firstValue(row, candidates);
    if (value !== null) record[field] = value;
  }
  const defaults = { ...(rules.defaults || {}), ...(rules.objectDefaults?.[objectName] || {}) };
  for (const [field, value] of Object.entries(defaults)) {
    if (record[field] === undefined || record[field] === null || String(record[field]) === "") {
      record[field] = renderTemplate(value, { objectName, id, index });
    }
  }
  return record;
}

/**
 * Apply materialization aliases + defaults to a full set of rows for one collection.
 */
export function applyMaterialization(rows, materialization, collection, objectName = collection) {
  return (rows || []).map((row, index) => normalizeForCollection(materialization, collection, objectName, row, index));
}

/**
 * Merge two row sets by primary key (new rows win field-by-field).
 * Mirrors mergeByKey() in materialize-simulator-seeds.mjs.
 */
export function mergeByKey(existingRows, newRows, key) {
  const byKey = new Map();
  for (const row of existingRows || []) {
    const id = row?.[key];
    if (id !== undefined && id !== null && String(id) !== "") byKey.set(String(id), row);
  }
  for (const row of newRows || []) {
    const id = row?.[key];
    if (id === undefined || id === null || String(id) === "") continue;
    byKey.set(String(id), { ...(byKey.get(String(id)) || {}), ...row });
  }
  return [...byKey.values()];
}

// ── FK closure check ─────────────────────────────────────────────────────────────
/**
 * Verify every FK value in `data` resolves to a real primary key in the referenced
 * collection. Returns { ok, violations: [{collection, field, value, refCollection}] }.
 * Null/empty FK values are allowed (optional relationships).
 */
export function checkFkClosure(recipe, data) {
  const violations = [];
  const pkSets = {};
  for (const [name, spec] of Object.entries(recipe.collections)) {
    pkSets[name] = new Set((data[name] || []).map((row) => String(row[spec.primaryKey])));
  }
  for (const [name, spec] of Object.entries(recipe.collections)) {
    for (const ref of spec.refs) {
      const target = pkSets[ref.collection];
      if (!target) continue; // referenced collection not in this pack; skip
      for (const row of data[name] || []) {
        const value = row[ref.field];
        if (value === null || value === undefined || value === "") continue;
        if (!target.has(String(value))) {
          violations.push({ collection: name, field: ref.field, value, refCollection: ref.collection });
        }
      }
    }
  }
  return { ok: violations.length === 0, violations };
}
