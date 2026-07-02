#!/usr/bin/env node
// Generate the `ge` CLI reference in docs/reference/cli.md from the citty
// command tree itself (tools/ge.mjs exports `rootCommand`; importing it never
// runs the CLI). The generated markdown lives between marker comments; the
// hand-written prose around the markers is never touched.
//
//   node tools/gen-cli-reference.mjs           # regenerate the marked region
//   node tools/gen-cli-reference.mjs --check   # exit 1 (+ diff) if the region is stale
//
// House rule (docs/plans/taste-campaign/05-generated-truth.md): this script
// renders ONLY what the command tree contains — meta.description and args
// description strings. A flag with no description renders an empty cell; the
// fix is adding a `description` in tools/ge/*.mjs, never prose invented here.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rootCommand } from "./ge.mjs";
import { common } from "./ge/shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = join(HERE, "..", "docs", "reference", "cli.md");
const BEGIN = "<!-- BEGIN GENERATED: ge-command-tree — do not edit; run `bun run docs:cli` -->";
const END = "<!-- END GENERATED: ge-command-tree -->";

// ── tree walking ─────────────────────────────────────────────────────────────

// citty allows lazy subcommands (`() => import(...)`); resolve either shape.
async function resolveCommand(cmd) {
  const resolved = typeof cmd === "function" ? await cmd() : await cmd;
  return resolved?.default ?? resolved;
}

// Normalized comparable shape of an arg definition (drop undefined keys so
// `{ type: "boolean" }` compares equal regardless of key order/extra fields).
function argShape(def) {
  return JSON.stringify({
    type: def.type ?? "string",
    required: def.required ?? false,
    alias: def.alias ?? null,
    description: def.description ?? "",
    default: def.default ?? null,
    valueHint: def.valueHint ?? null,
  });
}

const SHARED_SHAPES = new Map(Object.entries(common).map(([k, v]) => [k, argShape(v)]));

function isSharedArg(name, def) {
  return SHARED_SHAPES.get(name) === argShape(def);
}

// ── markdown rendering ───────────────────────────────────────────────────────

const escapeCell = (s) => String(s ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");

function flagLabel(name, def) {
  if (def.type === "positional") return `\`<${name}>\``;
  const aliases = def.alias ? (Array.isArray(def.alias) ? def.alias : [def.alias]) : [];
  return [name, ...aliases].map((a) => `\`--${a}\``).join(" / ");
}

function typeLabel(def) {
  if (def.type === "positional") return def.required ? "positional (required)" : "positional";
  return def.type ?? "string";
}

function argsTable(args, { skipShared = true } = {}) {
  const entries = Object.entries(args ?? {}).filter(
    ([name, def]) => !(skipShared && isSharedArg(name, def)),
  );
  if (!entries.length) return [];
  // Positionals first (in definition order), then flags (in definition order).
  const positionals = entries.filter(([, def]) => def.type === "positional");
  const flags = entries.filter(([, def]) => def.type !== "positional");
  const lines = ["| Flag | Type | Description |", "|---|---|---|"];
  for (const [name, def] of [...positionals, ...flags]) {
    lines.push(`| ${flagLabel(name, def)} | ${typeLabel(def)} | ${escapeCell(def.description ?? "")} |`);
  }
  return lines;
}

async function renderCommand(cmd, path, out) {
  cmd = await resolveCommand(cmd);
  const meta = cmd.meta ?? {};
  out.push(`### \`${path.join(" ")}\``, "");
  if (meta.description) out.push(meta.description, "");
  const table = argsTable(cmd.args);
  if (table.length) out.push(...table, "");
  for (const [name, sub] of Object.entries(cmd.subCommands ?? {})) {
    await renderCommand(sub, [...path, name], out);
  }
}

export async function generateRegion() {
  const out = [];
  const root = await resolveCommand(rootCommand);

  out.push("### Shared flags", "");
  out.push(
    "Every `ge` command accepts these shared flags (omitted from the per-command tables below):",
    "",
  );
  out.push(...argsTable(common, { skipShared: false }), "");

  // The root command itself (bare `ge`) plus every subcommand, depth-first in
  // definition order — the same order `ge --help` lists them.
  out.push(`### \`ge\``, "");
  if (root.meta?.description) out.push(root.meta.description, "");
  for (const [name, sub] of Object.entries(root.subCommands ?? {})) {
    await renderCommand(sub, ["ge", name], out);
  }
  while (out.at(-1) === "") out.pop();
  return out.join("\n");
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
      console.error(`    - ${b[i] ?? "<missing>"}`);
      console.error(`    + ${a[i] ?? "<missing>"}`);
      shown += 1;
    }
  }
  if (shown === 20) console.error("  … (more differences elided)");
}

async function main() {
  const check = process.argv.includes("--check");
  const doc = readFileSync(DOC_PATH, "utf8");
  const { before, region, after } = splitDoc(doc);
  const generated = await generateRegion();

  if (check) {
    if (region !== generated) {
      console.error("✗ docs/reference/cli.md ge-command-tree region is stale vs tools/ge.mjs");
      printLineDiff(generated, region);
      console.error("Run: bun run docs:cli");
      process.exit(1);
    }
    console.log("✓ docs/reference/cli.md ge-command-tree region matches the ge command tree");
    return;
  }

  writeFileSync(DOC_PATH, `${before}\n${generated}\n${after}`);
  console.log("generated docs/reference/cli.md ge-command-tree region");
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
