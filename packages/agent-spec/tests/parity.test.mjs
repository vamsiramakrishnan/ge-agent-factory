// Corpus parity oracle for the agent-spec validators (WS2 Step 1).
//
// Runs validateGenerationSpec / validateAgentSpecQuality / validateCatalogParity
// over the entire on-disk corpus and compares the results byte-for-byte against
// the committed snapshot (fixtures/validator-parity.json). The gap strings and
// maturity values these validators emit are a load-bearing downstream contract
// (audit tooling, the interviewing-specs skill, @ge/std/spec-gaps codes) — any
// diff in the snapshot is a behavior change and must not ship silently.
//
// Corpus (exact inventory, 2026-07-02):
//   1. every `apps/factory/catalog/interview-specs/**/*.json` (raw catalog
//      entries as written to disk),
//   2. every entry produced by `loadInterviewSpecEntries({ repoRoot })` (the
//      normalized-entry view of the same directory),
//   3. every `packages/agent-spec/tests/fixtures/specs/*.json` (checked-in
//      edge-case entries that exercise the gap branches the small live corpus
//      does not reach: per-item gaps, string coercion, alias chains, empty and
//      catalog-grade specs).
//   The baseline specs emitted by `bun run generator:emit-baselines` are NOT
//   part of the corpus: that script writes generationSpec blocks into slide
//   TSX in place — there are no checked-in JSON fixtures to validate
//   (inventoried at implementation time per the WS2 doc).
//
// To regenerate after an INTENTIONAL validator change:
//   GE_UPDATE_GOLDEN=1 bun test packages/agent-spec/tests/parity.test.mjs
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  validateAgentSpecQuality,
  validateCatalogParity,
  validateGenerationSpec,
} from "@ge/agent-spec";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..");
// `loadInterviewSpecEntries`' repoRoot is the factory app dir (its
// INTERVIEW_SPEC_DIR constant is relative to apps/factory), matching how
// tools/lib/factory-catalog*.mjs call it.
const FACTORY_DIR = join(REPO_ROOT, "apps", "factory");
const SNAPSHOT_PATH = join(HERE, "fixtures", "validator-parity.json");
const LOCAL_FIXTURE_DIR = join(HERE, "fixtures", "specs");

// The validators under test are imported from this package (they moved here
// in WS2 Step 4 — the pre-move snapshot was taken against the factory
// registry and must stay byte-identical). `loadInterviewSpecEntries` is
// factory-side file IO and deliberately stays in the factory registry, so it
// is resolved via a computed file URL: packages/* must not statically import
// apps/* (tools/check-no-app-imports.mjs), and this oracle is the one
// sanctioned reach-back — its corpus is, by definition, the factory's
// on-disk catalog.
const registryUrl = pathToFileURL(join(FACTORY_DIR, "src", "agent-spec-registry.js")).href;
const { loadInterviewSpecEntries } = await import(registryUrl);

/** Recursively collect *.json files under `dir` (sorted, repo-relative-stable). */
function walkJson(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (current) => {
    for (const name of readdirSync(current).sort()) {
      const abs = join(current, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else if (name.endsWith(".json")) out.push(abs);
    }
  };
  walk(dir);
  return out.sort();
}

/** Deep-sort object keys; arrays (gap order is contract) are preserved as-is. */
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeysDeep(value[key]);
    return out;
  }
  return value;
}

/** Stable serialization (deep-sorted keys, 2-space indent, trailing newline). */
function stableSnapshotJson(records) {
  return `${JSON.stringify(sortKeysDeep(records), null, 2)}\n`;
}

/** The per-entry record shape the WS2 doc prescribes. */
function validatorRecord(rawEntry) {
  const generationSpec =
    rawEntry?.generationSpec || rawEntry?.spec || rawEntry?.agentSpec || null;
  return {
    validateGenerationSpec: validateGenerationSpec(generationSpec),
    validateAgentSpecQuality: validateAgentSpecQuality(rawEntry),
    validateCatalogParity: validateCatalogParity(rawEntry),
  };
}

async function buildCorpusRecords() {
  const records = {};

  // 1. Raw catalog entries on disk.
  const interviewSpecDir = join(FACTORY_DIR, "catalog", "interview-specs");
  for (const file of walkJson(interviewSpecDir)) {
    const raw = JSON.parse(readFileSync(file, "utf8"));
    const id = `interview-specs/${relative(interviewSpecDir, file).split("\\").join("/")}`;
    records[id] = { id, ...validatorRecord(raw) };
  }

  // 2. The normalized-entry view of the same directory.
  const entries = await loadInterviewSpecEntries({ repoRoot: FACTORY_DIR });
  for (const entry of entries) {
    const id = `loaded-entry/${entry.id}`;
    records[id] = { id, ...validatorRecord(entry) };
  }

  // 3. Checked-in edge-case corpus local to this package.
  for (const file of walkJson(LOCAL_FIXTURE_DIR)) {
    const raw = JSON.parse(readFileSync(file, "utf8"));
    const id = `fixture/${relative(LOCAL_FIXTURE_DIR, file).split("\\").join("/")}`;
    records[id] = { id, ...validatorRecord(raw) };
  }

  return records;
}

describe("agent-spec validator corpus parity oracle", () => {
  test("validator output over the corpus matches the committed snapshot byte-for-byte", async () => {
    const records = await buildCorpusRecords();

    // Guard against silent corpus rot: all three segments must contribute.
    const ids = Object.keys(records);
    expect(ids.some((id) => id.startsWith("interview-specs/"))).toBe(true);
    expect(ids.some((id) => id.startsWith("loaded-entry/"))).toBe(true);
    expect(ids.some((id) => id.startsWith("fixture/"))).toBe(true);

    const actual = stableSnapshotJson(records);
    if (process.env.GE_UPDATE_GOLDEN === "1" || !existsSync(SNAPSHOT_PATH)) {
      writeFileSync(SNAPSHOT_PATH, actual, "utf8");
    }
    const golden = readFileSync(SNAPSHOT_PATH, "utf8");
    expect(actual).toBe(golden);
  });
});
