// Per-table query_<table> tool renderer for app/tools.py. Extracted from cmdTools
// (factory.mjs) verbatim — pure function of (tables, contractIntents). Each table
// materializes one query tool whose filter parameters are derived from its columns
// and any matching contract query intent's requiredInputs. Byte output is identical
// to the former inline loop.

import { snakeCase } from "@ge/std/naming";
import { tablePrimaryKey } from "../core/contract-schema.mjs";
import { canonicalIntentToolName, tableToolName } from "./tool-naming.mjs";
import { pyJson } from "./py-emit.mjs";

// Returns the tools.py source lines for every table's query_<table> tool.
export function renderQueryToolLines({ tables, contractIntents }) {
  const lines = [];
  for (const t of tables) {
    const fn = tableToolName(t);
    const matchingQueryIntent = contractIntents.find((intent) => intent.kind === "query" && canonicalIntentToolName(intent, tables) === `query_${fn}`);
    const requiredFilters = new Set((matchingQueryIntent?.requiredInputs || []).map((input) => snakeCase(input)));
    const genericFilters = [...requiredFilters]
      .filter((input) => !["employee_id"].includes(input))
      .filter((input) => !(t.columns || []).some((column) => snakeCase(column.name) === input))
      .map((input) => ({ param: input, column: null }));
    const filterSpecs = (t.columns || [])
      .filter((c) => c.name === tablePrimaryKey(t) || requiredFilters.has(snakeCase(c.name)) || (c.type !== "number" && !["name", "email"].includes(c.name)))
      .slice(0, 6)
      .map((c) => ({ param: snakeCase(c.name), column: c.name }));
    if (requiredFilters.has("employee_id") && !filterSpecs.some((spec) => spec.param === "employee_id")) {
      filterSpecs.unshift({ param: "employee_id", column: tablePrimaryKey(t) });
    }
    const params = [...genericFilters, ...filterSpecs]
      .filter((spec, index, all) => all.findIndex((item) => item.param === spec.param) === index)
      .map((spec) => `${spec.param}: str = ""`)
      .join(", ");
    const hasJson = t.jsonPath;
    const produces = matchingQueryIntent?.produces?.length ? matchingQueryIntent.produces : [`${snakeCase(t.name)}_records`, `${snakeCase(t.name)}_summary`];
    const evidence = matchingQueryIntent?.evidenceEmitted?.length ? matchingQueryIntent.evidenceEmitted : ["source_system_record"];
    lines.push(
      `def query_${fn}(${params}${params ? ", " : ""}limit: int = 20) -> dict[str, Any]:`,
      `    """Query ${t.sourceSystem || "source system"} ${t.name}. Columns: ${(t.columns || []).map((c) => c.name).join(", ")}."""`,
      `    rows = ${hasJson ? `_json("${t.jsonPath}")` : `_csv("${t.path}")`}`,
    );
    if (genericFilters.some((spec) => spec.param === "lookup_key")) {
      lines.push(
        `    if lookup_key:`,
        `        needle = lookup_key.lower()`,
        `        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]`,
      );
    }
    if (genericFilters.some((spec) => spec.param === "date_range")) {
      lines.push(
        `    if date_range:`,
        `        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]`,
      );
    }
    for (const spec of filterSpecs) {
      lines.push(`    if ${spec.param}: rows = [r for r in rows if str(r.get("${spec.column}","")).lower() == ${spec.param}.lower()]`);
    }
    lines.push(`    return {"source_system": ${pyJson(t.sourceSystem || null)}, "source_system_id": ${pyJson(t.sourceSystemId || null)}, "table": "${t.name}", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ${pyJson(produces)}, "evidence": ${pyJson(evidence)}}`, ``);
  }
  return lines;
}
