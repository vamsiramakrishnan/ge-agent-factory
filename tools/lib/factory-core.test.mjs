import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { reviewSpec } from "./factory-core.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

let fixtureDir;
let previousCatalogPath;

describe("factory core spec review", () => {
  beforeAll(async () => {
    previousCatalogPath = process.env.GE_USE_CASE_CATALOG;
    fixtureDir = await mkdtemp(join(tmpdir(), "ge-catalog-fixture-"));
    const catalogPath = join(fixtureDir, "use-cases.generated.json");
    await writeFile(catalogPath, `${JSON.stringify([{
      id: "benefits-q-a-enrollment",
      title: "Benefits Q&A Enrollment",
      department: "hr",
      persona: "Benefits operations lead",
      generationSpec: {
        sourceSystems: [{ id: "workday", name: "Workday" }],
        entities: [{ name: "BenefitsEnrollment" }],
        behaviorContract: { role: "Benefits operations lead", goldenEvals: [] },
      },
    }], null, 2)}\n`, "utf8");
    process.env.GE_USE_CASE_CATALOG = catalogPath;
  });

  afterAll(async () => {
    if (previousCatalogPath === undefined) delete process.env.GE_USE_CASE_CATALOG;
    else process.env.GE_USE_CASE_CATALOG = previousCatalogPath;
    if (fixtureDir) await rm(fixtureDir, { recursive: true, force: true });
  });

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
