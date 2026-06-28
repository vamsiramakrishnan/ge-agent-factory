// spec-to-okf.test.mjs
//
// Verifies the OKF converter emits a conformant v0.1 Knowledge Bundle and that
// the bundle round-trips back to a partial spec. Run with: bun test.

import { test, expect } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildBundle, specToOkf } from "./spec-to-okf.mjs";
import { okfToSpec } from "./okf-to-spec.mjs";
import { parseConcept, renderConcept } from "@ge/okf";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = resolve(SCRIPT_DIR, "..", "generated", "use-cases.generated.json");

let _catalog;
async function loadCatalog() {
  if (!_catalog) _catalog = JSON.parse(await readFile(CATALOG_PATH, "utf8"));
  const list = Array.isArray(_catalog) ? _catalog : Object.values(_catalog);
  return list;
}

async function getSpec(id) {
  return (await loadCatalog()).find((entry) => entry && entry.id === id);
}

async function exists(path) {
  return stat(path)
    .then(() => true)
    .catch(() => false);
}

/** Materialize a bundle to a temp dir and return its path + concept index. */
async function materialize(id) {
  const dir = await mkdtemp(join(tmpdir(), "okf-"));
  const out = join(dir, id);
  await specToOkf({ id, out });
  return out;
}

test("account-reconciliation-agent → conformant OKF bundle (with workflow)", async () => {
  const out = await materialize("account-reconciliation-agent");

  // Root index.md carries okf_version "0.1".
  const root = parseConcept(await readFile(join(out, "index.md"), "utf8"));
  expect(root.frontmatter.okf_version).toBe("0.1");
  expect(root.frontmatter.type).toBe("Knowledge Bundle");

  // The four section kinds + a workflow stage all exist.
  expect(await exists(join(out, "systems", "sap-s-4hana-fi.md"))).toBe(true);
  expect(await exists(join(out, "tables", "gl-entries.md"))).toBe(true);
  expect(await exists(join(out, "tools", "query-sap-s-4hana-fi-gl-entries.md"))).toBe(true);
  expect(await exists(join(out, "workflow", "balance-document-pull.md"))).toBe(true);

  // Every non-root concept has a non-empty `type`, and no other file declares okf_version.
  for (const rel of [
    "systems/index.md",
    "systems/sap-s-4hana-fi.md",
    "tables/gl-entries.md",
    "tools/query-sap-s-4hana-fi-gl-entries.md",
    "workflow/balance-document-pull.md",
    "playbook.md",
    "kpis.md",
    "evals.md",
  ]) {
    const c = parseConcept(await readFile(join(out, rel), "utf8"));
    expect(typeof c.frontmatter.type).toBe("string");
    expect(c.frontmatter.type.length).toBeGreaterThan(0);
    expect(c.frontmatter.okf_version).toBeUndefined();
  }

  // Reserved per-directory index.md files exist (progressive disclosure).
  for (const dir of ["systems", "tables", "tools", "workflow"]) {
    expect(await exists(join(out, dir, "index.md"))).toBe(true);
  }

  await rm(dirname(out), { recursive: true, force: true });
});

test("links are bundle-absolute and workflow stages link to their tools", async () => {
  const out = await materialize("account-reconciliation-agent");

  const tool = await readFile(join(out, "tools", "query-sap-s-4hana-fi-gl-entries.md"), "utf8");
  // A tool concept links to its source system with a bundle-absolute path.
  expect(tool).toContain("(/systems/sap-s-4hana-fi.md)");

  const step = await readFile(join(out, "workflow", "balance-document-pull.md"), "utf8");
  // Workflow stage links to a tool it uses, bundle-absolute.
  expect(step).toContain("(/tools/query-sap-s-4hana-fi-gl-entries.md)");
  // Sequential mode emits a directed "Next:" edge.
  expect(step).toMatch(/Next:\s*\[.*\]\(\/workflow\//);

  // No relative links leak in (every concept link starts at the bundle root).
  const allLinks = [...tool.matchAll(/\]\(([^)]+\.md)\)/g)].map((m) => m[1]);
  for (const l of allLinks) expect(l.startsWith("/")).toBe(true);

  await rm(dirname(out), { recursive: true, force: true });
});

