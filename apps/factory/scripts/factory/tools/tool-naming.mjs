// Canonical generated-tool naming. The query tool a table materializes to, and
// the resolution of a behavior-contract intent to the tool name actually emitted
// in tools.py. Extracted from factory.mjs verbatim so both the generator and the
// renderers that wire sub-agents to tools share one source of truth — a sub-agent
// can never be wired to a tool name the generator did not emit.
//
// NOTE: tableToolName MUST mirror the query-tool naming documented in
// factory/core/contract-schema.mjs (source-qualified, de-duplicated table tail).

import { safePyName, snakeCase } from "@ge/std/naming";

// The query tool name a source table materializes to: "<source>_<table-tail>",
// de-duplicating when the table name already repeats or is prefixed by the source.
export function tableToolName(table) {
  const source = snakeCase(table.sourceSystemId || "source");
  const tableName = snakeCase(table.name || "records");
  const dedupedTable = tableName === source || tableName.startsWith(`${source}_`)
    ? tableName.slice(source.length).replace(/^_+/, "") || "records"
    : tableName;
  return snakeCase(`${source}_${dedupedTable}`);
}

// The bare table tail a query intent refers to (source prefix stripped).
export function queryIntentTableName(intent) {
  const source = snakeCase(intent?.sourceSystemId || "");
  const name = snakeCase(intent?.name || "").replace(/^query_/, "");
  if (source && name.startsWith(`${source}_`)) return name.slice(source.length + 1) || "records";
  return name || "records";
}

// Resolve a behavior-contract intent to the tool name actually emitted in tools.py.
// Query intents resolve to the query_<table> tool of their backing table (matched by
// source + table name); everything else is a safe Python identifier of the intent name.
export function canonicalIntentToolName(intent, tables = []) {
  if (!intent?.name) return "";
  if (intent.kind !== "query") return safePyName(intent.name);
  const source = snakeCase(intent.sourceSystemId || "");
  const tableName = queryIntentTableName(intent);
  // Materialized contract tables are now source-qualified (e.g. "workday_records"),
  // so accept either the bare tail or the source-qualified form when matching by
  // name — both alongside a matching sourceSystemId.
  const qualifiedName = source && tableName !== source && !tableName.startsWith(`${source}_`)
    ? snakeCase(`${source}_${tableName}`)
    : tableName;
  const nameMatches = (table) => {
    const tn = snakeCase(table.name || "");
    return tn === tableName || tn === qualifiedName;
  };
  const matchingTable = tables.find((table) => (
    snakeCase(table.sourceSystemId || "") === source && nameMatches(table)
  ));
  if (matchingTable) return `query_${tableToolName(matchingTable)}`;
  // Fallback by name only is allowed ONLY when it does not cross source systems:
  // require the candidate's sourceSystemId to match the intent's, so a same-tail
  // table from a DIFFERENT system can never claim this intent's tool name.
  const sameNameTables = tables.filter((table) => (
    nameMatches(table) && snakeCase(table.sourceSystemId || "") === source
  ));
  if (sameNameTables.length === 1) return `query_${tableToolName(sameNameTables[0])}`;
  return safePyName(intent.name);
}

// Resolve an eval's expected tool-call name (which references an intent by name)
// to the canonical emitted tool name, so eval expectations match tools.py.
export function canonicalExpectedToolCallName(name, intents = [], tables = []) {
  const safeName = safePyName(name);
  const intent = intents.find((candidate) => safePyName(candidate?.name || "") === safeName);
  return intent ? canonicalIntentToolName(intent, tables) : safeName;
}
