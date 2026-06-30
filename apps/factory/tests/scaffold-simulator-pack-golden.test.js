import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

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

function listFilesSorted(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else out.push(full);
    }
  };
  walk(root);
  return out
    .map((full) => relative(root, full).split(sep).join("/"))
    .sort();
}

function snapshot() {
  const ws = mkdtempSync(join(tmpdir(), "ge-scaffold-golden-"));
  execFileSync("node", [SCRIPT, "--id", "demo_pack", "--root", ws], { stdio: "ignore" });
  const relpaths = listFilesSorted(ws);
  const files = {};
  for (const rel of relpaths) {
    files[rel] = readFileSync(join(ws, rel), "utf8");
  }
  return { files };
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