test("round-trip recovers tool names, systems, and workflow step order", async () => {
  const spec = await getSpec("account-reconciliation-agent");
  const out = await materialize("account-reconciliation-agent");
  const recovered = await okfToSpec(out);
  const bc = recovered.behaviorContract;

  // Tool intent names survive the round-trip (preserved in frontmatter title).
  const originalTools = (spec.generationSpec.behaviorContract.toolIntents || []).map((t) => t.name).sort();
  const recoveredTools = (bc.toolIntents || []).map((t) => t.name).sort();
  expect(recoveredTools).toEqual(originalTools);

  // Source systems recovered (slugged ids).
  const recoveredSystems = recovered.generationSpec.sourceSystems.map((s) => s.id);
  expect(recoveredSystems).toContain("sap-s-4hana-fi");
  expect(recoveredSystems.length).toBe((spec.generationSpec.sourceSystems || []).length);

  // Workflow step ORDER preserved.
  const originalOrder = spec.generationSpec.behaviorContract.workflow.steps.map((s) => s.id);
  const recoveredOrder = bc.workflow.steps.map((s) => s.id);
  expect(recoveredOrder.length).toBe(originalOrder.length);
  // Original (underscore) step ids are recovered losslessly via `source_id`.
  expect(recoveredOrder).toEqual(originalOrder);
  expect(recoveredOrder[0]).toBe("balance__document__pull");
  // First and last stage align with the original sequence.
  expect(recoveredOrder.at(-1)).toBe("workpaper__generation");

  // Per-step tools recovered (back to original tool names).
  const firstStepTools = bc.workflow.steps[0].tools;
  expect(firstStepTools).toContain("query_sap_s_4hana_fi_gl_entries");

  // Core behaviorContract scalars recovered.
  expect(bc.role).toBeTruthy();
  expect(bc.primaryObjective).toBeTruthy();
  expect((bc.inScope || []).length).toBeGreaterThan(0);
  expect((bc.outOfScope || []).length).toBeGreaterThan(0);

  await rm(dirname(out), { recursive: true, force: true });
});

test("capability spine: queries/, tests/, documents/ concepts emitted + round-trip", async () => {
  const out = await materialize("account-reconciliation-agent");

  // Concept directories exist with their reserved index.md.
  for (const dir of ["queries", "tests", "documents"]) {
    expect(await exists(join(out, dir, "index.md"))).toBe(true);
  }

  // A Query Capability links to its tools, its workflow stage, and cites docs.
  const query = await readFile(join(out, "queries", "balance-document-pull.md"), "utf8");
  const queryConcept = parseConcept(query);
  expect(queryConcept.frontmatter.type).toBe("Query Capability");
  expect(query).toContain("(/tools/query-sap-s-4hana-fi-gl-entries.md)");
  expect(query).toContain("(/workflow/balance-document-pull.md)");
  expect(query).toContain("# Citations");

  // An Eval Scenario names the mechanisms (tools) that MUST fire.
  const test = await readFile(join(out, "tests", "account-reconciliation-agent-end-to-end.md"), "utf8");
  const testConcept = parseConcept(test);
  expect(testConcept.frontmatter.type).toBe("Eval Scenario");
  expect(test).toContain("## Mechanisms to call");
  expect(test).toContain("(/tools/action-sap-s-4hana-fi-close.md)");
  expect(test).toContain("## Success rubric");
  expect(test).toContain("(/queries/balance-document-pull.md)"); // validates link

  // A Source Document concept exists for each generationSpec.documents entry.
  const doc = parseConcept(await readFile(join(out, "documents", "account-reconciliation-agent-controls-playbook.md"), "utf8"));
  expect(doc.frontmatter.type).toBe("Source Document");

  // okf -> spec recovers answerableQueries + per-eval mechanisms + documents.
  const recovered = await okfToSpec(out);
  const bc = recovered.behaviorContract;
  const balance = (bc.answerableQueries || []).find((q) => q.id === "balance-document-pull");
  expect(balance).toBeTruthy();
  expect(balance.tools).toContain("query_sap_s_4hana_fi_gl_entries");
  // The stage cross-ref resolves to the ORIGINAL (underscore) workflow step id,
  // so it matches a recovered workflow step.
  expect(balance.stage).toBe("balance__document__pull");
  expect(bc.workflow.steps.some((s) => s.id === balance.stage)).toBe(true);

  const recoveredEval = (bc.goldenEvals || []).find((e) => e.id === "account-reconciliation-agent-end-to-end");
  expect(recoveredEval).toBeTruthy();
  expect(recoveredEval.mechanisms).toContain("action_sap_s_4hana_fi_close");
  expect(recoveredEval.validates).toBe("balance-document-pull");

  const recoveredDocs = recovered.generationSpec.documents.map((d) => d.id);
  expect(recoveredDocs).toContain("account-reconciliation-agent-controls-playbook");

  await rm(dirname(out), { recursive: true, force: true });
});

