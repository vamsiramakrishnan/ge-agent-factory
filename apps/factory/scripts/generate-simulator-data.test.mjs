import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRecipe,
  generateWithFaker,
  scenarioCoverageRows,
  applyMaterialization,
  mergeByKey,
  checkFkClosure,
} from "@ge/synthkit/recipe";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const CLI = join(SCRIPT_DIR, "generate-simulator-data.mjs");
const SERVICENOW = resolve(SCRIPT_DIR, "../simulator-systems/servicenow");

function loadContract(packDir) {
  const read = (name) => JSON.parse(readFileSync(join(packDir, name), "utf8"));
  return {
    id: "servicenow",
    schema: read("schema.json"),
    projection: read("projection.json"),
    materialization: read("materialization.json"),
    workflows: read("workflows.json"),
  };
}

// Mirror the CLI's assembly (recipe -> faker -> materialize -> coverage merge) so the
// library is exercised end-to-end without depending on subprocess output formatting.
function assemble(contract, seed) {
  const recipe = buildRecipe(contract, { seed });
  const rows = generateWithFaker(recipe, { seed });
  const data = {};
  for (const name of recipe.order) {
    data[name] = applyMaterialization(rows[name], contract.materialization, name, name);
  }
  for (const [collection, covRows] of Object.entries(scenarioCoverageRows(contract))) {
    const key = recipe.collections[collection]?.primaryKey
      || contract.schema.collections[collection]?.primaryKey
      || "id";
    const norm = applyMaterialization(covRows, contract.materialization, collection, collection);
    data[collection] = mergeByKey(data[collection] || [], norm, key);
  }
  if (!Array.isArray(data.audit_events)) data.audit_events = [];
  return { recipe, data };
}

