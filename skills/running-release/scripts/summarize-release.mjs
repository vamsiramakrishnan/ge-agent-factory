#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: summarize-release.mjs <workspace-dir>\n");
  process.exit(0);
}

const dir = args[0];
if (!dir || !existsSync(dir)) {
  process.stderr.write("usage: summarize-release.mjs <workspace-dir>\n");
  process.exit(1);
}

function readJson(rel) {
  const path = join(dir, rel);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { return { parseError: error.message }; }
}

const artifacts = {
  deployPlan: readJson("artifacts/deploy-plan.json"),
  publishPlan: readJson("artifacts/publish-plan.json"),
  loadReport: readJson("mock_data/cloud/load-report.json"),
  deployment: readJson("deployment_metadata.json"),
  toolRegistration: readJson("agent_registry_registration.json"),
  enterpriseRegistration: readJson("gemini_enterprise_registration.json"),
  liveVerification: readJson("artifacts/live-verification-report.json"),
};

const missing = Object.entries(artifacts).filter(([, value]) => !value).map(([key]) => key);
process.stdout.write(JSON.stringify({
  ok: missing.length === 0,
  missing,
  artifacts: Object.fromEntries(Object.entries(artifacts).map(([key, value]) => [key, Boolean(value)])),
  next: missing.length ? "continue_release_or_observe_remote_stage" : "record_release_evidence",
}, null, 2) + "\n");
if (missing.length) process.exit(1);
