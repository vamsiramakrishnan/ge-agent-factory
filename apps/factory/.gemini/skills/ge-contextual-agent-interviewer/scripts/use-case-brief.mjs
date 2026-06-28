#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const get = (name, fallback = "") => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};

const department = get("department").toLowerCase();
const query = get("query").toLowerCase();
const limit = Number(get("limit", "5")) || 5;
const path = resolve("generated/use-cases.generated.json");
const useCases = JSON.parse(await readFile(path, "utf8"));

function score(item) {
  const haystack = [
    item.title,
    item.subtitle,
    item.persona,
    item.layer,
    item.triggerType,
    ...(item.systems || []),
    ...(item.statusQuo || []),
    ...(item.agentification || []),
    ...(item.kpis || []).flatMap((kpi) => [kpi.label, kpi.before, kpi.after]),
  ].join(" ").toLowerCase();
  let value = 0;
  if (department && item.department === department) value += 10;
  for (const token of query.split(/\s+/).filter(Boolean)) {
    if (haystack.includes(token)) value += 2;
    if (item.title.toLowerCase().includes(token)) value += 3;
  }
  return value;
}

const results = useCases
  .filter((item) => !department || item.department === department)
  .map((item) => ({ item, score: score(item) }))
  .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
  .slice(0, limit)
  .map(({ item }) => item);

for (const item of results) {
  console.log(`# ${item.title}`);
  console.log(`department: ${item.department}`);
  console.log(`persona: ${item.persona || "unknown"}`);
  console.log(`source: ${item.sourcePath}`);
  console.log(`systems: ${(item.systems || []).join(", ") || "none listed"}`);
  if (item.kpis?.length) {
    console.log(`kpis: ${item.kpis.map((kpi) => `${kpi.label}: ${kpi.before} -> ${kpi.after}`).join("; ")}`);
  }
  if (item.statusQuo?.[0]) console.log(`as-is: ${item.statusQuo[0]}`);
  if (item.agentification?.[0]) console.log(`to-be: ${item.agentification[0]}`);
  console.log("");
}
