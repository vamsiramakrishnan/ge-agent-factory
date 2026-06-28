import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as core from "./factory-core.mjs";

// Locks factory-core's public surface so the Week-4 cycle-break extraction (which
// MOVES function bodies into factory-catalog.mjs / factory-local-ops.mjs and
// re-exports them) cannot silently drop or rename an export. Update the snapshot
// JSON deliberately when the surface is intended to change.
const expected = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "factory-core.export-surface.json"), "utf8"),
);

test("factory-core export surface is stable", () => {
  expect(Object.keys(core).sort()).toEqual(expected);
});
