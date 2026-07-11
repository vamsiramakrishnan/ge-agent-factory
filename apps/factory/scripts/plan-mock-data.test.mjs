import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const SCRIPT = join(SCRIPT_DIR, "plan-mock-data.mjs");
const SOURCE_MAP = join(REPO_ROOT, "apps/factory/src/use-case-source-map.generated.json");

function runPlan(usecase) {
  const dir = mkdtempSync(join(tmpdir(), "ge-plan-mock-data-"));
  try {
    const result = Bun.spawnSync(["node", SCRIPT, "--dir", dir, "--usecase", usecase, "--sourceMap", SOURCE_MAP]);
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);
    expect(stderr).toBe("");
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(stdout);
    const recipePath = join(dir, "mock_data/snowfakery/structured.recipe.yml");
    return {
      ...parsed,
      recipe: existsSync(recipePath) ? readFileSync(recipePath, "utf8") : "",
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function recipeObjects(recipe = "") {
  return new Set([...recipe.matchAll(/^- object: ([^\n]+)/gm)].map((match) => match[1].trim()));
}

function recipeReferences(recipe = "") {
  return [...recipe.matchAll(/reference\('([^']+)'\)/g)].map((match) => match[1]);
}

describe("plan-mock-data use case lookup", () => {
  test("resolves mission-friendly benefits enrollment slug to catalog use case", () => {
    const result = runPlan("benefits-enrollment");

    expect(result.ok).toBe(true);
    expect(result.usecase).toBe("BenefitsAssistant");
    expect(result.sources).toBeGreaterThan(0);
    expect(result.scenarioGraph.nodes).toBeGreaterThan(0);
    expect(result.snowfakeryRealization.objects).toBeGreaterThan(0);
  });

  test("emits only Snowfakery references to objects declared by the scenario", () => {
    const result = runPlan("account-reconciliation-agent");
    const objects = recipeObjects(result.recipe);
    const references = recipeReferences(result.recipe);

    expect(result.ok).toBe(true);
    expect(objects.size).toBeGreaterThan(0);
    expect(objects.has("employees")).toBe(false);
    expect(references.every((reference) => objects.has(reference))).toBe(true);
  });

  test("does not auto-select a use case from weak token overlap", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-plan-mock-data-missing-"));
    try {
      const result = Bun.spawnSync(["node", SCRIPT, "--dir", dir, "--usecase", "not-a-real-benefits-thing", "--sourceMap", SOURCE_MAP]);
      const stderr = new TextDecoder().decode(result.stderr);
      expect(result.exitCode).toBe(1);
      expect(stderr).toContain("Use case not found in source map: not-a-real-benefits-thing");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("falls back to the workspace spec when a newer generated use case is not in the source map", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-plan-mock-data-spec-fallback-"));
    try {
      mkdirSync(join(dir, "mock_systems"), { recursive: true });
      writeFileSync(join(dir, "mock_systems/usecase-spec.json"), JSON.stringify({
        id: "account-opening-doc-followup-agent",
        title: "Account Opening Document Follow-Up Agent",
        department: "banking",
        systems: [
          {
            id: "temenos_transact",
            name: "Temenos Transact",
            owns: ["core_accounts", "account_transactions"],
            protocol: "REST API",
          },
          {
            id: "bigquery",
            name: "BigQuery",
            owns: ["analytics_events"],
            protocol: "BigQuery SQL",
          },
        ],
      }));

      const result = Bun.spawnSync(["node", SCRIPT, "--dir", dir, "--usecase", "account-opening-doc-followup-agent", "--sourceMap", SOURCE_MAP]);
      const stdout = new TextDecoder().decode(result.stdout);
      const stderr = new TextDecoder().decode(result.stderr);
      expect(stderr).toBe("");
      expect(result.exitCode).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed.ok).toBe(true);
      expect(parsed.usecase).toBe("account-opening-doc-followup-agent");
      expect(parsed.sources).toBe(2);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
