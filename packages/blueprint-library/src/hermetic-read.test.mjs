// Root-cause gate for the "read surface writes a tracked file" class (blindspot
// audit, class: non-hermetic-write).
//
// readLibraryIndex() is the read path behind every read-only library surface
// (ge library stats/list/doctor, the MCP read tool, the console GET). It used to
// call the WRITING generateLibraryIndex() whenever okf/library/index.json was
// absent, dirtying two git-tracked files (index.json + index.schema.json) from a
// pure read. This gate exercises the read surfaces and asserts the git working
// tree under okf/library/ stays clean — so a read path that writes a tracked
// file fails by construction.
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readLibraryIndex, searchBlueprints, buildLibraryIndex } from "./index.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

function porcelain(pathspec) {
  return execFileSync(process.env.GIT_BIN || "git", ["status", "--porcelain", "--", pathspec], {
    cwd: REPO_ROOT, encoding: "utf8",
  }).trim();
}

describe("library read surfaces are hermetic", () => {
  test("readLibraryIndex + search + refresh leave okf/library/ git-clean", async () => {
    const before = porcelain("okf/library");
    await readLibraryIndex();                 // absent → build in memory; present → read
    await readLibraryIndex({ refresh: true }); // refresh must NOT write from a read call
    await searchBlueprints("aml");
    await buildLibraryIndex();                 // pure compute
    const after = porcelain("okf/library");
    expect(after).toBe(before); // no read path created or modified a tracked file
  });
});
