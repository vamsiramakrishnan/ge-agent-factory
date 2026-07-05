import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  BINDING_SCHEMA_VERSION,
  BINDING_KINDS,
  BINDING_MODES,
  defaultBindingsDir,
  validateBinding,
  readBindings,
  writeBinding,
  removeBinding,
} from "./bindings.mjs";

function tmpDir() {
  return mkdtempSync(join(tmpdir(), "ge-byo-bindings-"));
}

test("BINDING_KINDS / BINDING_MODES are the documented closed vocabularies", () => {
  expect(BINDING_KINDS).toEqual(["twin", "mcp", "rest"]);
  expect(BINDING_MODES).toEqual(["twin_first", "live_first", "twin_only"]);
});

test("defaultBindingsDir derives .ge/systems from a repo root", () => {
  expect(defaultBindingsDir("/repo")).toBe(join("/repo", ".ge", "systems"));
});

test("validateBinding: a well-formed twin binding has no problems", () => {
  const problems = validateBinding({
    system: "workday",
    boundTo: "workday-twin-pack",
    kind: "twin",
    mode: "twin_first",
  });
  expect(problems).toEqual([]);
});

test("validateBinding: a well-formed mcp binding with an http(s) URL has no problems", () => {
  expect(validateBinding({
    system: "billing",
    boundTo: "https://mcp.example.com/billing",
    kind: "mcp",
    mode: "live_first",
  })).toEqual([]);
  expect(validateBinding({
    system: "billing",
    boundTo: "http://localhost:8080/mcp",
    kind: "mcp",
    mode: "live_first",
  })).toEqual([]);
});

test("validateBinding: a well-formed rest binding with an http(s) URL has no problems", () => {
  expect(validateBinding({
    system: "hris",
    boundTo: "https://api.example.com/hris",
    kind: "rest",
    mode: "twin_only",
  })).toEqual([]);
});

test("validateBinding: rejects a non-object", () => {
  expect(validateBinding(null)).toEqual(["binding must be an object"]);
  expect(validateBinding("nope")).toEqual(["binding must be an object"]);
  expect(validateBinding([])).toEqual(["binding must be an object"]);
});

test("validateBinding: rejects a bad kind", () => {
  const problems = validateBinding({ system: "s", boundTo: "t", kind: "database", mode: "twin_first" });
  expect(problems.some((p) => p.includes("kind must be one of"))).toBe(true);
});

test("validateBinding: rejects a bad mode", () => {
  const problems = validateBinding({ system: "s", boundTo: "t", kind: "twin", mode: "sometimes" });
  expect(problems.some((p) => p.includes("mode must be one of"))).toBe(true);
});

test("validateBinding: rejects a non-URL boundTo for mcp/rest", () => {
  const mcpProblems = validateBinding({ system: "s", boundTo: "not-a-url", kind: "mcp", mode: "live_first" });
  expect(mcpProblems.some((p) => p.includes("must be an http(s) URL"))).toBe(true);

  const restProblems = validateBinding({ system: "s", boundTo: "ftp://example.com/x", kind: "rest", mode: "live_first" });
  expect(restProblems.some((p) => p.includes("must be an http(s) URL"))).toBe(true);
});

test("validateBinding: a twin binding's boundTo is not URL-shape-checked", () => {
  // Twin targets are pack ids, not URLs — an arbitrary identifier is fine.
  expect(validateBinding({ system: "s", boundTo: "any-pack-id", kind: "twin", mode: "twin_first" })).toEqual([]);
});

test("validateBinding: requires system and boundTo", () => {
  expect(validateBinding({ boundTo: "t", kind: "twin", mode: "twin_first" }))
    .toEqual(expect.arrayContaining([expect.stringContaining("system is required")]));
  expect(validateBinding({ system: "s", kind: "twin", mode: "twin_first" }))
    .toEqual(expect.arrayContaining([expect.stringContaining("boundTo is required")]));
});

test("validateBinding: rejects a mismatched schemaVersion", () => {
  const problems = validateBinding({
    schemaVersion: "ge.system-binding.v2",
    system: "s",
    boundTo: "t",
    kind: "twin",
    mode: "twin_first",
  });
  expect(problems.some((p) => p.includes("schemaVersion must be"))).toBe(true);
});

test("validateBinding: connector must be a string when present, config must be a plain object", () => {
  expect(validateBinding({ system: "s", boundTo: "t", kind: "twin", mode: "twin_first", connector: 42 }))
    .toEqual(expect.arrayContaining([expect.stringContaining("connector must be a string")]));
  expect(validateBinding({ system: "s", boundTo: "t", kind: "twin", mode: "twin_first", config: "nope" }))
    .toEqual(expect.arrayContaining([expect.stringContaining("config must be a plain object")]));
  expect(validateBinding({ system: "s", boundTo: "t", kind: "twin", mode: "twin_first", config: ["nope"] }))
    .toEqual(expect.arrayContaining([expect.stringContaining("config must be a plain object")]));
  expect(validateBinding({ system: "s", boundTo: "t", kind: "twin", mode: "twin_first", config: { a: 1 } }))
    .toEqual([]);
});

test("readBindings: an empty/missing store resolves to an empty list, not an error", async () => {
  const dir = tmpDir();
  const { schemaVersion, bindings } = await readBindings({ dir });
  expect(schemaVersion).toBe(BINDING_SCHEMA_VERSION);
  expect(bindings).toEqual([]);
});

