#!/usr/bin/env node
// check-okf-primary — prove the committed OKF corpus stays the catalog source.
//
// The agent catalog's primary source is the committed OKF corpus: one
// Knowledge Bundle per use case at okf/<use-case-id>/ (concept tree +
// spec.json record), from which `bun run catalog`
// (apps/factory/scripts/sync-use-cases-from-okf.mjs) derives the generated
// catalog artifacts. This checker enforces the corpus↔catalog bijection so
// neither side can drift:
//
//   - every entry in the TRACKED registry
//     (apps/factory/src/agent-spec-registry.generated.json) traces to an
//     okf/<id>/ bundle with index.md (okf_version + provenance keys) and
//     spec.json whose id matches the directory;
//   - every bundle directory traces back to a registry entry;
//   - every interview spec (apps/factory/catalog/interview-specs/*.json) has
//     a bundle, so a newly registered interview cannot silently drop out of
//     the corpus-built catalog.
//
// Deep verification (byte-lockstep concept tree, zero compile errors, compile
// parity) runs inside the sync itself and in migrate-catalog-to-okf.mjs; this
// gate is the cheap structural half that source:hygiene runs on every commit.
//
//   node tools/check-okf-primary.mjs   # exit 1 on findings (part of source:hygiene)

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const REGISTRY_FILE = "apps/factory/src/agent-spec-registry.generated.json";
const INTERVIEW_DIR = "apps/factory/catalog/interview-specs";
const CORPUS_DIR = "okf";
const MIGRATE_HINT = "author the bundle or run: bun run catalog:migrate (node apps/factory/scripts/migrate-catalog-to-okf.mjs)";

function bundleDirs(corpusRoot) {
  if (!existsSync(corpusRoot)) return null;
  return readdirSync(corpusRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

// The spec.json writer emits the normalized entry with `id` as its first key;
// read just the head so the gate stays cheap across 364 bundles.
function specJsonId(path) {
  const head = readFileSync(path, "utf8").slice(0, 512);
  const match = head.match(/"id":\s*"([^"]+)"/);
  if (match) return match[1];
  try {
    return JSON.parse(readFileSync(path, "utf8")).id ?? null;
  } catch {
    return null;
  }
}

function frontmatterHead(path) {
  const text = readFileSync(path, "utf8");
  if (!text.startsWith("---\n")) return "";
  const end = text.indexOf("\n---", 4);
  return end === -1 ? text : text.slice(0, end + 4);
}

// Structural corpus↔catalog findings. Returns { ok, findings, entries,
// bundles } — rendering happens at the CLI boundary (house rule: return/throw).
export function checkOkfPrimary({ root = ROOT } = {}) {
  const findings = [];
  const corpusRoot = join(root, CORPUS_DIR);
  const dirs = bundleDirs(corpusRoot);
  if (dirs === null) {
    return {
      ok: false,
      findings: [{ kind: "missing-corpus", detail: `${CORPUS_DIR}/ does not exist — the OKF corpus is the primary catalog source.`, fix: MIGRATE_HINT }],
      entries: 0,
      bundles: 0,
    };
  }
  const bundles = new Set(dirs);

  let registry;
  try {
    registry = JSON.parse(readFileSync(join(root, REGISTRY_FILE), "utf8"));
  } catch (error) {
    return {
      ok: false,
      findings: [{ kind: "missing-registry", detail: `${REGISTRY_FILE} is missing or unreadable (${error.message}).`, fix: "regenerate it with: bun run catalog" }],
      entries: 0,
      bundles: bundles.size,
    };
  }
  const entryIds = (registry.entries || []).map((entry) => entry.id);

  // Registry entry → bundle (with the bundle's own required files intact).
  for (const id of entryIds) {
    if (!bundles.has(id)) {
      findings.push({ kind: "entry-without-bundle", id, detail: `registry entry "${id}" has no ${CORPUS_DIR}/${id}/ bundle.`, fix: MIGRATE_HINT });
      continue;
    }
    const indexPath = join(corpusRoot, id, "index.md");
    if (!existsSync(indexPath)) {
      findings.push({ kind: "bundle-incomplete", id, detail: `${CORPUS_DIR}/${id}/index.md is missing.`, fix: MIGRATE_HINT });
    } else {
      const head = frontmatterHead(indexPath);
      if (!/^okf_version:/m.test(head)) {
        findings.push({ kind: "bundle-incomplete", id, detail: `${CORPUS_DIR}/${id}/index.md frontmatter lacks okf_version.`, fix: MIGRATE_HINT });
      }
      if (!/^provenance_origin:/m.test(head)) {
        findings.push({ kind: "bundle-incomplete", id, detail: `${CORPUS_DIR}/${id}/index.md frontmatter lacks the provenance keys (provenance_origin, ...).`, fix: MIGRATE_HINT });
      }
    }
    const specPath = join(corpusRoot, id, "spec.json");
    if (!existsSync(specPath)) {
      findings.push({ kind: "bundle-incomplete", id, detail: `${CORPUS_DIR}/${id}/spec.json is missing.`, fix: MIGRATE_HINT });
    } else {
      const specId = specJsonId(specPath);
      if (specId !== id) {
        findings.push({ kind: "bundle-incomplete", id, detail: `${CORPUS_DIR}/${id}/spec.json declares id "${specId}".`, fix: "rename the bundle directory to the spec id, or fix spec.json" });
      }
    }
  }

  // Bundle → registry entry.
  const known = new Set(entryIds);
  for (const dir of dirs) {
    if (!known.has(dir)) {
      findings.push({
        kind: "bundle-without-entry",
        id: dir,
        detail: `${CORPUS_DIR}/${dir}/ has no entry in ${REGISTRY_FILE}.`,
        fix: "rebuild the catalog from the corpus (bun run catalog) and commit the refreshed registry, or remove the stray bundle",
      });
    }
  }

  // Interview spec → bundle (a registered interview must not silently drop
  // out of the corpus-built catalog).
  const interviewRoot = join(root, INTERVIEW_DIR);
  if (existsSync(interviewRoot)) {
    for (const file of readdirSync(interviewRoot).filter((name) => name.endsWith(".json")).sort()) {
      const id = specJsonId(join(interviewRoot, file)) || file.replace(/\.json$/, "");
      if (!bundles.has(id)) {
        findings.push({ kind: "interview-without-bundle", id, detail: `${INTERVIEW_DIR}/${file} has no ${CORPUS_DIR}/${id}/ bundle.`, fix: MIGRATE_HINT });
      }
    }
  }

  return { ok: findings.length === 0, findings, entries: entryIds.length, bundles: bundles.size };
}

export function formatOkfPrimaryReport(result) {
  if (result.ok) {
    return `OKF-primary check passed: ${result.entries} registry entries ↔ ${result.bundles} corpus bundles (okf/ is the catalog source).`;
  }
  const lines = [`OKF-primary check FAILED (${result.findings.length} finding${result.findings.length === 1 ? "" : "s"}):`];
  for (const finding of result.findings) {
    lines.push("");
    lines.push(`[${finding.kind}] ${finding.detail}`);
    if (finding.fix) lines.push(`  fix: ${finding.fix}`);
  }
  return lines.join("\n");
}

// Run only when this file is the process entry point (house pattern) —
// importing it must stay side-effect-free.
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
    const result = checkOkfPrimary();
    const writer = result.ok ? process.stdout : process.stderr;
    writer.write(formatOkfPrimaryReport(result) + "\n");
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
