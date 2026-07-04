// okf-corpus.test.mjs — the corpus library's determinism + verification seams.
//
// Uses a small synthetic catalog entry (not the 364-entry catalog) so the
// whole file stays fast. The full-corpus proof lives in the migration script
// (`bun run catalog:migrate` verifies all bundles) and the sync.

import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  MIGRATION_TIMESTAMP,
  bundleFilesForSpec,
  corpusIndexContent,
  verifyBundleAgainstSpec,
} from "./okf-corpus.mjs";

const ENTRY = {
  id: "corpus-test-agent",
  title: "Corpus Test Agent",
  department: "finance",
  sourcePath: "../presentation/src/components/slides/use-cases/finance/CorpusTest.tsx",
  registry: { sourceKind: "slide" },
  generationSpec: {
    sourceSystems: [
      { id: "ledger", name: "Ledger", protocol: "fixture", owns: ["ledger_records"] },
    ],
    entities: [
      {
        name: "ledger_records",
        sourceSystemId: "ledger",
        primaryKey: "id",
        columns: [{ name: "id", type: "seq", required: true }],
      },
    ],
    behaviorContract: {
      role: "tester",
      primaryObjective: "exercise the corpus library",
      inScope: ["answer ledger questions"],
      outOfScope: ["anything else"],
      toolIntents: [
        { name: "query_ledger_records", kind: "query", sourceSystemId: "ledger", evidenceEmitted: ["ledger_record"] },
      ],
    },
  },
};

async function materialize(entry) {
  const dir = await mkdtemp(join(tmpdir(), "okf-corpus-test-"));
  const bundleDir = join(dir, entry.id);
  for (const [rel, content] of bundleFilesForSpec(entry)) {
    const abs = join(bundleDir, rel);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, content, "utf8");
  }
  return { dir, bundleDir };
}

test("bundleFilesForSpec is deterministic and provenance-stamps the root index", () => {
  const a = bundleFilesForSpec(ENTRY);
  const b = bundleFilesForSpec(ENTRY);
  expect([...a.keys()]).toEqual([...b.keys()]);
  for (const [rel, content] of a) expect(b.get(rel)).toBe(content);

  const index = a.get("index.md");
  expect(index).toContain('okf_version: "0.1"');
  expect(index).toContain("provenance_origin: deck");
  expect(index).toContain("provenance_status: registered");
  expect(index).toContain(`provenance_created_at: "${MIGRATION_TIMESTAMP}"`);
  expect(index).toContain("provenance_source_ref");
  // The spec record rides along, byte-stable.
  expect(a.get("spec.json")).toBe(`${JSON.stringify(ENTRY, null, 2)}\n`);
});

test("interview-sourced entries get provenance_origin: interview", () => {
  const files = bundleFilesForSpec({ ...ENTRY, registry: { sourceKind: "interview" } });
  expect(files.get("index.md")).toContain("provenance_origin: interview");
});

test("a freshly materialized bundle verifies clean", async () => {
  const { dir, bundleDir } = await materialize(ENTRY);
  const verdict = await verifyBundleAgainstSpec(bundleDir, ENTRY);
  expect(verdict.problems).toEqual([]);
  expect(verdict.ok).toBe(true);
  await rm(dir, { recursive: true, force: true });
});

test("markdown drift, extra files, and missing files are named problems", async () => {
  const { dir, bundleDir } = await materialize(ENTRY);

  await writeFile(join(bundleDir, "playbook.md"), "---\ntype: Playbook\n---\n# Edited by hand\n", "utf8");
  await writeFile(join(bundleDir, "rogue.md"), "---\ntype: Note\n---\n# Rogue\n", "utf8");
  await rm(join(bundleDir, "kpis.md"));

  const verdict = await verifyBundleAgainstSpec(bundleDir, ENTRY);
  expect(verdict.ok).toBe(false);
  const byKind = Object.groupBy(verdict.problems, (p) => p.kind);
  expect(byKind["content-drift"].map((p) => p.file)).toContain("playbook.md");
  expect(byKind["extra-file"].map((p) => p.file)).toContain("rogue.md");
  expect(byKind["missing-file"].map((p) => p.file)).toContain("kpis.md");
  await rm(dir, { recursive: true, force: true });
});

test("corpus index lists bundles deterministically by id", () => {
  const entries = [
    { id: "zeta", title: "Zeta" },
    { id: "alpha", title: "Alpha" },
  ];
  const index = corpusIndexContent(entries);
  expect(index).toBe(corpusIndexContent([entries[1], entries[0]]));
  expect(index.indexOf("[Alpha](/alpha/index.md)")).toBeLessThan(index.indexOf("[Zeta](/zeta/index.md)"));
});