test("explicit answerableQueries + eval mechanisms are preferred over derivation", async () => {
  const spec = {
    id: "explicit-spec",
    title: "Explicit Spec",
    generationSpec: {
      behaviorContract: {
        role: "tester",
        primaryObjective: "test explicit fields",
        inScope: ["answer payroll questions"],
        toolIntents: [{ name: "query_payroll", kind: "query", evidenceEmitted: ["payroll_record"] }],
        answerableQueries: [
          { id: "q-payroll", request: "What is an employee's net pay?", tools: ["query_payroll"] },
        ],
        goldenEvals: [
          { id: "e-payroll", prompt: "Compute net pay for E-100.", mechanisms: ["query_payroll"] },
        ],
      },
    },
  };
  const concepts = buildBundle(spec, { timestamp: "2026-01-01T00:00:00.000Z" });
  const q = concepts.find((c) => c.relPath === "queries/q-payroll");
  expect(q).toBeTruthy();
  expect(q.body).toContain("What is an employee's net pay?");
  expect(q.body).toContain("(/tools/query-payroll.md)");
  const t = concepts.find((c) => c.relPath === "tests/e-payroll");
  expect(t).toBeTruthy();
  expect(t.body).toContain("(/tools/query-payroll.md)");
});

test("single-agent spec (no workflow) emits no workflow/ directory", async () => {
  const out = await materialize("ad-hoc-query-agent");

  expect(await exists(join(out, "index.md"))).toBe(true);
  expect(await exists(join(out, "tools", "index.md"))).toBe(true);
  // No workflow concepts for an ad-hoc (non-orchestrated) agent.
  expect(await exists(join(out, "workflow"))).toBe(false);
  expect(await exists(join(out, "workflow", "index.md"))).toBe(false);

  // Root index does not advertise a workflow section.
  const root = await readFile(join(out, "index.md"), "utf8");
  expect(root).not.toContain("/workflow/index.md");

  await rm(dirname(out), { recursive: true, force: true });
});

test("frontmatter emit/parse round-trips scalars and lists", () => {
  const fields = { type: "Agent Tool", title: "x", tags: ["a", "b"], okf_version: "0.1" };
  const md = renderConcept(fields, "# Body\n\nhello");
  const parsed = parseConcept(md);
  expect(parsed.frontmatter.type).toBe("Agent Tool");
  expect(parsed.frontmatter.okf_version).toBe("0.1");
  expect(parsed.frontmatter.tags).toEqual(["a", "b"]);
  expect(parsed.body).toContain("hello");
});

test("buildBundle is pure and deterministic given a fixed timestamp", async () => {
  const spec = await getSpec("account-reconciliation-agent");
  const ts = "2026-01-01T00:00:00.000Z";
  const a = buildBundle(spec, { timestamp: ts });
  const b = buildBundle(spec, { timestamp: ts });
  expect(a.length).toBe(b.length);
  expect(a.map((c) => c.relPath)).toEqual(b.map((c) => c.relPath));
  // Root index is always present and first.
  expect(a.find((c) => c.relPath === "index")).toBeTruthy();
});

// --- BUG 1: slug collisions must not silently overwrite concept files --------
test("slug collisions are disambiguated; both tools get distinct files and links", () => {
  const spec = {
    id: "collision-spec",
    title: "Collision Spec",
    generationSpec: {
      behaviorContract: {
        role: "tester",
        primaryObjective: "exercise slug collisions",
        toolIntents: [
          { name: "notify_manager", kind: "action", description: "underscore variant" },
          { name: "notify-manager", kind: "action", description: "hyphen variant" },
        ],
        workflow: {
          mode: "sequential",
          steps: [
            { id: "step_one", label: "Step One", tools: ["notify_manager", "notify-manager"] },
          ],
        },
      },
    },
  };
  const ts = "2026-01-01T00:00:00.000Z";
  const concepts = buildBundle(spec, { timestamp: ts });

  // Two DISTINCT tool concept files exist (no overwrite).
  const toolPaths = concepts.filter((c) => c.relPath.startsWith("tools/") && c.relPath !== "tools/index").map((c) => c.relPath);
  expect(new Set(toolPaths).size).toBe(2);
  expect(toolPaths).toContain("tools/notify-manager");
  expect(toolPaths).toContain("tools/notify-manager-2");

  // The tools index links to BOTH disambiguated concepts.
  const toolsIndex = concepts.find((c) => c.relPath === "tools/index");
  expect(toolsIndex.body).toContain("(/tools/notify-manager.md)");
  expect(toolsIndex.body).toContain("(/tools/notify-manager-2.md)");

  // The workflow step links to BOTH tools (each resolved to its own file).
  const step = concepts.find((c) => c.relPath === "workflow/step-one");
  expect(step.body).toContain("(/tools/notify-manager.md)");
  expect(step.body).toContain("(/tools/notify-manager-2.md)");

  // Round-trip: both tool names recovered as distinct entries.
  const aTitles = concepts
    .filter((c) => toolPaths.includes(c.relPath))
    .map((c) => c.fields.title)
    .sort();
  expect(aTitles).toEqual(["notify-manager", "notify_manager"]);
});