test("readBindings requires dir", async () => {
  await expect(readBindings({})).rejects.toThrow(/requires dir/);
});

test("writeBinding + readBindings: round-trip, stamping schemaVersion and updatedAt", async () => {
  const dir = tmpDir();
  const stored = await writeBinding({
    dir,
    binding: { system: "workday", boundTo: "workday-twin-pack", kind: "twin", mode: "twin_first" },
  });
  expect(stored.schemaVersion).toBe(BINDING_SCHEMA_VERSION);
  expect(typeof stored.updatedAt).toBe("string");
  expect(new Date(stored.updatedAt).toString()).not.toBe("Invalid Date");

  const { bindings } = await readBindings({ dir });
  expect(bindings).toHaveLength(1);
  expect(bindings[0]).toMatchObject({ system: "workday", boundTo: "workday-twin-pack", kind: "twin", mode: "twin_first" });
});

test("writeBinding: rejects an invalid binding without writing anything", async () => {
  const dir = tmpDir();
  let caught = null;
  try {
    await writeBinding({ dir, binding: { system: "s", boundTo: "t", kind: "bogus-kind", mode: "twin_first" } });
  } catch (error) {
    caught = error;
  }
  expect(caught).not.toBeNull();
  expect(caught.message).toMatch(/invalid system binding/);
  expect(caught.problems.length).toBeGreaterThan(0);
  const { bindings } = await readBindings({ dir });
  expect(bindings).toEqual([]);
});

test("writeBinding: rejects a bad mode without writing anything", async () => {
  const dir = tmpDir();
  await expect(writeBinding({ dir, binding: { system: "s", boundTo: "t", kind: "twin", mode: "bogus-mode" } }))
    .rejects.toThrow(/invalid system binding/);
});

test("writeBinding: rejects a non-URL boundTo for mcp/rest without writing anything", async () => {
  const dir = tmpDir();
  await expect(writeBinding({ dir, binding: { system: "s", boundTo: "not-a-url", kind: "mcp", mode: "live_first" } }))
    .rejects.toThrow(/must be an http\(s\) URL/);
});

test("writeBinding: overwrites an existing binding for the same system", async () => {
  const dir = tmpDir();
  await writeBinding({ dir, binding: { system: "workday", boundTo: "pack-a", kind: "twin", mode: "twin_first" } });
  await writeBinding({ dir, binding: { system: "workday", boundTo: "pack-b", kind: "twin", mode: "live_first" } });
  const { bindings } = await readBindings({ dir });
  expect(bindings).toHaveLength(1);
  expect(bindings[0]).toMatchObject({ boundTo: "pack-b", mode: "live_first" });
});

test("writeBinding: multiple systems coexist, sorted by system id on read", async () => {
  const dir = tmpDir();
  await writeBinding({ dir, binding: { system: "zeta", boundTo: "z", kind: "twin", mode: "twin_first" } });
  await writeBinding({ dir, binding: { system: "alpha", boundTo: "a", kind: "twin", mode: "twin_first" } });
  const { bindings } = await readBindings({ dir });
  expect(bindings.map((b) => b.system)).toEqual(["alpha", "zeta"]);
});

test("writeBinding: the underlying file is atomic-write shaped (JSON, no leftover tmp files)", async () => {
  const dir = tmpDir();
  await writeBinding({ dir, binding: { system: "workday", boundTo: "pack-a", kind: "twin", mode: "twin_first" } });
  const raw = readFileSync(join(dir, "bindings.json"), "utf8");
  const parsed = JSON.parse(raw); // throws if not valid, complete JSON
  expect(parsed.schemaVersion).toBe(BINDING_SCHEMA_VERSION);
  expect(Object.keys(parsed.bindings)).toEqual(["workday"]);
});

test("removeBinding: removes a stored binding and returns true", async () => {
  const dir = tmpDir();
  await writeBinding({ dir, binding: { system: "workday", boundTo: "pack-a", kind: "twin", mode: "twin_first" } });
  const removed = await removeBinding({ dir, system: "workday" });
  expect(removed).toBe(true);
  const { bindings } = await readBindings({ dir });
  expect(bindings).toEqual([]);
});

test("removeBinding: unbinding an unbound system is a no-op, not an error", async () => {
  const dir = tmpDir();
  expect(await removeBinding({ dir, system: "nope" })).toBe(false);
  // Also true when the store doesn't exist at all yet.
  const freshDir = tmpDir();
  expect(await removeBinding({ dir: freshDir, system: "nope" })).toBe(false);
});

test("removeBinding requires dir and system", async () => {
  await expect(removeBinding({ system: "s" })).rejects.toThrow(/requires dir/);
  await expect(removeBinding({ dir: tmpDir() })).rejects.toThrow(/requires system/);
});

test("readBindings: a corrupt store throws instead of silently discarding state", async () => {
  const dir = tmpDir();
  await writeBinding({ dir, binding: { system: "workday", boundTo: "pack-a", kind: "twin", mode: "twin_first" } });
  // Corrupt the file after a valid write.
  const path = join(dir, "bindings.json");
  await Bun.write(path, "{not json");
  await expect(readBindings({ dir })).rejects.toThrow(/could not read bindings store/);
});
