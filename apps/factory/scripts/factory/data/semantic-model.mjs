// Semantic / metadata model generator for NL→SQL.
//
// Deterministically derives a semantic layer from the generated manifest so that
// the BigQuery MCP (and any NL→SQL engine) can generate schema-grounded SQL over
// the per-agent dataset: table/column descriptions, keys, joins, measures, and a
// business glossary. Written at the data-generation stage to
// mock_data/metadata/semantic-model.json; the BQ descriptions are applied to the
// dataset at load_data, and the agent can introspect the model via describe_data_model().

import { snakeCase } from "@ge/std/naming";

// Lightweight, deterministic column description from name + type + domain hints.
function describeColumn(name, type) {
  const n = String(name).toLowerCase();
  const syn = [];
  let desc;
  if (n === "id" || n.endsWith("_id")) { desc = "Unique identifier."; syn.push("id", "key"); }
  else if (n.includes("account")) { desc = "Account number / GL account."; syn.push("account", "gl account"); }
  else if (n.includes("amount") || n.includes("balance") || n.includes("value") || n.includes("total")) { desc = "Monetary amount."; syn.push("amount", "value", "balance"); }
  else if (n.includes("date") || n.includes("_at") || n.includes("timestamp")) { desc = "Date/timestamp."; syn.push("date", "when"); }
  else if (n.includes("status") || n.includes("state")) { desc = "Status / lifecycle state."; syn.push("status", "state"); }
  else if (n.includes("currency")) { desc = "Currency code (ISO 4217)."; }
  else if (n.includes("name") || n.includes("description") || n.includes("title")) { desc = "Human-readable label."; }
  else desc = `${name.replace(/[_-]+/g, " ")} (${type}).`;
  return { name, type, description: desc, ...(syn.length ? { synonyms: Array.from(new Set(syn)) } : {}) };
}

// Detect joins: a non-id column name (or primary key) shared by ≥2 tables is a join key.
function detectJoins(tables) {
  const byCol = new Map();
  for (const t of tables) {
    for (const c of t.columns || []) {
      const k = String(c.name).toLowerCase();
      if (k === "id") continue; // table-local surrogate, not a cross-table join
      if (!byCol.has(k)) byCol.set(k, []);
      byCol.get(k).push(t.name);
    }
  }
  const joins = [];
  for (const [col, owners] of byCol) {
    if (owners.length < 2) continue;
    // Only treat key-ish columns as joins (pk, *_id, account, *_key).
    if (!(col.endsWith("_id") || col.endsWith("_key") || col === "account" || owners.some((o) => (tables.find((t) => t.name === o)?.primaryKey || "").toLowerCase() === col))) continue;
    for (let i = 0; i < owners.length - 1; i++) {
      joins.push({ left: `${owners[i]}.${col}`, right: `${owners[i + 1]}.${col}`, on: col, type: "many-to-one" });
    }
  }
  return joins;
}

// Build the semantic model from a generated manifest.
export function buildSemanticModel(manifest, { agentId } = {}) {
  const tables = (manifest?.tables || []).map((t) => ({
    name: t.name,
    sourceSystem: t.sourceSystem || null,
    description: t.sourceDescription || `${t.name.replace(/[_-]+/g, " ")} records from ${t.sourceSystem || "the source system"}.`,
    grain: `one row per ${t.name.replace(/[_-]+/g, " ").replace(/s$/, "")}`,
    primaryKey: t.primaryKey || null,
    rowCount: t.rowCount || null,
    columns: (t.columns || []).map((c) => {
      const col = describeColumn(c.name, c.type);
      if (t.primaryKey && c.name === t.primaryKey) col.isKey = true;
      return col;
    }),
  }));

  const bc = manifest?.useCaseSpec?.behaviorContract || {};
  // Measures from calculation tool-intents + the primary objective KPI.
  const measures = (bc.toolIntents || [])
    .filter((i) => i && i.kind === "calculation" && i.name)
    .map((i) => ({ name: snakeCase(i.name), description: i.description || `Computed metric: ${i.name}.`, basis: i.produces || [] }));

  // Glossary: one entry per source system + per documented KPI term.
  const glossary = (manifest?.systems || []).map((s) => ({
    term: s.name || s.id,
    definition: s.responsibility || s.description || `Source system: ${s.name || s.id}.`,
    maps_to: tables.filter((t) => t.sourceSystem === (s.name || s.id)).map((t) => t.name),
  }));

  return {
    id: `${snakeCase(manifest?.id || agentId || "agent")}_semantic_model`,
    generatedAt: manifest?.generatedAt || null,
    dataset: `agent_${snakeCase(agentId || manifest?.id || "agent")}`,
    primaryObjective: bc.primaryObjective || null,
    tables,
    joins: detectJoins(manifest?.tables || []),
    measures,
    glossary,
    // Ready-to-apply BigQuery descriptions (table + column) for load_data → bq update,
    // so the BigQuery MCP generates schema-grounded SQL natively.
    bigquery: {
      tables: tables.map((t) => ({
        table: t.name,
        description: t.description,
        columns: t.columns.map((c) => ({ name: c.name, description: c.description })),
      })),
    },
  };
}
