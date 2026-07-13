import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import okfSpecs from "../src/data/agent-okf.json" with { type: "json" };
import { createFragmentIndex } from "../src/lib/catalog-fragments.mjs";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = (path) => readFileSync(join(APP, path), "utf8");

test("catalog fragment indexes preserve stable IDs and reject missing targets", () => {
  const index = createFragmentIndex(
    [{ name: "query_records" }, { name: "Policy guide.v2" }],
    { prefix: "tool", name: (item) => item.name },
  );

  expect(index.entries.map(({ id }) => id)).toEqual([
    "tool-query_records",
    "tool-policy-guide-v2",
  ]);
  expect(index.resolve("query_records")).toBe("tool-query_records");
  expect(index.resolve("POLICY-GUIDE V2")).toBe("tool-policy-guide-v2");
  expect(index.resolve("not_rendered")).toBeNull();
});

test("catalog fragment indexes keep colliding exact names unique and fuzzy matches honest", () => {
  const index = createFragmentIndex(["foo.bar", "foo-bar"], { prefix: "entity" });

  expect(index.entries.map(({ id }) => id)).toEqual([
    "entity-foo-bar",
    "entity-foo-bar-2",
  ]);
  expect(index.resolve("foo.bar")).toBe("entity-foo-bar");
  expect(index.resolve("foo-bar")).toBe("entity-foo-bar-2");
  expect(index.resolve("FOO BAR")).toBeNull();
});

test("every generated OKF fragment resolution points at a rendered target", () => {
  let resolved = 0;
  let unresolved = 0;
  const invalid = [];

  for (const spec of Object.values(okfSpecs)) {
    const tools = createFragmentIndex(spec.tools ?? [], { prefix: "tool", name: (item) => item.name });
    const entities = createFragmentIndex(spec.entities ?? [], { prefix: "entity", name: (item) => item.name });
    const toolTargets = new Set(tools.entries.map(({ id }) => id));
    const entityTargets = new Set(entities.entries.map(({ id }) => id));
    const toolRefs = [
      ...(spec.workflow?.steps ?? []).flatMap((step) => step.tools ?? []),
      ...(spec.systems ?? []).flatMap((system) => system.toolNames ?? []),
    ];
    const entityRefs = [
      ...(spec.systems ?? []).flatMap((system) => system.owns ?? []),
      ...(spec.anomalies ?? []).flatMap((anomaly) => anomaly.affectedEntities ?? []),
    ];

    for (const ref of toolRefs) {
      const target = tools.resolve(ref);
      if (target) {
        if (!toolTargets.has(target)) invalid.push(target);
        resolved += 1;
      } else unresolved += 1;
    }
    for (const ref of entityRefs) {
      const target = entities.resolve(ref);
      if (target) {
        if (!entityTargets.has(target)) invalid.push(target);
        resolved += 1;
      } else unresolved += 1;
    }
  }

  // Both paths are real catalog conditions: some references deep-link to an
  // inventory card, while references outside the projection remain text.
  expect(invalid).toEqual([]);
  expect(resolved).toBeGreaterThan(0);
  expect(unresolved).toBeGreaterThan(0);
});

test("catalog components retain their keyboard, mobile, and live-region contracts", () => {
  const periodic = source("src/components/PeriodicTable.astro");
  const vertical = source("src/components/VerticalPeriodicTable.astro");
  const explorer = source("src/pages/catalog/explorer.astro");
  const okf = source("src/components/OkfSpec.astro");

  expect(periodic).toContain('role="tabpanel"');
  expect(periodic).toContain("aria-controls={panelId(dept.key)}");
  expect(periodic).toContain('event.key === "ArrowRight"');
  expect(periodic).toContain('event.key === "Home"');
  expect(periodic).toContain('<div class="pt-group" id={domain.id}>');
  expect(periodic).toContain("@media (max-width: 59.999rem)");
  expect(periodic).toContain("grid-template-columns: minmax(0, 1fr)");
  expect(periodic).toContain("min-height: 2.75rem");
  expect(vertical).toContain('tabLabel: "Industries"');

  expect(explorer).toContain('<label class="cx-label" for="cx-search">');
  expect(explorer).toContain('<fieldset class="cx-facet-group">');
  expect(explorer).toContain('aria-pressed="false"');
  expect(explorer).toContain('role="status" aria-live="polite"');
  expect(explorer).toContain('chip.setAttribute("aria-pressed"');
  expect(explorer).toContain('id="cx-more"');
  expect(explorer).toContain("const batchSize = 48");
  expect(explorer).toContain("Showing ${shown} of ${matches.length} matching agents");

  expect(okf).not.toMatch(/href=\{`#(?:tool|entity)-\$\{/);
  expect(okf).toContain("toolFragments.resolve(name)");
  expect(okf).toContain("entityFragments.resolve(name)");
});
