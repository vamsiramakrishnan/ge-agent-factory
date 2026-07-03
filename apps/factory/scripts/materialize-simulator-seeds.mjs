#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { parseFlagArgs } from "@ge/std/cli-args";
import { readJson, writeJson } from "@ge/std/json-io";
import { parseCsv } from "@ge/std/csv-io";
import { existsSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { loadSimulatorRegistry } from "./factory/simulators/registry.mjs";
import { sourceTimestamp } from "../src/source-clock.js";
import { normalizeForCollection as sharedNormalizeForCollection, mergeByKey as sharedMergeByKey } from "./lib/data-recipe.mjs";
import { snakeCase } from "@ge/std/naming";

const parseArgs = (argv) => parseFlagArgs(argv).flags;

async function readRows(path) {
  const ext = extname(path).toLowerCase();
  const text = await readFile(path, "utf8");
  if (ext === ".csv") return parseCsv(text);
  if (ext === ".ndjson" || ext === ".jsonl") {
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  }
  const payload = JSON.parse(text);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.data)) return payload.data;
  return [payload];
}

async function listFiles(root) {
  if (!existsSync(root)) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else files.push(path);
  }
  return files;
}

async function loadObjectRows(outputRoot, objectName) {
  const wanted = snakeCase(objectName);
  const files = await listFiles(outputRoot);
  const candidates = files.filter((path) => {
    const base = snakeCase(basename(path, extname(path)));
    return base === wanted || base === `${wanted}s` || base.endsWith(`_${wanted}`);
  });
  const rows = [];
  for (const path of candidates) rows.push(...await readRows(path));
  return rows;
}

function primaryKeyFor(simulator, collection) {
  return simulator?.schema?.collections?.[collection]?.primaryKey || "id";
}

// Materialization alias/defaults/template + merge-by-PK now live in the shared
// data-recipe library so the inline generator and this materializer stay in lock-step.
// These thin wrappers preserve the existing call signatures (contract-shaped input).
function normalizeForCollection(contract, collection, objectName, row, index) {
  return sharedNormalizeForCollection(contract?.materialization || null, collection, objectName, row, index);
}

const mergeByKey = sharedMergeByKey;

async function materializeSimulator({ workspace, simulatorIndex, snowfakeryOutputRoot, simulator, contract, generatedAt }) {
  const simulatorDir = join(workspace, "mock_data", "simulators", simulator.simulatorId);
  const seedPath = join(simulatorDir, "seed.json");
  const seedPlanPath = join(simulatorDir, "seed-plan.json");
  const seedPlan = await readJson(seedPlanPath, simulator);
  const seed = await readJson(seedPath, { _meta: {}, _schema: {} });
  const collections = {};
  const inputs = [];
  for (const mapping of seedPlan.collectionMappings || []) {
    const collection = mapping.simulatorCollection;
    const materialized = [];
    for (const objectName of mapping.realizedObjects || []) {
      const rows = await loadObjectRows(snowfakeryOutputRoot, objectName);
      inputs.push({ object: objectName, rows: rows.length });
      rows.forEach((row, index) => materialized.push(normalizeForCollection(contract, collection, objectName, row, index)));
    }
    const key = primaryKeyFor(contract, collection);
    collections[collection] = mergeByKey(seed[collection] || [], materialized, key);
  }
  const nextSeed = {
    ...seed,
    _meta: {
      ...(seed._meta || {}),
      materializedAt: generatedAt,
      materializedFrom: "mock_data/snowfakery/output",
      simulatorIndex,
    },
    ...collections,
  };
  await writeJson(seedPath, nextSeed);
  return {
    simulatorId: simulator.simulatorId,
    seed: `mock_data/simulators/${simulator.simulatorId}/seed.json`,
    inputs,
    collections: Object.fromEntries(Object.entries(collections).map(([collection, rows]) => [collection, rows.length])),
  };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const workspace = resolve(flags.dir || ".");
  const snowfakeryOutputRoot = resolve(workspace, flags.input || "mock_data/snowfakery/output");
  const indexPath = resolve(workspace, flags.index || "mock_data/simulators/index.json");
  const index = await readJson(indexPath, null);
  if (!index) throw new Error(`Simulator index not found: ${indexPath}. Run plan-mock-data first.`);
  const registry = loadSimulatorRegistry();
  const contractsById = new Map((registry.simulators || []).map((simulator) => [simulator.id, simulator]));
  // Injectable clock, captured ONCE so every artifact in this run agrees;
  // GE_SOURCE_DATE pins it for byte-reproducible builds (source-clock.js).
  const generatedAt = sourceTimestamp();
  const results = [];
  for (const simulator of index.simulators || []) {
    results.push(await materializeSimulator({
      workspace,
      simulatorIndex: index.id,
      snowfakeryOutputRoot,
      simulator,
      contract: contractsById.get(simulator.simulatorId),
      generatedAt,
    }));
  }
  const report = {
    ok: true,
    generatedAt,
    workspace,
    snowfakeryOutputRoot,
    simulatorIndex: indexPath,
    simulators: results,
  };
  await writeJson(resolve(workspace, flags.report || "mock_data/simulators/materialization-report.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
