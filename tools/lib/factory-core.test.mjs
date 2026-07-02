import { beforeAll, describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { reviewSpec } from "./factory-core.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
// The use-case catalog is a git-ignored build artifact (`bun run catalog`), so a
// fresh clone/worktree doesn't have it and reviewSpec() can't resolve catalog
// specs. Bootstrap it once here instead of failing (CI already runs the sync as
// its own step; this closes the same gap for local/agent worktrees). Note the
// sync also rewrites the tracked src/agent-spec-registry.generated.json — a
// known determinism bug in that writer (taste-campaign 08-next-horizon A1), so
// this runs ONLY when the catalog is actually missing.
const CATALOG_PATH = join(REPO_ROOT, "apps", "factory", "generated", "use-cases.generated.json");

beforeAll(() => {
  if (existsSync(CATALOG_PATH)) return;
  console.log("factory-core.test: use-cases.generated.json missing — bootstrapping via `bun run catalog`");
  execFileSync("bun", [join(REPO_ROOT, "apps", "factory", "scripts", "sync-use-cases-from-slides.mjs")], {
    cwd: REPO_ROOT,
    stdio: "ignore",
    timeout: 60_000,
  });
});

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
