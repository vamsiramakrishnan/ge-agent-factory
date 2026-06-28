import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { __test } from "./harness-runner.js";

const { buildSubagentPlanSection } = __test;
const made = [];

function workspaceWith(sidecars) {
  const dir = mkdtempSync(join(tmpdir(), "ge-subplan-"));
  made.push(dir);
  mkdirSync(join(dir, "artifacts"), { recursive: true });
  for (const name of sidecars) writeFileSync(join(dir, "artifacts", name), "{}");
  return dir;
}

afterEach(() => {
  delete process.env.GE_HARNESS_NO_SUBAGENT_FANOUT;
  while (made.length) rmSync(made.pop(), { recursive: true, force: true });
});

describe("buildSubagentPlanSection", () => {
  test("returns null when subagents are unavailable (e.g. review run)", () => {
    const dir = workspaceWith(["agent-workflow.json", "okf-coverage.json"]);
    expect(buildSubagentPlanSection(dir, { subagentsAvailable: false })).toBeNull();
  });

  test("returns null when no validation sidecar exists", () => {
    const dir = workspaceWith([]);
    expect(buildSubagentPlanSection(dir, { subagentsAvailable: true })).toBeNull();
  });

  test("emits a dimension per present sidecar when available", () => {
    const dir = workspaceWith(["agent-workflow.json", "okf-coverage.json"]);
    const section = buildSubagentPlanSection(dir, { subagentsAvailable: true });
    expect(section).toContain("# Subagent validation plan");
    expect(section).toContain('"topology"');
    expect(section).toContain('"okf_query_coverage"');
    expect(section).toContain('"eval_mechanisms"');
    expect(section).toContain("Spawn at most 3 subagents");
  });

  test("only includes the topology dimension when only the workflow sidecar exists", () => {
    const dir = workspaceWith(["agent-workflow.json"]);
    const section = buildSubagentPlanSection(dir, { subagentsAvailable: true });
    expect(section).toContain('"topology"');
    expect(section).not.toContain('"okf_query_coverage"');
    expect(section).toContain("Spawn at most 1 subagents");
  });

  test("honours the GE_HARNESS_NO_SUBAGENT_FANOUT opt-out", () => {
    process.env.GE_HARNESS_NO_SUBAGENT_FANOUT = "1";
    const dir = workspaceWith(["agent-workflow.json", "okf-coverage.json"]);
    expect(buildSubagentPlanSection(dir, { subagentsAvailable: true })).toBeNull();
  });
});
