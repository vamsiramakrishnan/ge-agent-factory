#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: summarize-gate.mjs <workspace-dir>\n");
  process.exit(0);
}

const dir = args[0];
if (!dir) {
  process.stderr.write("usage: summarize-gate.mjs <workspace-dir>\n");
  process.exit(1);
}
if (!existsSync(dir)) {
  process.stderr.write(`workspace dir not found: ${dir}\n`);
  process.exit(1);
}

function readJson(rel) {
  const path = join(dir, rel);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { return { parseError: error.message, path: rel }; }
}

const artifacts = {
  workspace: readJson("workspace.json"),
  // Canonical doctor artifact (ARTIFACT_PATHS.workspaceDoctor); the second
  // name is a legacy alias kept for older workspaces.
  doctor: readJson("artifacts/workspace-doctor.json") ?? readJson("artifacts/checking-workspaces.json"),
  repair: readJson("artifacts/workspace-repair.json"),
  validation: readJson("artifacts/validation-report.json"),
  specCodeTrace: readJson("artifacts/spec-code-trace.json"),
  promotion: readJson("artifacts/promotion-packet.json"),
  deployPlan: readJson("artifacts/deploy-plan.json"),
  publishPlan: readJson("artifacts/publish-plan.json"),
};

const blockers = [
  ...(artifacts.doctor?.blockers || []),
  ...(artifacts.validation?.specCodeTrace?.blockers || []).map((message) => ({ id: "spec-code:blocker", message })),
  ...(artifacts.repair?.finalDoctor?.blockers || []),
];

process.stdout.write(JSON.stringify({
  ok: blockers.length === 0,
  workspace: artifacts.workspace?.id || artifacts.doctor?.workspace || dir,
  stage: artifacts.doctor?.stage || null,
  artifacts: Object.fromEntries(Object.entries(artifacts).map(([key, value]) => [key, Boolean(value)])),
  blockers,
  repairAttempts: artifacts.repair?.attempts?.length || 0,
}, null, 2) + "\n");
