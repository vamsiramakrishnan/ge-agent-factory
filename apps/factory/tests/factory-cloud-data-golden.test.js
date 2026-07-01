import { test, expect } from "bun:test";
import { mkdirSync, cpSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGoldenOracle, walkAndSnapshot, stableSnapshotJson, compareOrUpdateGolden } from "./golden-test-helpers.mjs";

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

function generate() {
  return runGoldenOracle({
    tmpPrefix: "ge-cloud-data-golden-",
    setupFixture(ws) {
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
    },
    command: "node",
    args: (ws) => [FACTORY, "data-plan", "--dir", ws],
    env: () => ({ ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" }),
    snapshot: (ws) => {
      const dir = join(ws, "mock_data", "cloud");
      return stableSnapshotJson(walkAndSnapshot(dir));
    },
  });
}

test("buildCloudDataArtifacts emits byte-identical mock_data/cloud/** (parity oracle)", () => {
  const snap = generate();
  const { golden, updated } = compareOrUpdateGolden({ snap, goldenPath: GOLDEN });
  if (updated) return;
  expect(snap).toBe(golden);
});
