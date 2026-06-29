#!/usr/bin/env node
/**
 * generate-simulator-data.mjs — inline, unified, deterministic seed generation.
 *
 * Given a simulator system id (resolved against the registry) OR an explicit pack
 * contract (schema/projection/materialization/workflows), this:
 *   1. builds a normalized recipe from the contract (scripts/lib/data-recipe.mjs),
 *   2. tries the Snowfakery tier — spawns `snowfakery` on the recipe; if `snowfakery`
 *      is not on PATH or the run fails, logs a clear notice and falls back to the
 *      in-process Faker tier (zero external deps, fully offline),
 *   3. applies materialization (alias + defaults) to the realized rows,
 *   4. merges scenario-coverage rows so the demo exercises transitions / approval
 *      gates / failure modes,
 *   5. writes a complete, deterministic seed.json and prints a JSON summary.
 *
 * USAGE:
 *   node scripts/generate-simulator-data.mjs --system servicenow [--seed 42] [--out path/seed.json]
 *   node scripts/generate-simulator-data.mjs --pack simulator-systems/servicenow [--seed 42]
 *   node scripts/generate-simulator-data.mjs --system servicenow --no-snowfakery   # force offline tier
 *   node scripts/generate-simulator-data.mjs --system servicenow --stdout          # print seed, don't write
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { parseFlagArgs } from "@ge/std/cli-args";
import { tmpdir } from "node:os";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { writeJson, readJson } from "@ge/std/json-io";
import {
  buildRecipe,
  generateWithFaker,
  toSnowfakeryYaml,
  scenarioCoverageRows,
  applyMaterialization,
  mergeByKey,
  checkFkClosure,
  snakeCase,
} from "./lib/data-recipe.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SYSTEMS_DIR = resolve(SCRIPT_DIR, "../simulator-systems");

const parseArgs = (argv) => parseFlagArgs(argv).flags;

// Load a pack contract from a directory of {schema,projection,materialization,workflows}.json.
function loadContractFromDir(packDir) {
  const read = (name) => readJson(join(packDir, name), null);
  const schema = read("schema.json");
  if (!schema) throw new Error(`No schema.json in pack dir: ${packDir}`);
  return {
    id: basename(packDir),
    packDir,
    schema,
    projection: read("projection.json"),
    materialization: read("materialization.json"),
    workflows: read("workflows.json"),
  };
}

// Resolve a system id to its pack directory under simulator-systems/.
function resolveSystemDir(systemId) {
  const direct = join(SYSTEMS_DIR, systemId);
  if (existsSync(join(direct, "schema.json"))) return direct;
  const normalized = snakeCase(systemId);
  const candidate = join(SYSTEMS_DIR, normalized);
  if (existsSync(join(candidate, "schema.json"))) return candidate;
  throw new Error(`System not found under simulator-systems/: ${systemId}`);
}

// ── Snowfakery tier ──────────────────────────────────────────────────────────
// Spawn `snowfakery` to realize the recipe into per-object JSON, then read it back.
// Returns { ok, rowsByObject } or { ok: false, reason }.
function trySnowfakery(recipe, { systemId }) {
  const probe = spawnSync("snowfakery", ["--version"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) {
    return { ok: false, reason: "`snowfakery` is not on PATH" };
  }
  const work = mkdtempSync(join(tmpdir(), `ge-snowfakery-${snakeCase(systemId)}-`));
  try {
    const recipePath = join(work, "recipe.yml");
    // Snowfakery reads YAML; write the rendered recipe verbatim.
    mkdirSync(dirname(recipePath), { recursive: true });
    writeFileSync(recipePath, toSnowfakeryYaml(recipe), "utf8");
    const outPath = join(work, "out.json");
    const run = spawnSync(
      "snowfakery",
      [recipePath, "--output-format", "json", "--output-file", outPath],
      { encoding: "utf8" },
    );
    if (run.status !== 0 || !existsSync(outPath)) {
      return { ok: false, reason: `snowfakery run failed: ${(run.stderr || "").trim().slice(0, 200)}` };
    }
    const records = JSON.parse(readFileSync(outPath, "utf8"));
    // Snowfakery JSON is a flat array of records each tagged with `_table`.
    const rowsByObject = {};
    for (const record of Array.isArray(records) ? records : []) {
      const table = record._table || record.table;
      if (!table) continue;
      const clean = { ...record };
      delete clean._table;
      delete clean.table;
      (rowsByObject[table] = rowsByObject[table] || []).push(clean);
    }
    return { ok: true, rowsByObject };
  } catch (error) {
    return { ok: false, reason: `snowfakery error: ${error.message}` };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

// ── assemble ───────────────────────────────────────────────────────────────────
function buildSeed(contract, { seed, preferSnowfakery }) {
  const recipe = buildRecipe(contract, { seed });

  let tier = "faker";
  let rowsByCollection;
  if (preferSnowfakery) {
    const sf = trySnowfakery(recipe, { systemId: contract.id });
    if (sf.ok) {
      tier = "snowfakery";
      rowsByCollection = {};
      for (const name of recipe.order) {
        rowsByCollection[name] = sf.rowsByObject[name] || [];
      }
    } else {
      console.error(`[generate-simulator-data] Snowfakery tier unavailable (${sf.reason}); falling back to offline Faker tier.`);
    }
  }
  if (!rowsByCollection) {
    rowsByCollection = generateWithFaker(recipe, { seed });
  }

  // Apply materialization (alias + defaults) so rows match the canonical shape.
  const materialization = contract.materialization || null;
  const materialized = {};
  for (const name of recipe.order) {
    materialized[name] = materialization
      ? applyMaterialization(rowsByCollection[name], materialization, name, name)
      : rowsByCollection[name];
  }

  // Merge scenario-coverage rows (transitions / approval gates / failure modes).
  const coverage = scenarioCoverageRows(contract);
  for (const [collection, covRows] of Object.entries(coverage)) {
    const spec = recipe.collections[collection];
    const key = spec?.primaryKey || contract.schema?.collections?.[collection]?.primaryKey || "id";
    const normalizedCov = materialization
      ? applyMaterialization(covRows, materialization, collection, collection)
      : covRows;
    materialized[collection] = mergeByKey(materialized[collection] || [], normalizedCov, key);
  }

  // Always include the audit log the engine expects.
  if (!Array.isArray(materialized.audit_events)) materialized.audit_events = [];

  const fk = checkFkClosure(recipe, materialized);
  return { recipe, tier, data: materialized, fk };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const seed = Number(flags.seed) || 42;
  const preferSnowfakery = flags["no-snowfakery"] ? false : flags.snowfakery !== "false";

  let contract;
  if (flags.pack) {
    contract = loadContractFromDir(resolve(flags.pack));
  } else if (flags.system) {
    contract = loadContractFromDir(resolveSystemDir(flags.system));
  } else {
    console.error(`Usage:
  node scripts/generate-simulator-data.mjs --system <id> [--seed N] [--out <seed.json>] [--no-snowfakery] [--stdout]
  node scripts/generate-simulator-data.mjs --pack <dir> [--seed N] [--out <seed.json>]`);
    process.exit(2);
    return;
  }

  const { recipe, tier, data, fk } = buildSeed(contract, { seed, preferSnowfakery });

  const summary = {
    ok: true,
    system: contract.id,
    tier,
    seed,
    collections: recipe.order.filter((name) => (data[name] || []).length > 0).length,
    rows: Object.fromEntries(recipe.order.map((name) => [name, (data[name] || []).length])),
    totalRows: recipe.order.reduce((sum, name) => sum + (data[name] || []).length, 0),
    fkClosureOk: fk.ok,
    fkViolations: fk.violations.length,
  };

  if (flags.stdout) {
    // stdout carries the seed JSON only; the summary goes to stderr so callers can
    // pipe the seed cleanly while still seeing the report.
    console.log(JSON.stringify(data, null, 2));
    console.error(JSON.stringify(summary, null, 2));
  } else {
    const outPath = flags.out
      ? resolve(flags.out)
      : (contract.packDir ? join(contract.packDir, "seed.json") : resolve(`${snakeCase(contract.id)}.seed.json`));
    writeJson(outPath, data);
    summary.out = outPath;
    console.log(JSON.stringify(summary, null, 2));
  }
  if (!fk.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
