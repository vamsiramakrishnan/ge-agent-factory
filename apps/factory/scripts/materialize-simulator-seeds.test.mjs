import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const CLI = join(SCRIPT_DIR, "materialize-simulator-seeds.mjs");

// Smallest end-to-end seam: a workspace whose index lists one simulator with no
// collection mappings, so the run exercises exactly the timestamp-stamping paths
// (seed _meta.materializedAt + report generatedAt) without needing snowfakery output.
function makeWorkspace() {
  const workspace = mkdtempSync(join(tmpdir(), "ge-materialize-clock-"));
  const simDir = join(workspace, "mock_data", "simulators");
  mkdirSync(simDir, { recursive: true });
  writeFileSync(join(simDir, "index.json"), JSON.stringify({
    id: "clock-test-index",
    simulators: [{ simulatorId: "servicenow", collectionMappings: [] }],
  }, null, 2));
  return workspace;
}

function run(workspace, env = {}) {
  const result = Bun.spawnSync(["node", CLI, "--dir", workspace], {
    cwd: REPO_ROOT,
    env: { ...process.env, ...env },
  });
  expect(result.exitCode).toBe(0);
  return {
    report: JSON.parse(readFileSync(join(workspace, "mock_data", "simulators", "materialization-report.json"), "utf8")),
    seed: JSON.parse(readFileSync(join(workspace, "mock_data", "simulators", "servicenow", "seed.json"), "utf8")),
  };
}

describe("materialize-simulator-seeds: injectable clock", () => {
  test("GE_SOURCE_DATE pins materializedAt and generatedAt", () => {
    const workspace = makeWorkspace();
    const pinned = "2026-01-02T03:04:05.000Z";
    try {
      const { report, seed } = run(workspace, { GE_SOURCE_DATE: pinned });
      expect(report.generatedAt).toBe(pinned);
      expect(seed._meta.materializedAt).toBe(pinned);
      // One clock capture per run: every artifact in the run agrees.
      expect(report.generatedAt).toBe(seed._meta.materializedAt);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  test("without GE_SOURCE_DATE the stamps fall back to wall clock", () => {
    const workspace = makeWorkspace();
    const env = { ...process.env };
    delete env.GE_SOURCE_DATE;
    try {
      const before = Date.now();
      const result = Bun.spawnSync(["node", CLI, "--dir", workspace], { cwd: REPO_ROOT, env });
      expect(result.exitCode).toBe(0);
      const after = Date.now();
      const report = JSON.parse(readFileSync(join(workspace, "mock_data", "simulators", "materialization-report.json"), "utf8"));
      const stamp = Date.parse(report.generatedAt);
      expect(stamp).toBeGreaterThanOrEqual(before - 1000);
      expect(stamp).toBeLessThanOrEqual(after + 1000);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });
});
