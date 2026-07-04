import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildRecipe, checkFkClosure } from "./recipe.mjs";
import {
  REALISM_PROFILES,
  buildPersonaPool,
  personaSlug,
  generateRealistic,
} from "./realism.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// Test-fixture DATA only (not an import): the servicenow pack is the
// representative contract corpus, owned by apps/factory. Resolved via the
// repo root so the path reads unambiguously from the package.
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const SERVICENOW = join(REPO_ROOT, "apps", "factory", "simulator-systems", "servicenow");

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

function generate(seed = 42, options = {}) {
  const contract = loadContract(SERVICENOW);
  const recipe = buildRecipe(contract, { seed });
  return { contract, recipe, ...generateRealistic(recipe, contract, { seed, ...options }) };
}

function totalRows(data) {
  return Object.values(data).reduce((sum, rows) => sum + rows.length, 0);
}

describe("realism: contract", () => {
  test("REALISM_PROFILES exposes the realistic profile", () => {
    expect(REALISM_PROFILES.realistic).toBeDefined();
    expect(typeof REALISM_PROFILES.realistic.description).toBe("string");
  });

  test("unknown profile throws", () => {
    const contract = loadContract(SERVICENOW);
    const recipe = buildRecipe(contract, { seed: 1 });
    expect(() => generateRealistic(recipe, contract, { seed: 1, profile: "cinematic" })).toThrow(/Unknown realism profile/);
  });

  test("byte-determinism: same seed produces deep-equal data and report", () => {
    const a = generate(123);
    const b = generate(123);
    expect(JSON.stringify(a.data)).toBe(JSON.stringify(b.data));
    expect(JSON.stringify(a.report)).toBe(JSON.stringify(b.report));
    const c = generate(124);
    expect(JSON.stringify(a.data)).not.toBe(JSON.stringify(c.data));
  });

  test("FK closure holds after realistic post-processing", () => {
    const { recipe, data } = generate(42);
    const fk = checkFkClosure(recipe, data);
    expect(fk.violations).toEqual([]);
    expect(fk.ok).toBe(true);
  });

  test("same shape as generateWithFaker: every schema collection with count > 0 has rows", () => {
    const { contract, recipe, data } = generate(7);
    for (const name of recipe.order) {
      if (!recipe.collections[name].count) continue;
      expect(Array.isArray(data[name])).toBe(true);
      expect(data[name].length).toBeGreaterThan(0);
      const pk = contract.schema.collections[name].primaryKey;
      for (const row of data[name]) expect(row[pk]).toBeDefined();
    }
  });
});

describe("realism: temporal coherence", () => {
  test("lifecycle dates are causally ordered per row (opened <= resolved)", () => {
    const { data } = generate(42);
    for (const row of data.incidents) {
      const opened = Date.parse(row.opened_at);
      const resolved = Date.parse(row.resolved_at);
      expect(Number.isFinite(opened)).toBe(true);
      expect(Number.isFinite(resolved)).toBe(true);
      expect(opened).toBeLessThanOrEqual(resolved);
    }
  });

  test("lifecycle fields are reported as eventSequence distributions", () => {
    const { report } = generate(42);
    expect(report.distributions["incidents.opened_at"]).toBe("eventSequence");
    expect(report.distributions["incidents.resolved_at"]).toBe("eventSequence");
  });
});

