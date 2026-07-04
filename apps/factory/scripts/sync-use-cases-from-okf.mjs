#!/usr/bin/env node
// sync-use-cases-from-okf.mjs — build the generated catalog from the corpus.
//
// The committed OKF corpus (repo-root `okf/`, one Knowledge Bundle per use
// case) is the PRIMARY source of the agent catalog. This script:
//
//   1. reads every `okf/<id>/` bundle (spec.json + concept tree),
//   2. compiles each bundle with @ge/okf/compile and VERIFIES it — zero
//      compile errors, concept tree in byte-lockstep with spec.json, compiled
//      spec byte-identical to compiling the in-memory rebuild, spec
//      invariants recovered (see lib/okf-corpus.mjs) — a broken bundle fails
//      the sync rather than silently producing a catalog,
//   3. writes the exact artifacts the legacy slides sync produced:
//      `generated/use-cases.generated.json` (git-ignored, loaded lazily via
//      src/use-cases.js) and the TRACKED `src/agent-spec-registry.generated.json`
//      (drift-guarded by tools/check-generated-drift.mjs — bytes here are a
//      pure function of the corpus, no wall clock),
//   4. refreshes the corpus root `okf/index.md` (derived, deterministic).
//
// BYTE-COMPATIBILITY: the artifact writers below mirror
// sync-use-cases-from-slides.mjs (the legacy escape hatch, kept as
// `bun run catalog:from-slides`) byte for byte — including the registry's
// legacy `sources` block, which still names the historical upstreams. The
// migration (`migrate-catalog-to-okf.mjs`) proved both syncs emit identical
// bytes; keep them in lockstep if either writer changes.
//
// GE_AGENT_SPEC_REGISTRY_OUT redirects the registry write (used by the drift
// checker to regenerate to a temp path). GE_OKF_SYNC_VERIFY=0 skips step 2's
// deep verification (compile + lockstep) for tight inner loops — CI and the
// drift gate always run it.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { writeConceptFile } from "@ge/okf";
import {
  mergeAgentSpecEntries,
  registrySummary,
} from "../src/agent-spec-registry.js";
import {
  MIGRATION_TIMESTAMP,
  corpusIndexContent,
  corpusRoot,
  listBundleDirs,
  readBundleSpec,
  verifyBundleAgainstSpec,
} from "./lib/okf-corpus.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(SCRIPT_DIR, "..");
const REPO_ROOT = resolve(APP_ROOT, "..", "..");
// Legacy source paths, recorded verbatim in the registry's `sources` block for
// byte-compatibility with the slides sync (they are provenance, not inputs).
const LEGACY_SLIDES_ROOT = resolve(REPO_ROOT, "apps", "presentation", "src", "components", "slides", "use-cases");
const OUT_PATH = join(APP_ROOT, "generated", "use-cases.generated.json");
const REGISTRY_OUT_PATH = process.env.GE_AGENT_SPEC_REGISTRY_OUT
  || join(APP_ROOT, "src", "agent-spec-registry.generated.json");

function verifyDisabled() {
  return ["0", "false", "no", "off"].includes(String(process.env.GE_OKF_SYNC_VERIFY ?? "").toLowerCase());
}

/** Load + verify every corpus bundle; returns { entries, failures }. */
export async function loadCorpusEntries({ root = corpusRoot(REPO_ROOT), verify = !verifyDisabled() } = {}) {
  const dirs = await listBundleDirs(root);
  if (!dirs.length) {
    throw new Error(
      `No OKF bundles found under ${root}/ — the corpus is the primary catalog source. ` +
        "Materialize it with: bun run catalog:migrate",
    );
  }
  const entries = [];
  const failures = [];
  for (const dir of dirs) {
    const bundleDir = join(root, dir);
    const entry = await readBundleSpec(bundleDir);
    if (entry.id !== dir) {
      failures.push({ id: dir, problems: [{ kind: "id-mismatch", message: `spec.json id "${entry.id}" != bundle directory "${dir}"`, fix: "rename the directory to the spec id or fix spec.json" }] });
      continue;
    }
    if (verify) {
      const verdict = await verifyBundleAgainstSpec(bundleDir, entry, { timestamp: MIGRATION_TIMESTAMP });
      if (!verdict.ok) {
        failures.push({ id: dir, problems: verdict.problems });
        continue;
      }
    }
    entries.push(entry);
  }
  return { entries, failures };
}

/** Write the two catalog artifacts + the corpus root index. Returns paths/counts. */
export async function syncUseCasesFromOkf(options = {}) {
  const root = options.root || corpusRoot(REPO_ROOT);
  const { entries, failures } = await loadCorpusEntries({ root, ...options });
  if (failures.length) {
    const detail = failures
      .map((failure) => `  ${failure.id}: ${failure.problems.map((p) => `[${p.kind}] ${p.file || p.message || ""}${p.fix ? ` (fix: ${p.fix})` : ""}`).join("; ")}`)
      .join("\n");
    throw new Error(`OKF corpus verification failed for ${failures.length} bundle(s):\n${detail}`);
  }

  const mergedUseCases = mergeAgentSpecEntries(entries);

  // The corpus root index is derived from the bundle set; refresh it FIRST so
  // it never ends up newer than the artifacts (src/use-cases.js treats a
  // newer corpus as a stale artifact and would re-sync on every cold load).
  await writeConceptFile(join(root, "index.md"), corpusIndexContent(mergedUseCases, { timestamp: MIGRATION_TIMESTAMP }));

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(mergedUseCases, null, 2)}\n`, "utf8");

  await writeFile(
    REGISTRY_OUT_PATH,
    `${JSON.stringify({
      kind: "ge.agent_spec.registry",
      version: 1,
      // Deliberately no generatedAt (see sync-use-cases-from-slides.mjs):
      // regeneration over unchanged inputs must be a byte no-op.
      sources: {
        slides: relative(APP_ROOT, LEGACY_SLIDES_ROOT),
        interviews: "catalog/interview-specs",
      },
      summary: registrySummary(mergedUseCases),
      entries: mergedUseCases.map((entry) => ({
        id: entry.id,
        title: entry.title,
        department: entry.department,
        domainId: entry.domainId,
        systems: entry.systems,
        hasBehaviorContract: entry.hasBehaviorContract,
        registry: entry.registry,
      })),
    }, null, 2)}\n`,
    "utf8",
  );

  return { count: mergedUseCases.length, outPath: OUT_PATH, registryOutPath: REGISTRY_OUT_PATH, corpus: root };
}

async function main() {
  const result = await syncUseCasesFromOkf();
  console.log(`Synced ${result.count} use cases to ${relative(APP_ROOT, result.outPath)}`);
  console.log(`Registry: ${relative(APP_ROOT, result.registryOutPath)}`);
  console.log(`Source: OKF corpus at ${relative(REPO_ROOT, result.corpus)}/`);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}