describe("generate-simulator-data: determinism", () => {
  test("same seed produces identical bytes (CLI, --stdout)", () => {
    const run = () => {
      const result = Bun.spawnSync(
        ["node", CLI, "--pack", SERVICENOW, "--seed", "123", "--no-snowfakery", "--stdout"],
        { cwd: REPO_ROOT },
      );
      expect(result.exitCode).toBe(0);
      return new TextDecoder().decode(result.stdout);
    };
    const a = run();
    const b = run();
    expect(a).toBe(b);
    // sanity: it is real JSON with collections
    const parsed = JSON.parse(a);
    expect(Object.keys(parsed).length).toBeGreaterThan(0);
  });

  test("library generation is deterministic for a fixed seed", () => {
    const contract = loadContract(SERVICENOW);
    const a = assemble(contract, 99).data;
    const b = assemble(contract, 99).data;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test("different seeds produce different data", () => {
    const contract = loadContract(SERVICENOW);
    const a = assemble(contract, 1).data;
    const b = assemble(contract, 2).data;
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });
});

describe("generate-simulator-data: FK closure", () => {
  test("every FK value resolves to a real PK in the referenced collection", () => {
    const contract = loadContract(SERVICENOW);
    const { recipe, data } = assemble(contract, 42);
    const fk = checkFkClosure(recipe, data);
    expect(fk.violations).toEqual([]);
    expect(fk.ok).toBe(true);
  });

  test("CLI reports fkClosureOk and exits 0", () => {
    const out = mkdtempSync(join(tmpdir(), "ge-gen-sim-"));
    try {
      const result = Bun.spawnSync(
        ["node", CLI, "--pack", SERVICENOW, "--seed", "42", "--no-snowfakery", "--out", join(out, "seed.json")],
        { cwd: REPO_ROOT },
      );
      const stdout = new TextDecoder().decode(result.stdout);
      expect(result.exitCode).toBe(0);
      const summary = JSON.parse(stdout);
      expect(summary.tier).toBe("faker");
      expect(summary.fkClosureOk).toBe(true);
      expect(summary.fkViolations).toBe(0);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});

describe("generate-simulator-data: non-empty collections", () => {
  test("every non-audit collection has at least one row", () => {
    const contract = loadContract(SERVICENOW);
    const { data } = assemble(contract, 7);
    for (const [name, spec] of Object.entries(contract.schema.collections)) {
      if (name === "audit_events") continue;
      expect((data[name] || []).length).toBeGreaterThan(0);
      // PK is present on each row.
      for (const row of data[name]) {
        expect(row[spec.primaryKey]).toBeDefined();
        expect(String(row[spec.primaryKey])).not.toBe("");
      }
    }
  });
});

describe("generate-simulator-data: --profile", () => {
  test("default run and explicit --profile baseline are byte-identical", () => {
    const run = (extraArgs) => {
      const result = Bun.spawnSync(
        ["node", CLI, "--pack", SERVICENOW, "--seed", "123", "--no-snowfakery", "--stdout", ...extraArgs],
        { cwd: REPO_ROOT },
      );
      expect(result.exitCode).toBe(0);
      return new TextDecoder().decode(result.stdout);
    };
    expect(run([])).toBe(run(["--profile", "baseline"]));
  });

  test("--profile realistic produces a valid, FK-closed seed and report highlights", () => {
    const out = mkdtempSync(join(tmpdir(), "ge-gen-sim-realistic-"));
    try {
      const result = Bun.spawnSync(
        ["node", CLI, "--pack", SERVICENOW, "--seed", "42", "--profile", "realistic", "--out", join(out, "seed.json")],
        { cwd: REPO_ROOT },
      );
      expect(result.exitCode).toBe(0);
      const summary = JSON.parse(new TextDecoder().decode(result.stdout));
      expect(summary.tier).toBe("realistic");
      expect(summary.profile).toBe("realistic");
      expect(summary.fkClosureOk).toBe(true);
      expect(summary.fkViolations).toBe(0);
      expect(summary.personas).toBe(24);
      expect(summary.distributionFields).toBeGreaterThan(10);
      expect(summary.edgeCases).toBeGreaterThanOrEqual(0);
      const seed = JSON.parse(readFileSync(join(out, "seed.json"), "utf8"));
      expect(Array.isArray(seed.incidents)).toBe(true);
      expect(seed.incidents.length).toBeGreaterThan(0);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  test("unknown --profile exits with usage error", () => {
    const result = Bun.spawnSync(
      ["node", CLI, "--pack", SERVICENOW, "--profile", "cinematic", "--stdout"],
      { cwd: REPO_ROOT },
    );
    expect(result.exitCode).toBe(2);
    expect(new TextDecoder().decode(result.stderr)).toContain("Unknown --profile");
  });

  test("--profile realistic is byte-deterministic across runs", () => {
    const run = () => {
      const result = Bun.spawnSync(
        ["node", CLI, "--pack", SERVICENOW, "--seed", "9", "--profile", "realistic", "--stdout"],
        { cwd: REPO_ROOT },
      );
      expect(result.exitCode).toBe(0);
      return new TextDecoder().decode(result.stdout);
    };
    expect(run()).toBe(run());
  });
});

describe("generate-simulator-data: scenario coverage", () => {
  test("a pending-approval row exists for a system with an approvalBlocker", () => {
    const contract = loadContract(SERVICENOW);
    const { data } = assemble(contract, 42);
    // workflows declare approvalBlockers on change_requests and service_requests,
    // each gated by a pending approval in the approvals collection.
    const pending = (data.approvals || []).filter((row) => row.state === "requested");
    expect(pending.length).toBeGreaterThan(0);

    // The coverage approval points at a real record that is in a blockable source state.
    const coverageApprovals = pending.filter((row) => String(row.approval_id).startsWith("COV-"));
    expect(coverageApprovals.length).toBeGreaterThan(0);
    for (const approval of coverageApprovals) {
      const blocked = [...(data.change_requests || []), ...(data.service_requests || [])]
        .find((r) => r.change_id === approval.source_record_id || r.request_id === approval.source_record_id);
      expect(blocked).toBeDefined();
    }
  });

  test("a row exists in the source state of each declared transition", () => {
    const contract = loadContract(SERVICENOW);
    const { data } = assemble(contract, 42);
    const handlers = contract.workflows.toolHandlers;
    for (const workflow of Object.values(handlers)) {
      const collection = workflow.collection;
      const stateField = workflow.stateField || "state";
      const rows = data[collection] || [];
      const presentStates = new Set(rows.map((r) => r[stateField]));
      for (const [sourceState, targets] of Object.entries(workflow.transitions || {})) {
        if (!Array.isArray(targets) || targets.length === 0) continue;
        expect(presentStates.has(sourceState)).toBe(true);
      }
    }
  });

  test("a row is tagged for each declared failure mode", () => {
    const contract = loadContract(SERVICENOW);
    const { data } = assemble(contract, 42);
    for (const [tool, workflow] of Object.entries(contract.workflows.toolHandlers)) {
      const rows = data[workflow.collection] || [];
      for (const failureKey of Object.keys(workflow.failureModes || {})) {
        const tagged = rows.find((r) => String(r[workflow.primaryKey || "id"] || "")
          .startsWith(`COV-${tool.toUpperCase()}-FAIL-${failureKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`));
        expect(tagged).toBeDefined();
      }
    }
  });
});