describe("realism: persona coherence", () => {
  test("persona pool is deterministic per seed, sized 24, emails derived from names", () => {
    const pool = buildPersonaPool(42);
    expect(pool.length).toBe(24);
    expect(JSON.stringify(pool)).toBe(JSON.stringify(buildPersonaPool(42)));
    // A different seed yields a different pool (faker-backed, seed-derived).
    expect(JSON.stringify(pool)).not.toBe(JSON.stringify(buildPersonaPool(43)));
    // Full names are unique so name -> email lookups are unambiguous.
    expect(new Set(pool.map((p) => p.name)).size).toBe(24);
    for (const p of pool) {
      expect(p.email).toBe(`${personaSlug(p.first)}.${personaSlug(p.last)}@example.com`);
      expect(personaSlug(p.first).length).toBeGreaterThan(0);
      expect(personaSlug(p.last).length).toBeGreaterThan(0);
    }
  });

  test("person fields draw from the shared pool across collections", () => {
    const { data, report } = generate(42);
    // The pool is derived from the same seed the generator ran with.
    const names = new Set(buildPersonaPool(42).map((p) => p.name));
    const edgeIds = new Set(report.edgeCases.map((e) => `${e.collection}:${e.id}`));
    const checks = [
      ["incidents", "incident_id", "assigned_to"],
      ["incidents", "incident_id", "caller"],
      ["problems", "problem_id", "assigned_to"],
      ["assignment_groups", "group_id", "manager"],
      ["configuration_items", "ci_id", "owned_by"],
    ];
    let verified = 0;
    for (const [collection, pk, field] of checks) {
      for (const row of data[collection]) {
        if (edgeIds.has(`${collection}:${row[pk]}`)) continue;
        expect(names.has(row[field])).toBe(true);
        verified += 1;
      }
    }
    expect(verified).toBeGreaterThan(20);
  });

  test("emails match the row's primary persona name", () => {
    const { data, report } = generate(42);
    const pool = buildPersonaPool(42);
    const byName = new Map(pool.map((p) => [p.name, p.email]));
    const edgeIds = new Set(report.edgeCases.filter((e) => e.collection === "assignment_groups").map((e) => e.id));
    let verified = 0;
    // assignment_groups declares both a person field (manager, first declared) and an email.
    for (const row of data.assignment_groups) {
      if (edgeIds.has(String(row.group_id))) continue;
      expect(byName.get(row.manager)).toBe(row.email);
      verified += 1;
    }
    expect(verified).toBeGreaterThan(0);
  });
});

describe("realism: distributions", () => {
  test("money fields are logNormal with 2-decimal rounding and positive values", () => {
    const { data, report } = generate(42);
    expect(report.distributions["service_requests.price"]).toBe("logNormal");
    for (const row of data.service_requests) {
      expect(row.price).toBeGreaterThan(0);
      expect(Math.round(row.price * 100) / 100).toBe(row.price);
    }
  });

  test("count-like numbers are poisson-distributed non-negative integers", () => {
    const { data, report } = generate(42);
    expect(report.distributions["incidents.reassignment_count"]).toBe("poisson");
    expect(report.distributions["knowledge_articles.view_count"]).toBe("poisson");
    for (const row of data.incidents) {
      expect(Number.isInteger(row.reassignment_count)).toBe(true);
      expect(row.reassignment_count).toBeGreaterThanOrEqual(0);
    }
  });

  test("workflow-governed state enums weight source states above terminal ones", () => {
    const { data, report } = generate(42);
    expect(report.distributions["incidents.state"]).toBe("zipfWorkflowStates");
    const count = (rows, state) => rows.filter((r) => r.state === state).length;
    // "new" is the machine's first source state; "closed" is terminal.
    expect(count(data.incidents, "new")).toBeGreaterThanOrEqual(count(data.incidents, "closed"));
    expect(count(data.change_requests, "draft")).toBeGreaterThanOrEqual(count(data.change_requests, "closed"));
  });
});

describe("realism: edge cases", () => {
  test("edge cases are injected at roughly the configured rate and reported", () => {
    const { data, report } = generate(42, { edgeCaseRate: 0.1 });
    const rows = totalRows(data);
    const expected = rows * 0.1;
    expect(report.edgeCases.length).toBeGreaterThanOrEqual(1);
    expect(report.edgeCases.length).toBeLessThanOrEqual(Math.ceil(expected * 3));
    const kinds = new Set(report.edgeCases.map((e) => e.kind));
    const known = new Set(["unicode_name", "max_length_string", "boundary_amount", "same_day_lifecycle", "near_duplicate_name"]);
    for (const kind of kinds) expect(known.has(kind)).toBe(true);
  });

  test("edge rows stay schema-valid and resolvable by id", () => {
    const { contract, data, report } = generate(42, { edgeCaseRate: 0.15 });
    expect(report.edgeCases.length).toBeGreaterThan(0);
    for (const edge of report.edgeCases) {
      const pk = contract.schema.collections[edge.collection].primaryKey;
      const row = data[edge.collection].find((r) => String(r[pk]) === edge.id);
      expect(row).toBeDefined();
    }
  });

  test("edgeCaseRate 0 injects nothing", () => {
    const { report } = generate(42, { edgeCaseRate: 0 });
    expect(report.edgeCases).toEqual([]);
  });

  test("report shape: personas count + distribution map", () => {
    const { report } = generate(42);
    expect(report.personas).toBe(24);
    expect(Object.keys(report.distributions).length).toBeGreaterThan(10);
  });
});
