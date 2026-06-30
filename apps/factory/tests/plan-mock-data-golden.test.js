import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

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

function walk(dir, base, out) {
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, base, out);
    // Mask the lone non-deterministic value (generatedAt ISO-8601 timestamps).
    else out[relative(base, abs)] = readFileSync(abs, "utf8").replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, "<TS>");
  }
  return out;
}

function snapshot() {
  const ws = mkdtempSync(join(tmpdir(), "ge-pmd-golden-"));
  execFileSync("node", [SCRIPT, "--dir", ws, "--usecase", USECASE, "--sourceMap", SOURCE_MAP], { stdio: "ignore" });
  const files = walk(join(ws, "mock_data"), join(ws, "mock_data"), {});
  rmSync(ws, { recursive: true, force: true });
  // Stable key order so the snapshot is independent of filesystem walk order.
  return JSON.stringify(files, Object.keys(files).sort(), 2);
}

test("plan-mock-data emits byte-identical artifacts (parity oracle)", () => {
  const snap = snapshot();
  if (process.env.GE_UPDATE_GOLDEN === "1") {
    writeFileSync(GOLDEN, snap);
    return;
  }
  const golden = readFileSync(GOLDEN, "utf8");
  expect(snap).toBe(golden);
});