// --- BUG 2: specToOkf must be byte-stable across runs ------------------------
test("specToOkf is byte-identical across runs of an unchanged spec", async () => {
  const dir1 = await mkdtemp(join(tmpdir(), "okf-stable-a-"));
  const dir2 = await mkdtemp(join(tmpdir(), "okf-stable-b-"));
  const out1 = join(dir1, "account-reconciliation-agent");
  const out2 = join(dir2, "account-reconciliation-agent");
  const a = await specToOkf({ id: "account-reconciliation-agent", out: out1 });
  const b = await specToOkf({ id: "account-reconciliation-agent", out: out2 });

  expect(a.files).toEqual(b.files);
  for (const rel of a.files) {
    const ca = await readFile(join(out1, rel), "utf8");
    const cb = await readFile(join(out2, rel), "utf8");
    expect(cb).toBe(ca);
  }

  await rm(dir1, { recursive: true, force: true });
  await rm(dir2, { recursive: true, force: true });
});

// --- BUG 3: original underscore ids survive spec→OKF→spec --------------------
test("underscore step/query/test ids are recovered losslessly through OKF", () => {
  const spec = {
    id: "underscore-spec",
    title: "Underscore Spec",
    generationSpec: {
      behaviorContract: {
        role: "tester",
        primaryObjective: "preserve original ids",
        inScope: ["answer balance questions"],
        toolIntents: [
          { name: "pull_balances", kind: "query", evidenceEmitted: ["balance_record"] },
        ],
        workflow: {
          mode: "sequential",
          steps: [
            { id: "balance__document__pull", label: "Balance Document Pull", tools: ["pull_balances"] },
            { id: "workpaper__generation", label: "Workpaper Generation", tools: ["pull_balances"] },
          ],
        },
        answerableQueries: [
          {
            id: "balance__document__pull",
            request: "Pull the balance documents",
            tools: ["pull_balances"],
            stage: "balance__document__pull",
          },
        ],
        goldenEvals: [
          {
            id: "e2e__check",
            prompt: "End to end check",
            mechanisms: ["pull_balances"],
            expectedToolCalls: ["pull_balances"],
            validates: "balance__document__pull",
          },
        ],
      },
    },
  };
  const ts = "2026-01-01T00:00:00.000Z";
  const concepts = buildBundle(spec, { timestamp: ts });

  // Render the concepts and round-trip via okfToSpec by writing to a temp dir.
  // (Use specToOkf path indirectly: build then parse via okf-to-spec helpers.)
  return (async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-ids-"));
    const out = join(dir, "underscore-spec");
    for (const c of concepts) {
      const abs = join(out, `${c.relPath}.md`);
      await mkdir(dirname(abs), { recursive: true });
      await writeFile(abs, renderConcept(c.fields, c.body), "utf8");
    }
    const recovered = await okfToSpec(out);
    const bc = recovered.behaviorContract;

    // Original underscore step ids recovered.
    const stepIds = bc.workflow.steps.map((s) => s.id);
    expect(stepIds).toContain("balance__document__pull");
    expect(stepIds).toContain("workpaper__generation");

    // Query stage cross-ref resolves to the original step id.
    const q = (bc.answerableQueries || []).find((x) => x.id === "balance__document__pull");
    expect(q).toBeTruthy();
    expect(q.stage).toBe("balance__document__pull");
    expect(stepIds).toContain(q.stage);

    // Test validates cross-ref resolves to the original query id.
    const t = (bc.goldenEvals || []).find((x) => x.id === "e2e__check");
    expect(t).toBeTruthy();
    expect(t.validates).toBe("balance__document__pull");
    expect(bc.answerableQueries.some((x) => x.id === t.validates)).toBe(true);

    await rm(dir, { recursive: true, force: true });
  })();
});
