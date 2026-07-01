import { test, expect } from "bun:test";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGoldenOracle, walkAndSnapshot } from "./golden-test-helpers.mjs";

// PARITY ORACLE for the scaffold-simulator-pack.mjs decomposition.
//
// scaffold-simulator-pack is a flag-driven CLI scaffolder with no use-case catalog
// dependency. With --root <DIR> set, ALL writes (the pack dir + registry.json) go under
// <DIR> — it never touches the repo. It emits ~7 files and is fully deterministic
// (no timestamps / no randomness), so NO masking is required: we snapshot every emitted
// file (sorted by relpath) into one JSON snapshot and assert byte-identical to a committed
// golden. Any extraction that changes a single byte of any emitted file fails here.
//
// All generation happens inside an OS tmpdir (mkdtempSync) — never the repo.
//
// If a change INTENTIONALLY alters generated output, regenerate the golden:
//   GE_SCAFFOLD_GOLDEN_WRITE=1 bun test apps/factory/tests/scaffold-simulator-pack-golden.test.js
// and review the golden diff as part of the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "..", "scripts", "scaffold-simulator-pack.mjs");
const GOLDEN_PATH = join(HERE, "fixtures", "scaffold-simulator-pack-golden", "snapshot.json");

function snapshot() {
  return runGoldenOracle({
    tmpPrefix: "ge-scaffold-golden-",
    command: "node",
    args: (ws) => [SCRIPT, "--id", "demo_pack", "--root", ws],
    snapshot: (ws) => ({ files: walkAndSnapshot(ws) }),
    // Original test never cleaned up its tmpdir; preserve that (harmless OS-tmpdir
    // scratch, but changing it is outside the scope of this scaffolding refactor).
    cleanup: false,
  });
}

test("scaffold-simulator-pack emits byte-identical pack + registry (parity oracle)", () => {
  const snap = snapshot();
  if (process.env.GE_SCAFFOLD_GOLDEN_WRITE === "1") {
    writeFileSync(GOLDEN_PATH, `${JSON.stringify(snap, null, 2)}\n`);
  }
  expect(existsSync(GOLDEN_PATH)).toBe(true);
  const golden = JSON.parse(readFileSync(GOLDEN_PATH, "utf8"));
  expect(snap).toEqual(golden);
});
