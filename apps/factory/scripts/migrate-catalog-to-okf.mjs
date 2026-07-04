#!/usr/bin/env node
// migrate-catalog-to-okf.mjs — materialize the committed OKF corpus (`okf/`).
//
// For every catalog use case (slides-derived + interview-specs), render the
// spec→OKF Knowledge Bundle into `okf/<use-case-id>/` (concept tree with
// provenance-stamped root index.md + the normalized spec.json record), write
// the corpus root `okf/index.md`, and VERIFY every bundle: the on-disk tree
// byte-matches its rebuild, `compileOkfBundle` reports zero errors, and the
// compiled spec is byte-identical (modulo collection-order canonicalization)
// to compiling the in-memory rebuild — failing loudly per bundle otherwise.
//
//   node scripts/migrate-catalog-to-okf.mjs [--id <useCaseId>] [--no-sync] [--out <dir>]
//
// Deterministic and idempotent: every emitted byte is a pure function of the
// catalog entry and the fixed MIGRATION_TIMESTAMP (never wall clock), so
// re-running over unchanged inputs is a byte no-op. The upstream source is the
// LEGACY slides sync (`sync-use-cases-from-slides.mjs`), which this script
// runs first by default (--no-sync to skip) — after migration, day-to-day
// catalog builds come from the corpus via `sync-use-cases-from-okf.mjs`.
//
// Existing bundle directories that no longer correspond to a catalog entry are
// REPORTED (never deleted): hand-authored bundles may legitimately precede
// their catalog entry, and `tools/check-okf-primary.mjs` arbitrates.

import { readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { joinBundle, writeConceptFile } from "@ge/okf";

import {
  MIGRATION_TIMESTAMP,
  bundleFilesForSpec,
  corpusIndexContent,
  corpusRoot,
  listBundleDirs,
  verifyBundleAgainstSpec,
  walkMarkdown,
} from "./lib/okf-corpus.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(SCRIPT_DIR, "..");
const REPO_ROOT = resolve(APP_ROOT, "..", "..");
const CATALOG_PATH = join(APP_ROOT, "generated", "use-cases.generated.json");
const SLIDES_SYNC = join(SCRIPT_DIR, "sync-use-cases-from-slides.mjs");

export function parseArgs(argv) {
  const args = { sync: true };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--id") args.id = argv[++i];
    else if (token === "--no-sync") args.sync = false;
    else if (token === "--out") args.out = argv[++i];
    else if (token === "--help" || token === "-h") args.help = true;
  }
  return args;
}

/**
 * Migrate the catalog into the corpus. Returns the structured report
 * (house rule: return/throw — rendering happens at the CLI boundary below).
 */
export async function migrateCatalogToOkf({ id, out, sync = true } = {}) {
  if (sync) {
    // Refresh the generated catalog from the legacy upstream (slides +
    // interview-specs). Deterministic: a byte no-op over unchanged inputs.
    execFileSync(process.execPath, [SLIDES_SYNC], { cwd: APP_ROOT, stdio: ["ignore", "pipe", "pipe"] });
  }
  const catalog = JSON.parse(await readFile(CATALOG_PATH, "utf8"));
  const entries = id ? catalog.filter((entry) => entry.id === id) : catalog;
  if (id && !entries.length) throw new Error(`Use case '${id}' not found in ${CATALOG_PATH}.`);

  const root = out ? resolve(out) : corpusRoot(REPO_ROOT);
  const report = {
    corpus: relative(REPO_ROOT, root) || ".",
    timestamp: MIGRATION_TIMESTAMP,
    bundles: 0,
    files: 0,
    prunedFiles: 0,
    verified: 0,
    failures: [],
    orphanBundles: [],
  };

  for (const entry of entries) {
    const bundleDir = join(root, entry.id);
    const files = bundleFilesForSpec(entry, { timestamp: MIGRATION_TIMESTAMP });

    // Write every generated file (atomic per file via writeConceptFile).
    for (const [rel, content] of files) {
      await writeConceptFile(joinBundle(bundleDir, rel), content);
    }
    // Prune stale generated markdown (e.g. a concept renamed away) so the
    // bundle converges on exactly the generated set. spec.json and any non-md
    // files are never pruned.
    for (const rel of await walkMarkdown(bundleDir)) {
      if (!files.has(rel)) {
        await rm(join(bundleDir, rel));
        report.prunedFiles += 1;
      }
    }

    report.bundles += 1;
    report.files += files.size;

    const verdict = await verifyBundleAgainstSpec(bundleDir, entry, { timestamp: MIGRATION_TIMESTAMP });
    if (verdict.ok) report.verified += 1;
    else report.failures.push({ id: entry.id, problems: verdict.problems });
  }

  // Corpus root index + orphan detection only make sense for a full run.
  if (!id) {
    await writeConceptFile(join(root, "index.md"), corpusIndexContent(catalog, { timestamp: MIGRATION_TIMESTAMP }));
    report.files += 1;
    const known = new Set(catalog.map((entry) => entry.id));
    report.orphanBundles = (await listBundleDirs(root)).filter((dir) => !known.has(dir));
  }

  report.ok = report.failures.length === 0;
  return report;
}

function formatReport(report) {
  const lines = [
    `Migrated ${report.bundles} bundle${report.bundles === 1 ? "" : "s"} (${report.files} files) into ${report.corpus}/ at ${report.timestamp}.`,
    `Verified ${report.verified}/${report.bundles}: lockstep bytes, zero compile errors, compile parity, spec invariants.`,
  ];
  if (report.prunedFiles) lines.push(`Pruned ${report.prunedFiles} stale generated concept file${report.prunedFiles === 1 ? "" : "s"}.`);
  if (report.orphanBundles.length) {
    lines.push(`Orphan bundle director${report.orphanBundles.length === 1 ? "y" : "ies"} with no catalog entry (left untouched): ${report.orphanBundles.join(", ")}.`);
  }
  for (const failure of report.failures) {
    lines.push(`FAILED ${failure.id}:`);
    for (const problem of failure.problems.slice(0, 10)) {
      lines.push(`  - [${problem.kind}] ${problem.file || problem.conceptPath || ""} ${problem.message || ""}`.trimEnd());
      if (problem.fix) lines.push(`    fix: ${problem.fix}`);
    }
    if (failure.problems.length > 10) lines.push(`  ... and ${failure.problems.length - 10} more`);
  }
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write("usage: migrate-catalog-to-okf.mjs [--id <useCaseId>] [--no-sync] [--out <dir>]\n");
    return;
  }
  const report = await migrateCatalogToOkf(args);
  const writer = report.ok ? process.stdout : process.stderr;
  writer.write(`${formatReport(report)}\n`);
  if (process.env.GE_OKF_MIGRATE_REPORT) {
    await writeFile(process.env.GE_OKF_MIGRATE_REPORT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  process.exit(report.ok ? 0 : 1);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}
