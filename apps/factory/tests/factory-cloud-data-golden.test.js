import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

// PARITY ORACLE for buildCloudDataArtifacts (factory.mjs), invoked via `factory
// data-plan`. Given a manifest with JSON-backed table fixtures, it is fully
// deterministic — every BigQuery schema/ndjson row, the load script, and the
// cloud-data-manifest/mcp-tools JSON are pure functions of the input; no
// Date.now/Math.random, and the load script is only ever WRITTEN, never executed
// (no live gcloud/bq calls happen in this test).
//
// Scope: this oracle snapshots ONLY mock_data/cloud/** — the artifact tree
// buildCloudDataArtifacts itself controls. `factory data-plan` also invokes
// buildSourceIntegrationPlan (a different function), whose output embeds the
// workspace's tmp path in generated command strings and is out of scope here.
//
// Fixture: the asc-606-contract-analyzer manifest (reused from tools-golden,
// which already declares jsonPath per table) plus synthetic JSON row data for
// each table — deterministic, mixing integer/decimal/boolean/string columns so
// bigQueryType's branches (FLOAT64 / INT64 / BOOL / STRING) are all exercised.
//
// To regenerate after an INTENTIONAL output change:
//   GE_SOURCE_DATE=2026-01-01T00:00:00Z node apps/factory/scripts/factory.mjs data-plan --dir <tmp-with-fixture>
//   then re-snapshot mock_data/cloud/** the same way this test does and
//   overwrite fixtures/cloud-data-golden/snapshot.json; review the diff in the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(HERE, "fixtures", "cloud-data-golden", "fixtures");
const FACTORY = join(HERE, "..", "scripts", "factory.mjs");
const GOLDEN = join(HERE, "fixtures", "cloud-data-golden", "snapshot.json");

function walk(dir, base, out) {
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, base, out);
    else out[relative(base, abs)] = readFileSync(abs, "utf8");
  }
  return out;
}

function generate() {
  const ws = mkdtempSync(join(tmpdir(), "ge-cloud-data-golden-"));
  mkdirSync(join(ws, "mock_systems"), { recursive: true });
  cpSync(FIXTURE_DIR, join(ws, "fixtures"), { recursive: true });
  writeFileSync(
    join(ws, "mock_systems", "pipeline.json"),
    JSON.stringify({
      name: "asc606",
      domain: "finance",
      steps: { init: { status: "done" }, schema: { status: "done" }, generate: { status: "done" } },
      currentStep: "generate",
    }),
  );
  const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
  execFileSync("node", [FACTORY, "data-plan", "--dir", ws], { stdio: "ignore", env });
  const files = walk(join(ws, "mock_data", "cloud"), join(ws, "mock_data", "cloud"), {});
  rmSync(ws, { recursive: true, force: true });
  return JSON.stringify(files, Object.keys(files).sort(), 2);
}

test("buildCloudDataArtifacts emits byte-identical mock_data/cloud/** (parity oracle)", () => {
  const snap = generate();
  if (process.env.GE_UPDATE_GOLDEN === "1") {
    writeFileSync(GOLDEN, snap);
    return;
  }
  const golden = readFileSync(GOLDEN, "utf8");
  expect(snap).toBe(golden);
});
