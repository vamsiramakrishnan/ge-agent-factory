#!/usr/bin/env node
// Generate the factory-line skill matrix — one row per station skill, mapping
// it to its capability (FACTORY_SKILL_BINDINGS), the `ge` commands it drives
// (skills/skill-routing.json `commands` → cli strings from the shared command
// registry), the engine packages behind them (`engines` → packages/*), and its
// reference docs (`docs`). The table is written into generated regions in BOTH
// skills/README.md and docs/reference/architecture.md; the hand-written prose
// around the markers is never touched.
//
//   node apps/factory/scripts/gen-skill-matrix.mjs           # regenerate both regions
//   node apps/factory/scripts/gen-skill-matrix.mjs --check   # exit 1 (+ diff) if stale
//
// Lives in apps/factory/scripts/ (not tools/) because it imports app source
// (FACTORY_SKILL_BINDINGS) — tools/ must never import from apps/*
// (tools/check-no-app-imports.mjs). The command registry is loaded through a
// computed-path dynamic import because the static apps→tools-lib surface
// (tools/check-app-import-surface.mjs) is frozen shrink-only; the same
// computed-URL pattern is already used by apps/factory/scripts/factory.mjs.
//
// House rule (docs/plans/taste-campaign/05-generated-truth.md): this script
// renders ONLY what its sources contain. A skill with no routing entry (or an
// entry without commands/engines/docs) renders an em dash — the fix is
// declaring the fields in skills/skill-routing.json, never prose invented
// here. Before rendering it VALIDATES the sources and exits 1 listing every
// violation: unknown command ids, unknown engine package names, missing doc
// paths, routing ids without a SKILL.md — plus packages/README.md parity
// (every packages/<dir> with a package.json needs a table row there).
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FACTORY_SKILL_BINDINGS } from "../src/skill-registry.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

export const BEGIN = "<!-- BEGIN GENERATED: skill-matrix — do not edit; run `bun run docs:skill-matrix` -->";
export const END = "<!-- END GENERATED: skill-matrix -->";

const DASH = "—";

// Both files carry the same marker pair; links are re-rendered relative to
// each target's own directory (`dir`).
const TARGETS = [
  { rel: "skills/README.md", dir: "skills" },
  { rel: "docs/reference/architecture.md", dir: "docs/reference" },
];

// ── source loading ───────────────────────────────────────────────────────────

export async function loadRegistry(root = ROOT) {
  const url = pathToFileURL(join(root, "tools", "lib", "ge-command-registry.mjs")).href;
  return (await import(url)).GE_COMMANDS;
}

