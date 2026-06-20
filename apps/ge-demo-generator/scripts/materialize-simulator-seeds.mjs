#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { loadSimulatorRegistry } from "./ge-mock/simulators/registry.mjs";
import { normalizeForCollection as sharedNormalizeForCollection, mergeByKey as sharedMergeByKey } from "./lib/data-recipe.mjs";

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return flags;
}

async function readJson(path, fallback = null) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { return fallback; }
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function snakeCase(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === "\"" && next === "\"") {
        field += "\"";
        i += 1;
      } else if (ch === "\"") {
        quoted = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === "\"") quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers = [], ...body] = rows.filter((item) => item.some((cell) => String(cell || "").trim() !== ""));
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

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

async function materializeSimulator({ workspace, simulatorIndex, snowfakeryOutputRoot, simulator, contract }) {
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
      materializedAt: new Date().toISOString(),
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
  const results = [];
  for (const simulator of index.simulators || []) {
    results.push(await materializeSimulator({
      workspace,
      simulatorIndex: index.id,
      snowfakeryOutputRoot,
      simulator,
      contract: contractsById.get(simulator.simulatorId),
    }));
  }
  const report = {
    ok: true,
    generatedAt: new Date().toISOString(),
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
