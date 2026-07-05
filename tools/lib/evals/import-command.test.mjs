// `ge evals import` core: a bring-your-own ADK evalset lands in the same
// directory shape `ge evals compile` writes, and invalid sources fail loud
// via the same evalset.mjs validation (never re-implemented here).
import { test, expect } from "bun:test";
import { mkdtempSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { importEvalset } from "./import-command.mjs";
import { isDxError } from "../errors/dx-error.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "adk-minimal.evalset.json");

test("imports a valid evalset, deriving the id from the file's own evalSetId", () => {
  const out = mkdtempSync(join(tmpdir(), "ge-evals-import-"));
  const result = importEvalset({ evalset: FIXTURE, out });
  expect(result.id).toBe("benefits-minimal");
  expect(result.cases).toBe(1);
  expect(result.turns).toBe(2);
  expect(result.source).toBe(FIXTURE);
  expect(result.out).toBe(join(out, "benefits-minimal.evalset.json"));
  expect(existsSync(result.out)).toBe(true);
  // Written bytes are the raw ADK JSON, round-trip safe — not GE's internal shape.
  const written = JSON.parse(readFileSync(result.out, "utf8"));
  expect(written.evalSetId).toBe("benefits-minimal");
  expect(written.evalCases).toHaveLength(1);
});

test("an explicit --id overrides the file's own evalSetId for the output filename", () => {
  const out = mkdtempSync(join(tmpdir(), "ge-evals-import-"));
  const result = importEvalset({ evalset: FIXTURE, id: "my-custom-id", out });
  expect(result.id).toBe("my-custom-id");
  expect(result.out).toBe(join(out, "my-custom-id.evalset.json"));
  expect(existsSync(result.out)).toBe(true);
});

test("falls back to a filename slug when the source has no id of its own", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evals-import-src-"));
  const src = join(dir, "My Weird File Name!.json");
  writeFileSync(src, JSON.stringify({ evalCases: [{ evalId: "c", conversation: [{ userContent: { parts: [{ text: "hi" }] } }] }] }));
  const out = mkdtempSync(join(tmpdir(), "ge-evals-import-out-"));
  const result = importEvalset({ evalset: src, out });
  expect(result.id).toBe("My-Weird-File-Name");
  expect(existsSync(join(out, `${result.id}.evalset.json`))).toBe(true);
});

test("missing --evalset fails with the four-field error", () => {
  let thrown;
  try {
    importEvalset({});
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toContain("--evalset");
});

test("an unreadable path surfaces evalset.mjs's not-found error", () => {
  let thrown;
  try {
    importEvalset({ evalset: "/nonexistent/evalset.json", out: mkdtempSync(join(tmpdir(), "ge-evals-import-")) });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.what).toContain("evalset not found");
});

test("an invalid GE-only shape surfaces evalset.mjs's validation error", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evals-import-bad-"));
  const src = join(dir, "bad.json");
  writeFileSync(src, JSON.stringify({ suite: "nope", scenarios: [] }));
  let thrown;
  try {
    importEvalset({ evalset: src, out: mkdtempSync(join(tmpdir(), "ge-evals-import-out-")) });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toContain("ge drive --record");
});
test("an explicit --id with path separators is rejected before any write", () => {
  const out = mkdtempSync(join(tmpdir(), "ge-evals-import-"));
  let err = null;
  try {
    importEvalset({ evalset: FIXTURE, id: "../escape", out });
  } catch (e) {
    err = e;
  }
  expect(err).toBeTruthy();
  expect(String(err.message)).toContain("invalid evalset id");
  expect(existsSync(join(out, "..", "escape.evalset.json"))).toBe(false);
});

test("importing over an existing evalset refuses without force and succeeds with it", () => {
  const out = mkdtempSync(join(tmpdir(), "ge-evals-import-"));
  expect(importEvalset({ evalset: FIXTURE, id: "dupe", out }).id).toBe("dupe");
  let err = null;
  try {
    importEvalset({ evalset: FIXTURE, id: "dupe", out });
  } catch (e) {
    err = e;
  }
  expect(err).toBeTruthy();
  expect(String(err.message)).toContain("already exists");
  expect(importEvalset({ evalset: FIXTURE, id: "dupe", out, force: true }).id).toBe("dupe");
});
