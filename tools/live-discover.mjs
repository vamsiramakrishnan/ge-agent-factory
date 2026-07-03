#!/usr/bin/env node
// Live-layer discovery — print the verified repo bindings the live feature
// set builds on, so agents (and reviewers) never guess paths. Each binding is
// existence-checked; a missing one is reported instead of invented.
//
//   node tools/live-discover.mjs           # JSON on stdout
//   node tools/live-discover.mjs --check   # exit 1 if any binding is missing
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BINDINGS = {
  cliRoot: "tools/ge.mjs",
  commandGroups: "tools/ge",
  operatorCore: "tools/lib/factory-core.mjs",
  commandRegistry: "tools/lib/ge-command-registry.mjs",
  configSchema: "tools/lib/config-schema.mjs",
  statePaths: "tools/lib/state-paths.mjs",
  errorContract: "tools/lib/errors/dx-error.mjs",
  goldenPath: "tools/lib/golden-path.mjs",
  shipTargetSource: "tools/lib/provision.mjs",
  sseInfra: "tools/lib/exec-stream.mjs",
  eventFrames: "tools/lib/events.mjs",
  consoleApiClient: "apps/console/src/services/geClient.ts",
  agentSpecSchema: "packages/agent-spec/src/schema.ts",
  streamAssistLiveFire: "tests/e2e/stream-assist.e2e.test.mjs",
  liveTranscript: "tools/lib/live/transcript.mjs",
  liveTarget: "tools/lib/live/target.mjs",
  liveErrors: "tools/lib/live/errors.mjs",
  evalsetSchema: "tools/lib/evals/evalset.mjs",
  behavioralGraph: "tools/lib/behavioral-compiler/graph.mjs",
};

export function discover(root = ROOT) {
  const bindings = {};
  const missing = [];
  for (const [key, rel] of Object.entries(BINDINGS)) {
    const present = existsSync(join(root, rel));
    bindings[key] = { path: rel, present };
    if (!present) missing.push(key);
  }
  return { bindings, missing, ok: missing.length === 0 };
}

const invoked = process.argv[1] && new URL(`file://${resolve(process.argv[1])}`).href === import.meta.url;
if (invoked) {
  const result = discover();
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (process.argv.includes("--check") && !result.ok) process.exit(1);
}
