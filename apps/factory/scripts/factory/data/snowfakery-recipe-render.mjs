// Snowfakery recipe field renderers for cmdSnowfakeryRecipe: map a schema
// column to its Snowfakery fake/expression, and render the resulting value
// tree as the recipe's YAML fragment. Extracted from factory.mjs verbatim —
// pure functions, byte output identical to the former inline helpers. Distinct
// from ./yaml-render.mjs, which serves the plan-mock-data pipeline with a
// different (yaml-package-backed) quoting convention.
import { bigQuerySafeName } from "./bigquery-types.mjs";

export function snowfakeryFakeForColumn(col) {
  const name = String(col.name || "").toLowerCase();
  const type = String(col.type || "string").toLowerCase();
  if (type === "ref") return { reference: col.ref ? bigQuerySafeName(col.ref.split(".")[0]) : "Unknown" };
  if (type === "number") return { random_number: { min: col.min ?? 0, max: col.max ?? 1000 } };
  if (type === "float") return { random_number: { min: col.min ?? 0, max: col.max ?? 1000 } };
  if (type === "boolean") return "${{random_choice(true, false)}}";
  if (type === "date") return { date_between: { start_date: col.min || "2024-01-01", end_date: col.max || "2026-12-31" } };
  if (type === "enum") return `\${{random_choice(${(col.values || ["A", "B", "C"]).map((v) => JSON.stringify(v)).join(", ")} )}}`;
  if (type.startsWith("person.") || name.includes("name")) return { fake: "Name" };
  if (type.startsWith("internet.email") || name.includes("email")) return { fake: "Email" };
  if (name.includes("company") || name.includes("vendor") || name.includes("supplier") || type.startsWith("company.")) return { fake: "Company" };
  if (name.includes("city")) return { fake: "City" };
  if (name.includes("state")) return { fake: "State" };
  if (name.includes("address")) return { fake: "StreetAddress" };
  if (name.includes("phone")) return { fake: "PhoneNumber" };
  if (name.includes("description") || name.includes("notes") || name.includes("body") || type.includes("paragraph")) return { fake: "Paragraph" };
  if (name.includes("title") || type.includes("sentence")) return { fake: "Sentence" };
  if (type === "seq") return `\${{unique_id}}`;
  return { fake: "Word" };
}

export function renderYamlValue(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (typeof value === "string") return `${pad}${JSON.stringify(value)}`;
  if (typeof value === "number" || typeof value === "boolean") return `${pad}${value}`;
  if (!value || typeof value !== "object") return `${pad}null`;
  const lines = [];
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object" && !Array.isArray(child)) {
      lines.push(`${pad}${key}:`);
      lines.push(renderYamlValue(child, indent + 2));
    } else {
      lines.push(`${pad}${key}: ${JSON.stringify(child)}`);
    }
  }
  return lines.join("\n");
}
