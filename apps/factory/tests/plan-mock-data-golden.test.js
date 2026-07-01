import { test, expect } from "bun:test";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGoldenOracle, walkAndSnapshot, stableSnapshotJson, compareOrUpdateGolden } from "./golden-test-helpers.mjs";

// PARITY ORACLE for the plan-mock-data.mjs decomposition.
//
// plan-mock-data emits a workspace of mock_data/** artifacts (data plans, schemas,
// load scripts, adapter contracts, simulator seed plans, …). The output is fully
// deterministic given (use case, source map) EXCEPT a single `generatedAt` ISO
// timestamp per artifact (the script does not honor GE_SOURCE_DATE). We mask the
// ISO-8601 timestamps and snapshot every emitted file into one golden, so any
// extraction that changes a single byte of any artifact fails here.
//
// Fixed input: use case "0" against the committed source map. To regenerate after an
// INTENTIONAL output change: `GE_UPDATE_GOLDEN=1 bun test apps/factory/tests/plan-mock-data-golden.test.js`
// and review the golden diff in the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "..", "scripts", "plan-mock-data.mjs");
const SOURCE_MAP = join(HERE, "..", "src", "use-case-source-map.generated.json");
const GOLDEN = join(HERE, "fixtures", "plan-mock-data-golden", "snapshot.json");
const USECASE = "0";

// Mask the lone non-deterministic value (generatedAt ISO-8601 timestamps).
const TIMESTAMP_RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;

function snapshot() {
  return runGoldenOracle({
    tmpPrefix: "ge-pmd-golden-",
    command: "node",
    args: (ws) => [SCRIPT, "--dir", ws, "--usecase", USECASE, "--sourceMap", SOURCE_MAP],
    snapshot: (ws) => {
      const dir = join(ws, "mock_data");
      return stableSnapshotJson(walkAndSnapshot(dir, { mask: TIMESTAMP_RE }));
    },
  });
}

test("plan-mock-data emits byte-identical artifacts (parity oracle)", () => {
  const snap = snapshot();
  const { golden, updated } = compareOrUpdateGolden({ snap, goldenPath: GOLDEN });
  if (updated) return;
  expect(snap).toBe(golden);
});
