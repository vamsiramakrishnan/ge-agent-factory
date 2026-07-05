#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write("usage: audit-console-surface.mjs\n\nAudits console/server files for GE factory command and autopilot surfaces. Outputs JSON.\n");
  process.exit(0);
}

const checks = [
  ["apps/console/src/server/ge-api.mjs", ["/api/ge/mission", "autopilotStart", "jobList"]],
  ["apps/console/src/server/transport.mjs", ["startAutopilotRun", "resumeAutopilotRun", "missionPlan"]],
  ["apps/console/src/server/job-store.mjs", ["autopilot_runs", "autopilot_items", "autopilot_events"]],
  ["apps/console/src/services/geClient.ts", ["mission:", "startAutopilot", "workspaceDoctor"]],
  ["apps/console/src/views/Autopilot.tsx", ["Mission Contract", "Mode Contract", "Start Autopilot"]],
  ["packages/capability-registry/src/registry.mjs", ["agents.build", "handoff", "data.up"]],
];

const results = checks.map(([path, needles]) => {
  if (!existsSync(path)) return { path, ok: false, missing: ["file"] };
  const text = readFileSync(path, "utf8");
  const missing = needles.filter((needle) => !text.includes(needle));
  return { path, ok: missing.length === 0, missing };
});

const failed = results.filter((item) => !item.ok);
process.stdout.write(JSON.stringify({ ok: failed.length === 0, results }, null, 2) + "\n");
if (failed.length) process.exit(1);
