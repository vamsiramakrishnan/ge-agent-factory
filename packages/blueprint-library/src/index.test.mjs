import { describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateLibraryIndex, searchBlueprints, resolveBlueprint, createFromLibrary, blueprintStatus } from "./index.mjs";

describe("agent library", () => {
  test("generates a searchable index with AML blueprint metadata", async () => {
    // Write to a temp path: the default out is the TRACKED okf/library/index.json,
    // and regenerating it stamps a fresh generatedAt — with the default, every
    // test run dirties the working tree with pure timestamp churn.
    const dir = await mkdtemp(join(tmpdir(), "ge-library-index-"));
    let index;
    try {
      index = await generateLibraryIndex({ out: join(dir, "index.json") });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
    expect(index.schemaVersion).toBe("agent-library.v1");
    expect(index.counts.blueprints).toBeGreaterThan(300);
    const rows = await searchBlueprints("aml");
    expect(rows.some((b) => b.slug === "banking/aml-alert-investigation-agent")).toBe(true);
    const aml = await resolveBlueprint("banking/aml-alert-investigation-agent");
    expect(aml.inventory.toolIntents).toBeGreaterThan(0);
    expect(aml.commands.create).toContain("ge create --from-library");
  });

  test("creates a receipt-backed workspace from a library blueprint", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-library-"));
    try {
      const out = join(dir, "aml-agent");
      const receipt = await createFromLibrary({ slug: "banking/aml-alert-investigation-agent", outDir: out });
      expect(receipt.ok).toBe(true);
      expect(receipt.artifacts.map((a) => a.path)).toContain(join(out, "okf/agent.okf.md"));
      expect(receipt.nextCommand).toContain("ge prove");
      const status = await blueprintStatus("banking/aml-alert-investigation-agent");
      expect(status.state).toBe("evals_ready");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
