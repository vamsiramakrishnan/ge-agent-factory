#!/usr/bin/env node
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: summarize-factory-run.mjs <running-factory.json>\n");
  process.exit(0);
}

const path = args[0];
if (!path) {
  process.stderr.write("usage: summarize-factory-run.mjs <running-factory.json>\n");
  process.exit(1);
}

let run;
try { run = JSON.parse(readFileSync(path, "utf8")); }
catch (error) {
  process.stderr.write(`invalid JSON: ${error.message}\n`);
  process.exit(1);
}

const items = run.workItems || run.items || [];
const statuses = {};
for (const item of items) statuses[item.status || "unknown"] = (statuses[item.status || "unknown"] || 0) + 1;
process.stdout.write(JSON.stringify({
  ok: run.ok !== false,
  targetStage: run.targetStage || null,
  totals: run.totals || { total: items.length },
  statuses,
  next: run.ok === false ? "inspect_failed_items" : "workspace_gate_repair",
}, null, 2) + "\n");
