import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG_FIELDS } from "./lib/config-schema.mjs";
import {
  SCHEMA_REL_PATH,
  buildSchema,
  checkSchema,
  describeField,
  formatCheckReport,
  renderSchema,
  writeSchema,
} from "./gen-config-schema.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

test("every CONFIG_FIELDS entry becomes a property keyed by its .ge.json key", () => {
  const { properties } = buildSchema();
  for (const def of Object.values(CONFIG_FIELDS)) {
    const prop = properties[def.file];
    expect(prop, `missing property for .ge.json key ${def.file}`).toBeDefined();
    // null is a legal "unset" spelling: resolveConfigField's has() treats it
    // as unset, and init() writes null for undiscovered service URLs.
    expect(prop.type).toEqual(["string", "null"]);
    expect(prop.description).toContain(`--${def.flag}`);
    for (const env of def.env || []) expect(prop.description).toContain(env);
    for (const cmd of def.requiredFor || []) expect(prop.description).toContain(cmd);
    if (def.default !== undefined) expect(prop.default).toBe(def.default);
    else expect("default" in prop).toBe(false);
  }
  // The self-reference key `ge init` writes is declared too.
  expect(properties.$schema.type).toBe("string");
  // No invented properties beyond CONFIG_FIELDS + $schema.
  expect(Object.keys(properties).length).toBe(Object.keys(CONFIG_FIELDS).length + 1);
});

test("descriptions are composed from field metadata only", () => {
  expect(describeField(CONFIG_FIELDS.project)).toBe(
    "Flag: --project. Env: GCP_PROJECT_ID, GOOGLE_CLOUD_PROJECT, GCLOUD_PROJECT. Required for: infra, build, agents, data, mcp.",
  );
  expect(describeField(CONFIG_FIELDS.region)).toBe('Flag: --region. Env: GCP_REGION. Default: "us-central1".');
});

test("extra .ge.json keys stay legal (additionalProperties true)", () => {
  expect(buildSchema().additionalProperties).toBe(true);
});

test("renderSchema is deterministic", () => {
  expect(renderSchema()).toBe(renderSchema());
});

test("the checked-in .ge.schema.json matches the generator (repo is not stale)", () => {
  const result = checkSchema(ROOT);
  expect(result.findings).toEqual([]);
  expect(result.ok).toBe(true);
});

test("checkSchema flags planted drift with a diff and writeSchema repairs it", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-config-schema-test-"));
  try {
    const path = join(tmp, SCHEMA_REL_PATH);
    writeFileSync(path, readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8").replace('"default": "us-central1"', '"default": "mars-north1"'));

    const drifted = checkSchema(tmp);
    expect(drifted.ok).toBe(false);
    expect(drifted.findings.map((f) => f.file)).toEqual([SCHEMA_REL_PATH]);
    const report = formatCheckReport(drifted);
    expect(report).toContain('-      "default": "mars-north1"');
    expect(report).toContain('+      "default": "us-central1"');

    const { changed } = writeSchema(tmp);
    expect(changed).toEqual([SCHEMA_REL_PATH]);
    expect(checkSchema(tmp).ok).toBe(true);
    // The repaired copy is byte-identical to the checked-in file.
    expect(readFileSync(path, "utf8")).toBe(readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8"));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("checkSchema reports a missing tracked file as drift", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-config-schema-test-"));
  try {
    const result = checkSchema(tmp);
    expect(result.ok).toBe(false);
    expect(result.findings[0].missing).toBe(true);
    expect(formatCheckReport(result)).toContain("bun run config:schema");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("writeSchema is a no-op on an up-to-date tree", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-config-schema-test-"));
  try {
    writeFileSync(join(tmp, SCHEMA_REL_PATH), readFileSync(join(ROOT, SCHEMA_REL_PATH), "utf8"));
    expect(writeSchema(tmp).changed).toEqual([]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