export function loadSources(root = ROOT) {
  const routing = JSON.parse(readFileSync(join(root, "skills", "skill-routing.json"), "utf8"));
  const skillIds = readdirSync(join(root, "skills"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(root, "skills", d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();
  const packagesByName = new Map(); // "@ge/synthkit" -> "synthkit" (dir name)
  const packageDirs = [];
  for (const d of readdirSync(join(root, "packages"), { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const manifestPath = join(root, "packages", d.name, "package.json");
    if (!existsSync(manifestPath)) continue; // e.g. the Python-only packages
    packageDirs.push(d.name);
    const name = JSON.parse(readFileSync(manifestPath, "utf8")).name;
    if (name) packagesByName.set(name, d.name);
  }
  const packagesReadme = readFileSync(join(root, "packages", "README.md"), "utf8");
  return { routing, skillIds, packagesByName, packageDirs, packagesReadme };
}

// ── validation ───────────────────────────────────────────────────────────────

// Returns EVERY violation (never throws on the first) so one run reports the
// whole fix list.
export function validateSources({ root, routing, registryIds, packagesByName, packageDirs, packagesReadme, bindings = [] }) {
  const violations = [];
  for (const binding of bindings) {
    if (!existsSync(join(root, "skills", binding.skill, "SKILL.md"))) {
      violations.push(
        `apps/factory/src/skill-registry.js: FACTORY_SKILL_BINDINGS capability "${binding.capability}" points at skill "${binding.skill}" — no skills/${binding.skill}/SKILL.md`,
      );
    }
  }
  for (const [id, entry] of Object.entries(routing.skills ?? {})) {
    if (!existsSync(join(root, "skills", id, "SKILL.md"))) {
      violations.push(`skills/skill-routing.json: skill "${id}" has no skills/${id}/SKILL.md`);
    }
    for (const engine of entry.engines ?? []) {
      if (!packagesByName.has(engine)) {
        violations.push(
          `skills/skill-routing.json: "${id}".engines lists "${engine}" — no packages/*/package.json has that name`,
        );
      }
    }
    for (const commandId of entry.commands ?? []) {
      if (!registryIds.has(commandId)) {
        violations.push(
          `skills/skill-routing.json: "${id}".commands lists "${commandId}" — not a GE_COMMANDS key in the command registry (tools/lib/ge-command-registry.mjs)`,
        );
      }
    }
    for (const docPath of entry.docs ?? []) {
      if (!existsSync(join(root, docPath))) {
        violations.push(`skills/skill-routing.json: "${id}".docs lists "${docPath}" — no such file`);
      }
    }
  }
  // packages/README.md parity: every packages/<dir> with a package.json needs
  // a table row whose first column names the dir.
  const rows = new Set([...packagesReadme.matchAll(/^\|\s*\[`([^`]+)`\]/gm)].map((m) => m[1]));
  for (const dir of packageDirs) {
    if (!rows.has(dir)) {
      violations.push(`packages/README.md: no table row for packages/${dir} (it has a package.json) — add one`);
    }
  }
  // Reverse direction: a row must point at a real directory (package.json not
  // required — Python packages like generated-agent-runtime have none).
  for (const row of rows) {
    if (!existsSync(join(root, "packages", row))) {
      violations.push(`packages/README.md: table row for "${row}" but packages/${row} does not exist — remove the stale row`);
    }
  }
  return violations;
}

// ── markdown rendering ───────────────────────────────────────────────────────

const escapeCell = (s) => String(s ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");

// Relative link from the target file's directory to a repo-relative path.
const relLink = (fromDir, toPath) => posix.relative(fromDir, toPath) || ".";

export function renderMatrix({ routing, skillIds, packagesByName, registry, bindings, targetDir }) {
  // FACTORY_SKILL_BINDINGS order first (also the source of each skill's
  // capability), then any remaining on-disk skills, alphabetically.
  const capabilityBySkill = new Map();
  for (const binding of bindings) {
    if (!capabilityBySkill.has(binding.skill)) capabilityBySkill.set(binding.skill, binding.capability);
  }
  const onDisk = new Set(skillIds);
  const ordered = [...capabilityBySkill.keys()].filter((id) => onDisk.has(id));
  for (const id of skillIds) if (!capabilityBySkill.has(id)) ordered.push(id);

  const lines = [
    "| Station skill | Capability | `ge` commands | Engine packages | Reference docs |",
    "|---|---|---|---|---|",
  ];
  for (const id of ordered) {
    const entry = routing.skills?.[id] ?? {};
    const capability = capabilityBySkill.get(id);
    const commands = (entry.commands ?? [])
      .map((commandId) => `\`${escapeCell(registry[commandId]?.cli ?? commandId)}\``)
      .join(", ");
    const engines = (entry.engines ?? [])
      .map((name) => {
        const dir = packagesByName.get(name);
        return dir ? `[\`${name}\`](${relLink(targetDir, `packages/${dir}`)}/)` : `\`${name}\``;
      })
      .join(", ");
    const docs = (entry.docs ?? [])
      .map((docPath) => `[\`${posix.basename(docPath)}\`](${relLink(targetDir, docPath)})`)
      .join(", ");
    lines.push(
      `| [\`${id}\`](${relLink(targetDir, `skills/${id}`)}/) ` +
        `| ${capability ? `\`${capability}\`` : DASH} ` +
        `| ${commands || DASH} ` +
        `| ${engines || DASH} ` +
        `| ${docs || DASH} |`,
    );
  }
  return lines.join("\n");
}

// ── marker-region plumbing (same shape as tools/gen-cli-reference.mjs) ──────

export function splitRegion(doc, label) {
  const beginIdx = doc.indexOf(BEGIN);
  const endIdx = doc.indexOf(END);
  if (beginIdx < 0 || endIdx < 0 || endIdx < beginIdx) {
    throw new Error(`marker pair not found in ${label} (expected "${BEGIN}" … "${END}")`);
  }
  return {
    before: doc.slice(0, beginIdx + BEGIN.length),
    region: doc.slice(beginIdx + BEGIN.length, endIdx).replace(/^\n/, "").replace(/\n$/, ""),
    after: doc.slice(endIdx),
  };
}

export function applyRegion(doc, generated, label) {
  const { before, after } = splitRegion(doc, label);
  return `${before}\n${generated}\n${after}`;
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

// ── entry point ──────────────────────────────────────────────────────────────

async function main() {
  const check = process.argv.includes("--check");
  const sources = loadSources(ROOT);
  const registry = await loadRegistry(ROOT);
  const violations = validateSources({
    root: ROOT,
    ...sources,
    registryIds: new Set(Object.keys(registry)),
    bindings: FACTORY_SKILL_BINDINGS,
  });
  if (violations.length) {
    console.error(`✗ gen-skill-matrix: ${violations.length} source violation(s):`);
    for (const v of violations) console.error(`  ${v}`);
    process.exit(1);
  }

  let stale = false;
  for (const target of TARGETS) {
    const path = join(ROOT, ...target.rel.split("/"));
    const doc = readFileSync(path, "utf8");
    const generated = renderMatrix({
      ...sources,
      registry,
      bindings: FACTORY_SKILL_BINDINGS,
      targetDir: target.dir,
    });
    if (check) {
      const { region } = splitRegion(doc, target.rel);
      if (region !== generated) {
        stale = true;
        console.error(`✗ ${target.rel} skill-matrix region is stale vs its sources`);
        printLineDiff(generated, region);
      } else {
        console.log(`✓ ${target.rel} skill-matrix region matches its sources`);
      }
    } else {
      writeFileSync(path, applyRegion(doc, generated, target.rel));
      console.log(`generated ${target.rel} skill-matrix region`);
    }
  }
  if (check && stale) {
    console.error("Run: bun run docs:skill-matrix");
    process.exit(1);
  }
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
