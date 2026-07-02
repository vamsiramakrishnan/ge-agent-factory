import { test, expect } from "bun:test";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGoldenOracle, walkAndSnapshot, stableSnapshotJson, compareOrUpdateGolden } from "./golden-test-helpers.mjs";

// PARITY ORACLE for the plan-mock-data.mjs decomposition.
//
// plan-mock-data emits a workspace of mock_data/** artifacts (data plans, schemas,
// load scripts, adapter contracts, simulator seed plans, …). The output is fully
// deterministic given (use case, source map, GE_SOURCE_DATE): the script honors
// the injectable source clock (apps/factory/src/source-clock.js), so this oracle
// pins GE_SOURCE_DATE and compares every emitted byte — including generatedAt
// timestamps — against the golden. No masking: any drift in a single byte of any
// artifact fails here.
//
// Fixed input: use case "0" against the committed source map. To regenerate after an
// INTENTIONAL output change: `GE_UPDATE_GOLDEN=1 bun test apps/factory/tests/plan-mock-data-golden.test.js`
// and review the golden diff in the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "..", "scripts", "plan-mock-data.mjs");
const SOURCE_MAP = join(HERE, "..", "src", "use-case-source-map.generated.json");
const GOLDEN = join(HERE, "fixtures", "plan-mock-data-golden", "snapshot.json");
const USECASE = "0";

// The repo-wide test pin (bunfig.test-preload.mjs) sets the same value, but the
// oracle states it explicitly so it stays byte-reproducible when this file is
// run under a caller that overrode GE_SOURCE_DATE for its own purposes.
const PINNED_SOURCE_DATE = "2026-01-01T00:00:00.000Z";

function snapshot() {
  return runGoldenOracle({
    tmpPrefix: "ge-pmd-golden-",
    command: "node",
    args: (ws) => [SCRIPT, "--dir", ws, "--usecase", USECASE, "--sourceMap", SOURCE_MAP],
    env: () => ({ ...process.env, GE_SOURCE_DATE: PINNED_SOURCE_DATE }),
    snapshot: (ws) => stableSnapshotJson(walkAndSnapshot(join(ws, "mock_data"))),
  });
}

test("plan-mock-data emits byte-identical artifacts (parity oracle)", () => {
  const snap = snapshot();
  const { golden, updated } = compareOrUpdateGolden({ snap, goldenPath: GOLDEN });
  if (updated) return;
  expect(snap).toBe(golden);
});
