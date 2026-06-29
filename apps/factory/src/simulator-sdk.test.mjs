import { describe, expect, test } from "bun:test";
import { simulatorSdkPlan } from "./simulator-sdk.js";

const registry = {
  simulators: [
    {
      id: "workday",
      displayName: "Workday",
      aliases: ["Workday HCM", "workday_hcm"],
      maturity: "domain_realistic",
      family: "hr-talent",
      schemaPath: "apps/factory/simulator-systems/workday/schema.json",
      toolsPath: "apps/factory/simulator-systems/workday/tools.json",
      materializationPath: "apps/factory/simulator-systems/workday/materialization.json",
    },
  ],
};

function sampleSpec() {
  return {
    id: "benefits-life-event-review",
    title: "Benefits Life Event Review",
    generationSpec: {
      sourceSystems: [{ id: "workday", name: "Workday HCM" }],
      entities: [{ sourceSystemId: "workday", name: "worker", primaryKey: "worker_id" }],
      documents: [{ id: "benefits_policy", sourceSystemId: "workday" }],
      behaviorContract: {
        toolIntents: [{ name: "query_workday_worker", kind: "query", sourceSystemId: "workday" }],
      },
    },
  };
}

describe("simulator sdk", () => {
  test("prefers existing registry simulator instead of scaffolding", () => {
    const plan = simulatorSdkPlan({
      spec: sampleSpec(),
      simulator: { id: "workday", createIfMissing: true },
      registry,
    });

    expect(plan.ok).toBe(true);
    expect(plan.lifecycleMode).toBe("use_existing");
    expect(plan.simulator.existing).toBe(true);
    expect(plan.commands.scaffold).toBe(null);
    expect(plan.commands.mockGenerate).toContain("--usecase");
    expect(plan.commands.simulatorValidate).toContain("workday");
    expect(plan.artifacts.blobObjectPlan).toContain("mock_data/blobs/object-plan.yaml");
    expect(plan.artifacts.documentsManifest).toContain("mock_data/blobs/documents_manifest.ndjson");
    expect(plan.artifacts.cloudDocumentsManifest).toContain("documents_manifest.jsonl");
    expect(plan.scope.documents[0].format).toBe("md");
  });

  test("plans scaffold for missing simulator when allowed", () => {
    const plan = simulatorSdkPlan({
      spec: {
        id: "custom-risk-review",
        generationSpec: { sourceSystems: [{ id: "custom_risk", name: "Custom Risk" }] },
      },
      simulator: { id: "custom_risk", displayName: "Custom Risk", archetype: "procurement" },
      registry,
    });

    expect(plan.lifecycleMode).toBe("scaffold_missing");
    expect(plan.commands.scaffold).toContain("custom_risk");
    expect(plan.ok).toBe(true);
  });

  test("blocks missing simulator when createIfMissing is false", () => {
    const plan = simulatorSdkPlan({
      spec: {
        id: "custom-risk-review",
        generationSpec: { sourceSystems: [{ id: "custom_risk", name: "Custom Risk" }] },
      },
      simulator: { id: "custom_risk", createIfMissing: false },
      registry,
    });

    expect(plan.ok).toBe(false);
    expect(plan.lifecycleMode).toBe("missing_blocked");
    expect(plan.commands.scaffold).toBe(null);
    expect(plan.warnings[0]).toContain("missing");
  });
});
