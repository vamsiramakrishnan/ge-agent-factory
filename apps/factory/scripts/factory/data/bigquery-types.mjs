// BigQuery type/name inference shared by the cloud-data packager and the
// Snowfakery recipe renderer. Extracted from factory.mjs verbatim — pure
// functions, byte output identical to the former inline helpers.

import { bigQuerySafeName } from "@ge/std/naming";

// Field names that conceptually carry decimals even if a small sample happens
// to be whole numbers (e.g. an `amount` whose first few rows are round). Used
// only as a backstop — value-based inference below is the primary signal.
const DECIMAL_NAME_HINT = /(amount|amt|rate|pct|percent|ratio|price|cost|value|metric|balance|total|avg|average|score|variance|tax|fee|spend|revenue|margin)/i;

function isIntegerValue(v) {
  return typeof v === "number" && Number.isFinite(v) && Number.isInteger(v);
}

// Decide a BigQuery numeric type for a "number"/"float" column. Sampling the
// actual generated values is the real fix for the "first row was whole" trap:
// a field is INT64 only when EVERY sampled value is an integer; any decimal
// (or a decimal-ish field name) forces FLOAT64 so `bq load` accepts the data.
export function bigQueryNumericType(col, sampledValues = []) {
  const type = String(col?.type || "").toLowerCase();
  if (type === "float") return "FLOAT64";
  const name = String(col?.name || "");
  const numbers = sampledValues.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (numbers.some((v) => !Number.isInteger(v))) return "FLOAT64";
  // Backstop: decimal-ish names go FLOAT64 unless the sample proves integer-only
  // AND there is enough of a sample to trust it.
  if (DECIMAL_NAME_HINT.test(name) && numbers.length === 0) return "FLOAT64";
  if (DECIMAL_NAME_HINT.test(name) && numbers.length > 0 && numbers.every(isIntegerValue)) {
    // Name says decimal but every sampled value is whole — trust the data only
    // when the sample is meaningful; otherwise stay FLOAT64 to be safe.
    return numbers.length >= 8 ? "INT64" : "FLOAT64";
  }
  return "INT64";
}

export function bigQueryType(col, sampledValues = []) {
  const type = String(col?.type || "string").toLowerCase();
  if (type === "number" || type === "float") return bigQueryNumericType(col, sampledValues);
  if (type === "boolean") return "BOOL";
  if (type === "date") return "DATE";
  // Schema may not declare a numeric type (e.g. columns rebuilt from generated
  // rows collapse to "number"); fall back to the sampled values to catch decimals.
  if (sampledValues.some((v) => typeof v === "number" && Number.isFinite(v))) {
    return bigQueryNumericType(col, sampledValues);
  }
  return "STRING";
}

// Canonical implementation lives in @ge/std/naming (shared with
// @ge/synthkit/snowfakery's contract-dialect renderer); re-exported here so
// this module keeps its historical surface for the packager call sites.
export { bigQuerySafeName };

export function rowsToNdjson(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
}
