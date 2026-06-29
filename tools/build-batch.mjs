#!/usr/bin/env node
// Builds agents-batch.json from the real use-case catalog for the unified
// agent build pipeline. Each entry's useCaseId is a catalog id, so the gateway
// resolves the full use-case spec server-side.

import { join } from "path";
import { writeJson } from "@ge/std/json-io";

const catalogPath = join(
  import.meta.dirname,
  "../apps/factory/src/use-cases.js",
);
const { getUseCases } = await import(catalogPath);
const USE_CASES = getUseCases();

const batch = USE_CASES.map((u) => ({
  id: u.id,
  name: u.title,
  title: u.title,
  useCaseId: u.id,
  workspaceId: `ws-${u.id}`,
  domain: u.department,
  goal: u.subtitle || `${u.title} — ${u.department} specialist agent`,
  systems: u.systems || [],
  targetStage: "publish_enterprise",
  rows: "48",
}));

const outPath = join(import.meta.dirname, "../agents-batch.json");
writeJson(outPath, batch);
console.log(`Wrote ${batch.length} agents to ${outPath}`);

const byDept = {};
for (const a of batch) byDept[a.domain] = (byDept[a.domain] || 0) + 1;
console.log("By department:", JSON.stringify(byDept));
