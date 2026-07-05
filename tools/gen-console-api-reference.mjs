#!/usr/bin/env node
// Generate the registry-backed console-route table in
// docs/reference/console-and-apis.md from packages/capability-registry/src/registry.mjs —
// the same single source of truth that dispatches the CLI, the console
// routes, and the MCP server. The generated markdown lives between marker
// comments; the hand-written prose around the markers is never touched.
//
//   node tools/gen-console-api-reference.mjs           # regenerate the marked region
//   node tools/gen-console-api-reference.mjs --check   # exit 1 (+ diff) if the region is stale
//
// House rule (docs/plans/taste-campaign/05-generated-truth.md): this script
// renders ONLY what the registry contains — label, summary, risk, and
// requirements strings. A wrong cell is fixed in the registry entry, never by
// prose invented here.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GE_COMMANDS } from "@ge/capability-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = join(HERE, "..", "docs", "reference", "console-and-apis.md");
const BEGIN =
  "<!-- BEGIN GENERATED: ge-console-commands — do not edit; run `bun run docs:console-api` -->";
const END = "<!-- END GENERATED: ge-console-commands -->";

const escapeCell = (s) => String(s ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");

// Human phrasing for the registry's boolean requirement flags — the same
// vocabulary CommandCard.astro renders on the docs site, per the
// `requirements` field contract documented in @ge/core-api (packages/core-api/src/capability.mjs).
const FLAG_LABELS = {
  cloudAuth: "cloud auth",
  terraformRoot: "Terraform root",
  configWritable: "writable `.ge.json`",
  localToolchain: "local toolchain",
  toolPlane: "tool plane deployed",
  bigQueryHard: "BigQuery API (hard)",
  shipHandoff: "ship handoff wiring",
  dataGenerationRuntime: "data-generation runtime",
};

function preflightCell(requirements = {}) {
  const { bins = [], config = [], ...flags } = requirements;
  const parts = [
    ...(bins.length ? [`\`${bins.join("`, `")}\` on PATH`] : []),
    ...(config.length ? [`\`.ge.json\`: ${config.join(", ")}`] : []),
    ...Object.keys(FLAG_LABELS)
      .filter((key) => flags[key])
      .map((key) => FLAG_LABELS[key]),
  ];
  return parts.length ? parts.join(" · ") : "—";
}

export function generateRegion() {
  const routed = Object.values(GE_COMMANDS).filter((c) => c.method && c.path);
  const lines = [
    "| Route | CLI | Purpose | Risk | Preflight requires |",
    "|---|---|---|---|---|",
  ];
  for (const c of routed) {
    lines.push(
      `| \`${c.method} ${c.path}\` | \`${c.cli}\` | ${escapeCell(c.summary)} | \`${c.risk}\` | ${preflightCell(c.requirements)} |`,
    );
  }
  return lines.join("\n");
}

function splitDoc(doc) {
  const beginIdx = doc.indexOf(BEGIN);
  const endIdx = doc.indexOf(END);
  if (beginIdx < 0 || endIdx < 0 || endIdx < beginIdx) {
    throw new Error(`marker pair not found in ${DOC_PATH} (expected "${BEGIN}" … "${END}")`);
  }
  return {
    before: doc.slice(0, beginIdx + BEGIN.length),
    region: doc.slice(beginIdx + BEGIN.length, endIdx).replace(/^\n/, "").replace(/\n$/, ""),
    after: doc.slice(endIdx),
  };
}

function printLineDiff(expected, actual) {
  const a = expected.split("\n");
  const b = actual.split("\n");
  const max = Math.max(a.length, b.length);
  let shown = 0;
  for (let i = 0; i < max && shown < 20; i += 1) {
    if (a[i] !== b[i]) {
      console.error(`  line ${i + 1}:`);
      console.error(`    expected: ${a[i] ?? "<missing>"}`);
      console.error(`    actual:   ${b[i] ?? "<missing>"}`);
      shown += 1;
    }
  }
}

async function main() {
  const check = process.argv.includes("--check");
  const doc = readFileSync(DOC_PATH, "utf8");
  const { before, region, after } = splitDoc(doc);
  const generated = generateRegion();

  if (check) {
    if (region !== generated) {
      console.error(
        "✗ docs/reference/console-and-apis.md ge-console-commands region is stale vs packages/capability-registry/src/registry.mjs",
      );
      printLineDiff(generated, region);
      console.error("Run: bun run docs:console-api");
      process.exit(1);
    }
    console.log(
      "✓ docs/reference/console-and-apis.md ge-console-commands region matches the command registry",
    );
    return;
  }

  writeFileSync(DOC_PATH, `${before}\n${generated}\n${after}`);
  console.log("generated docs/reference/console-and-apis.md ge-console-commands region");
}

const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  await main();
}
