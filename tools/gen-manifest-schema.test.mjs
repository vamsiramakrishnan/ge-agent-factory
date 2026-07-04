import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEDGER_STAGES } from "../packages/run-ledger/src/store.mjs";
import {
  SCHEMA_REL_PATH,
  buildSchema,
  checkSchema,
  formatCheckReport,
  writeSchema,
} from "./gen-manifest-schema.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

test("schema properties match reconcile.mjs's manifest shape", () => {
  const schema = buildSchema();
  expect(schema.additionalProperties).toBe(false);
  expect(Object.keys(schema.properties)).toEqual(["$schema", "_comment", "platform", "fleet"]);
  expect(Object.keys(schema.properties.platform.properties)).toEqual(["infra", "data", "mcp"]);
  expect(Object.keys(schema.properties.fleet.properties)).toEqual(["mode", "target", "agents"]);
  expect(schema.properties.fleet.properties.mode.enum).toEqual(["local", "remote"]);
  expect(schema.properties.fleet.properties.target.enum).toEqual(LEDGER_STAGES);
});

test("the checked-in ge.manifest.schema.json matches the generator (repo is not stale)", () => {
  const result = checkSchema(ROOT);
  expect(result.findings).toEqual([]);
  expect(result.ok).toBe(true);
});

test("ge.manifest.example.json validates against the schema's shape", () => {
  const schema = buildSchema();
  const example = JSON.parse(readFileSync(join(ROOT, "ge.manifest.example.json"), "utf8"));
  for (const key of Object.keys(example)) {
    expect(Object.keys(schema.properties), `unexpected top-level key ${key}`).toContain(key);
  }
  expect(schema.properties.fleet.properties.mode.enum).toContain(example.fleet.mode);
  expect(schema.properties.fleet.properties.target.enum).toContain(example.fleet.target);
});

test("checkSchema flags a hand-edited drift and writeSchema repairs it", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-manifest-schema-test-"));
  try {
    const path = join(tmp, SCHEMA_REL_PATH);
    writeFileSync(path, readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8").replace('"default": "previewed"', '"default": "published"'));

    const drifted = checkSchema(tmp);
    expect(drifted.ok).toBe(false);
    expect(drifted.findings.map((f) => f.file)).toEqual([SCHEMA_REL_PATH]);
    const report = formatCheckReport(drifted);
    expect(report).toContain('-          "default": "published",');
    expect(report).toContain('+          "default": "previewed",');

    const { changed } = writeSchema(tmp);
    expect(changed).toEqual([SCHEMA_REL_PATH]);
    expect(checkSchema(tmp).ok).toBe(true);
    expect(readFileSync(path, "utf8")).toBe(readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8"));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("checkSchema reports a missing tracked file as drift", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-manifest-schema-test-"));
  try {
    const result = checkSchema(tmp);
    expect(result.ok).toBe(false);
    expect(result.findings[0].missing).toBe(true);
    expect(formatCheckReport(result)).toContain("bun run manifest:schema");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("writeSchema is a no-op on an up-to-date tree", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-manifest-schema-test-"));
  try {
    writeFileSync(join(tmp, SCHEMA_REL_PATH), readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8"));
    expect(writeSchema(tmp).changed).toEqual([]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
