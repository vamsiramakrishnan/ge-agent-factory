#!/usr/bin/env node
// Generate the tracked .ge.schema.json (JSON Schema draft-07) from
// CONFIG_FIELDS in tools/lib/config-schema.mjs — the declarative single
// source for `ge` scalar config (flag / env vars / .ge.json key / default /
// requiredFor per field). `ge init` writes `"$schema": "./.ge.schema.json"`
// into .ge.json, so operators get editor autocomplete + validation on the
// file they touch most.
//
// One property per CONFIG_FIELDS entry, keyed by the field's .ge.json key
// (`def.file`). Every field is `["string", "null"]`: resolveConfigField()
// only ever returns flag/env/file/default scalars and every declared default
// is a string, while its has() guard treats null (and "") as unset — and
// init() itself writes null for undiscovered service URLs — so null is a
// legal "unset" spelling in .ge.json, not a validation error.
// Descriptions are composed purely from the field's existing
// metadata (flag, env list, default, requiredFor) — no invented prose.
// `additionalProperties` stays true: operators (and the plane merge writers)
// stash extra keys in .ge.json that CONFIG_FIELDS does not govern.
//
//   node tools/gen-config-schema.mjs           # regenerate .ge.schema.json
//   node tools/gen-config-schema.mjs --check   # exit 1 on drift, with a diff
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG_FIELDS } from "./lib/config-schema.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

export const SCHEMA_REL_PATH = ".ge.schema.json";

// Compose one field's description from its CONFIG_FIELDS metadata only.
export function describeField(def) {
  const parts = [`Flag: --${def.flag}.`];
  if (def.env?.length) parts.push(`Env: ${def.env.join(", ")}.`);
  if (def.default !== undefined) parts.push(`Default: ${JSON.stringify(def.default)}.`);
  if (def.requiredFor?.length) parts.push(`Required for: ${def.requiredFor.join(", ")}.`);
  return parts.join(" ");
}

// Build the schema object (deterministic: property order follows
// CONFIG_FIELDS declaration order, prefixed by the $schema self-reference).
export function buildSchema(fields = CONFIG_FIELDS) {
  const properties = {
    $schema: {
      type: "string",
      description: "Reference to this schema (written by `ge init` as ./.ge.schema.json).",
    },
  };
  for (const def of Object.values(fields)) {
    const prop = { type: ["string", "null"], description: describeField(def) };
    if (def.default !== undefined) prop.default = def.default;
    properties[def.file] = prop;
  }
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: ".ge.json — ge operator config",
    description:
      "Generated from CONFIG_FIELDS in tools/lib/config-schema.mjs by tools/gen-config-schema.mjs — do not edit; run `bun run config:schema`. Precedence (highest first): CLI flag → environment → .ge.json → default.",
    type: "object",
    additionalProperties: true,
    properties,
  };
}

// Render the exact bytes of the tracked file.
export function renderSchema(fields = CONFIG_FIELDS) {
  return JSON.stringify(buildSchema(fields), null, 2) + "\n";
}

// Byte-compare the tracked .ge.schema.json against the rendered truth.
// Returns findings instead of printing (rendering happens at the CLI
// boundary below).
export function checkSchema(root = ROOT) {
  const expected = renderSchema();
  let actual;
  try {
    actual = readFileSync(join(root, SCHEMA_REL_PATH), "utf8");
  } catch {
    return { ok: false, findings: [{ file: SCHEMA_REL_PATH, actual: "", expected, missing: true }] };
  }
  if (actual === expected) return { ok: true, findings: [] };
  return { ok: false, findings: [{ file: SCHEMA_REL_PATH, actual, expected }] };
}

// Rewrite the tracked file in place. Returns the list of files whose bytes
// actually changed.
export function writeSchema(root = ROOT) {
  const expected = renderSchema();
  const path = join(root, SCHEMA_REL_PATH);
  let actual;
  try {
    actual = readFileSync(path, "utf8");
  } catch {
    actual = null;
  }
  if (actual === expected) return { changed: [] };
  writeFileSync(path, expected);
  return { changed: [SCHEMA_REL_PATH] };
}

export function formatCheckReport(result) {
  if (result.ok) {
    return `Config schema check passed: ${SCHEMA_REL_PATH} matches CONFIG_FIELDS (tools/lib/config-schema.mjs).`;
  }
  const lines = [`Config schema check failed: ${SCHEMA_REL_PATH} drifted from CONFIG_FIELDS (tools/lib/config-schema.mjs).`];
  for (const finding of result.findings) {
    if (finding.missing) {
      lines.push("", `${finding.file} is missing — run: bun run config:schema`);
      continue;
    }
    lines.push("", `--- ${finding.file} (on disk)`, `+++ ${finding.file} (generated from CONFIG_FIELDS)`);
    const actualLines = finding.actual.split("\n");
    const expectedLines = finding.expected.split("\n");
    for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i += 1) {
      if (actualLines[i] !== expectedLines[i]) {
        if (actualLines[i] !== undefined) lines.push(`-${actualLines[i]}`);
        if (expectedLines[i] !== undefined) lines.push(`+${expectedLines[i]}`);
      }
    }
  }
  lines.push("", "Edit tools/lib/config-schema.mjs (CONFIG_FIELDS) and run: bun run config:schema");
  return lines.join("\n");
}

// Run only when this file is the process entry point (house pattern from
// apps/factory/scripts/factory.mjs) — importing it must stay side-effect-free.
const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  try {
    if (process.argv.includes("--check")) {
      const result = checkSchema();
      const writer = result.ok ? process.stdout : process.stderr;
      writer.write(formatCheckReport(result) + "\n");
      process.exit(result.ok ? 0 : 1);
    } else {
      const { changed } = writeSchema();
      for (const file of changed) console.log(`generated ${file}`);
      if (!changed.length) console.log(`${SCHEMA_REL_PATH} already up to date`);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
