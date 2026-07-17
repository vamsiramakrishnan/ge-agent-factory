// The corpus-wide mutation-model gate: every simulator pack's write handlers
// stay conformant to ge.mutation-model.v1 after the 2026-07-06 one-sweep
// migration (tools/mutation-annotate-corpus.mjs). A pack added or edited
// without declared write semantics fails HERE, with the exact contract
// violations, instead of surfacing as a Phase 2 profiler surprise.
// Repo root is derived from this file, not cwd, so the test passes from any
// working directory.
import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCorpusMutations } from "@ge/byo-systems/mutation-model";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("every corpus pack's write handlers conform to ge.mutation-model.v1", async () => {
  const report = await validateCorpusMutations({ repoRoot: REPO_ROOT });
  const failing = report.systems.filter((s) => !s.ok).map((s) => `${s.system}: ${s.problems.join("; ")}`);
  expect(failing).toEqual([]);
  expect(report.summary.total).toBeGreaterThan(80); // the corpus, not an empty read
});

test("registered missing or corrupt sections are errors, never read-only packs", async () => {
  const root = await mkdtemp(join(tmpdir(), "ge-mutation-corpus-"));
  const registryPath = join(root, "registry.json");
  const registry = {
    simulators: [{ id: "broken", schemaPath: "schema.json", toolsPath: "tools.json", workflowsPath: "workflows.json" }],
  };
  try {
    await writeFile(registryPath, JSON.stringify(registry));
    await expect(validateCorpusMutations({ repoRoot: root, registryPath })).rejects.toThrow("could not read pack section");

    await writeFile(join(root, "schema.json"), JSON.stringify({ collections: {} }));
    await writeFile(join(root, "tools.json"), "{corrupt");
    await writeFile(join(root, "workflows.json"), JSON.stringify({ version: 1, toolHandlers: {} }));
    await expect(validateCorpusMutations({ repoRoot: root, registryPath })).rejects.toThrow("could not read pack section");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
