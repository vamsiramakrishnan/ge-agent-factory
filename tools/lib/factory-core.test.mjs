import { describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { reviewSpec } from "./factory-core.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

describe("factory core spec review", () => {
  test("resolves existing catalog specs without requiring interview artifacts", async () => {
    const review = await reviewSpec({ usecaseId: "benefits-q-a-enrollment" });

    expect(review.found).toBe(true);
    expect(review.source).toBe("canonical_catalog_spec");
    expect(review.summary.id).toBe("benefits-q-a-enrollment");
    expect(review.path).toContain("use-cases.generated.json#benefits-q-a-enrollment");
  });

  test("scenario aliases can resolve to generated interview artifacts", async () => {
    const specDir = join(STATE_PATHS.interviews.root, "help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr");
    try {
      await mkdir(specDir, { recursive: true });
      await writeFile(join(specDir, "agent-spec.json"), `${JSON.stringify({
        id: "help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr",
        title: "Help HR teams resolve benefits enrollment exceptions before payroll",
        department: "hr",
        persona: "Benefits operations lead",
        generationSpec: {
          sourceSystems: [{ id: "workday", name: "Workday" }],
          entities: [{ name: "BenefitsEnrollment" }],
          behaviorContract: { role: "Benefits operations lead", goldenEvals: [] },
        },
      }, null, 2)}\n`, "utf8");

      const review = await reviewSpec({ usecaseId: "benefits-enrollment" });

      expect(review.found).toBe(true);
      expect(review.source).toBe("generated_artifact");
      expect(review.resolvedFrom).toBe("benefits-enrollment");
      expect(review.usecaseId).toBe("help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr");
    } finally {
      await rm(specDir, { recursive: true, force: true });
    }
  });
});
