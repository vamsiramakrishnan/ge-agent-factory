// Contract tests for spec-to-skill.mjs — the spec → Agent Skill package
// converter. Mirrors spec-to-okf.test.mjs's shape: pure builder assertions
// (determinism, portability rules) against a representative in-memory spec.
import { describe, expect, test } from "bun:test";
import { buildSkillFiles, skillDescription, skillName } from "./spec-to-skill.mjs";

const SPEC = {
  id: "ap-aging-analyzer",
  title: "AP Aging Analyzer",
  subtitle: "Keeps payables aging honest",
  department: "finance",
  generationSpec: {
    version: 1,
    sourceSystems: [
      { id: "netsuite", name: "NetSuite", protocol: "rest", owns: ["invoices"], toolNames: ["query_netsuite_invoices"] },
    ],
    entities: [
      { name: "invoices", primaryKey: "invoice_id", columns: [{ name: "invoice_id", type: "string", required: true }, { name: "amount", type: "number" }] },
    ],
    behaviorContract: {
      role: "AP analyst agent",
      primaryObjective: "Report accounts-payable aging with cited evidence",
      inScope: ["Aging bucket summaries", "Overdue invoice drill-downs"],
      outOfScope: ["Payment execution"],
      toolIntents: [
        { name: "query_netsuite_invoices", kind: "query", sourceSystemId: "netsuite", requiredInputs: ["as_of_date"], produces: ["invoices_records"], evidenceEmitted: ["invoice_id"] },
      ],
      evidenceRequirements: [{ claim: "Aging totals match the ledger", mustCite: ["invoice_id"] }],
      escalationRules: [{ trigger: "totals disagree with the ledger", action: "escalate to controller", rationale: "data integrity" }],
      refusalRules: ["Never fabricate invoice amounts."],
      goldenEvals: [
        { id: "aging-summary", prompt: "Summarize AP aging as of today", expectedToolCalls: ["query_netsuite_invoices"], mustReferenceEntities: ["invoices"] },
      ],
      workflow: { mode: "sequential", steps: [{ id: "gather", label: "Gather", tools: ["query_netsuite_invoices"] }] },
    },
  },
};

describe("spec-to-skill", () => {
  test("emits the full progressive-disclosure package deterministically", () => {
    const files = buildSkillFiles(SPEC);
    const paths = files.map((f) => f.relPath).sort();
    expect(paths).toEqual([
      "SKILL.md",
      "assets/agent-spec.json",
      "assets/golden-evals.json",
      "references/behavior-contract.md",
      "references/data-and-systems.md",
      "references/example-session.md",
      "scripts/adk_toolset.py",
      "scripts/check-coverage.mjs",
    ]);
    // Byte-determinism: same spec in, same bytes out.
    const again = buildSkillFiles(SPEC);
    for (let i = 0; i < files.length; i += 1) expect(again[i].content).toBe(files[i].content);
  });

  test("SKILL.md frontmatter follows the portability rules and links every reference", () => {
    const files = buildSkillFiles(SPEC);
    const skillMd = files.find((f) => f.relPath === "SKILL.md").content;
    expect(skillMd.startsWith("---\n")).toBe(true);
    expect(skillMd).toContain(`name: ${skillName(SPEC)}`);
    expect(skillName(SPEC)).toBe("ap-aging-analyzer");
    expect(skillName(SPEC).length).toBeLessThanOrEqual(64);
    const description = skillDescription(SPEC);
    expect(description).toContain("Use when");
    expect(description.length).toBeLessThanOrEqual(1024);
    for (const ref of files.filter((f) => f.relPath.startsWith("references/"))) {
      expect(skillMd).toContain(`](${ref.relPath})`);
    }
    expect(skillMd).toContain("scripts/check-coverage.mjs");
    expect(skillMd).toContain("assets/agent-spec.json");
  });

  test("contract content lands in the right layers", () => {
    const files = buildSkillFiles(SPEC);
    const byPath = new Map(files.map((f) => [f.relPath, f.content]));
    expect(byPath.get("references/behavior-contract.md")).toContain("query_netsuite_invoices");
    expect(byPath.get("references/behavior-contract.md")).toContain("Aging totals match the ledger");
    expect(byPath.get("references/data-and-systems.md")).toContain("invoice_id");
    expect(byPath.get("references/example-session.md")).toContain("Summarize AP aging as of today");
    // The canonical spec asset round-trips.
    const parsed = JSON.parse(byPath.get("assets/agent-spec.json"));
    expect(parsed.id).toBe("ap-aging-analyzer");
    expect(parsed.generationSpec.behaviorContract.toolIntents).toHaveLength(1);
    const evals = JSON.parse(byPath.get("assets/golden-evals.json"));
    expect(evals[0].expectedToolCalls).toEqual(["query_netsuite_invoices"]);
  });
});
