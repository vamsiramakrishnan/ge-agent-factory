import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, test } from "bun:test";
import { createFactoryPlan, runFactoryPlan } from "./factory.js";

describe("local factory contract", () => {
  test("usecase selector creates a single-item plan", async () => {
    const dataRoot = await mkdtemp(join(tmpdir(), "ge-factory-plan-"));
    try {
      const result = await createFactoryPlan({
        repoRoot: process.cwd(),
        dataRoot,
        options: { usecases: "account-reconciliation-agent", target: "planned" },
      });
      expect(result.plan.totals.workItems).toBe(1);
      expect(result.plan.workItems[0].useCaseId).toBe("account-reconciliation-agent");
    } finally {
      await rm(dataRoot, { recursive: true, force: true });
    }
  });

  test("planned run writes durable factory events without child process work", async () => {
    const dataRoot = await mkdtemp(join(tmpdir(), "ge-factory-run-"));
    try {
      const plan = await createFactoryPlan({
        repoRoot: process.cwd(),
        dataRoot,
        options: { usecases: "account-reconciliation-agent", target: "planned" },
      });
      const result = await runFactoryPlan({
        repoRoot: process.cwd(),
        dataRoot,
        planPath: plan.planPath,
        options: { target: "planned", continue: "true" },
      });
      expect(result.run.ok).toBe(true);
      expect(result.run.totals.workItems).toBe(1);
      const events = await readFile(join(dataRoot, "factory-events.jsonl"), "utf8");
      expect(events).toContain('"type":"run_started"');
      expect(events).toContain('"type":"item_done"');
      expect(events).toContain('"type":"run_done"');
    } finally {
      await rm(dataRoot, { recursive: true, force: true });
    }
  });
});
