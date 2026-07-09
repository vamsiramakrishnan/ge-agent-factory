// Snapshot contract for the CS-2 three-question board: bare `ge` (and its
// `ge status` spelling) must answer position / blocker / next before anything
// else, and the --json result must carry the goldenPath structure additively
// (every pre-existing key stays).
import { test, expect } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function runGe(args) {
  // Isolated state root so a developer's real .ge state can't leak into the
  // snapshot; NO_COLOR for stable bytes.
  return spawnSync("bun", ["tools/ge.mjs", ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    timeout: 60000,
    env: { ...process.env, GE_STATE_ROOT: mkdtempSync(join(tmpdir(), "ge-board-")), NO_COLOR: "1", GE_LEDGER: "0" },
  });
}

test("bare ge answers the three questions, in order, before the Operate detail", () => {
  const res = runGe([]);
  expect(res.status).toBe(0);
  const lines = res.stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  expect(lines[0]).toBe("GE Agent Factory");
  expect(lines[1]).toMatch(/^capture → prove → handoff/);
  expect(lines[2]).toMatch(/^blocker\s+/);
  expect(lines[3]).toMatch(/^next\s+ge /); // an exact, copy-pasteable command
}, 20_000);

test("ge status is the same board as bare ge", () => {
  const bare = runGe([]);
  const status = runGe(["status"]);
  expect(status.status).toBe(0);
  // Same renderer; the position/blocker/next header must match byte-for-byte.
  expect(status.stdout.split("\n").slice(0, 4)).toEqual(bare.stdout.split("\n").slice(0, 4));
}, 20_000);

test("--json carries goldenPath additively alongside every pre-existing board key", () => {
  const res = runGe(["--json"]);
  expect(res.status).toBe(0);
  const board = JSON.parse(res.stdout);
  // Pre-existing contract (unchanged keys).
  for (const key of ["mode", "clientDoes", "project", "app", "region", "planes", "next"]) {
    expect(board).toHaveProperty(key);
  }
  // The new structure.
  expect(board.goldenPath.stages.map((s) => s.id)).toEqual(["capture", "prove", "handoff"]);
  expect(typeof board.goldenPath.next).toBe("string");
  expect(board.goldenPath.next.length).toBeGreaterThan(0);
  expect(board.goldenPath).toHaveProperty("blocker");
  expect(["capture", "prove", "handoff"]).toContain(board.goldenPath.current);
}, 20_000);
