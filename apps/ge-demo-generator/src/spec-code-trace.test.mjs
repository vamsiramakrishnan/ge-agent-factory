import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, expect } from "bun:test";
import { buildSpecCodeTrace, candidateIntentToolNames } from "./spec-code-trace.js";
import { WORKSPACE_PATHS, writeWorkspaceJson, writeWorkspaceText } from "./workspace-contract.js";

test("query intent trace prefers behavior-contract tool names over legacy shortened names", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "ge-spec-trace-"));
  try {
    await writeWorkspaceJson(workspace, WORKSPACE_PATHS.useCaseSpec, {
      id: "audit-report-generator",
      behaviorContract: {
        primaryObjective: "Generate audit reports with source-backed evidence.",
        role: "Audit report analyst",
        toolIntents: [
          {
            name: "query_auditboard_auditboard_records",
            kind: "query",
            sourceSystemId: "auditboard",
            requiredInputs: ["lookup_key", "date_range"],
            produces: ["auditboard_records_records"],
            evidence: ["source_system_record"],
          },
          {
            name: "query_finance_3_finance_3_records",
            kind: "query",
            sourceSystemId: "finance_3",
            requiredInputs: ["lookup_key", "date_range"],
            produces: ["finance_3_records_records"],
            evidence: ["source_system_record"],
          },
        ],
      },
    });
    await writeWorkspaceJson(workspace, WORKSPACE_PATHS.fixtureManifest, {
      tables: [
        { name: "auditboard_records", sourceSystemId: "auditboard" },
        { name: "finance_3_records", sourceSystemId: "finance_3" },
      ],
    });
    await writeWorkspaceText(workspace, WORKSPACE_PATHS.agent, `
PRIMARY OBJECTIVE
TOOL PLAYBOOK
EVIDENCE YOU MUST CITE
ESCALATION & REFUSAL TRIGGERS
HARD GUARDRAILS
query_auditboard_auditboard_records
query_finance_3_finance_3_records
async def enforce_tool_contract(tool=None, args: dict = None, tool_context=None, **kwargs): pass
async def capture_tool_evidence(tool=None, args: dict = None, tool_context=None, tool_response=None, **kwargs): pass
root_agent = Agent(before_tool_callback=enforce_tool_contract, after_tool_callback=capture_tool_evidence)
`);
    await writeWorkspaceText(workspace, WORKSPACE_PATHS.tools, `
from google.adk.tools import FunctionTool
def query_auditboard_auditboard_records(lookup_key: str = "", date_range: str = ""):
    return {"produces": ["auditboard_records_records"], "evidence": ["source_system_record"]}
def query_finance_3_finance_3_records(lookup_key: str = "", date_range: str = ""):
    return {"produces": ["finance_3_records_records"], "evidence": ["source_system_record"]}
source_adapters = [
    FunctionTool(func=query_auditboard_auditboard_records),
    FunctionTool(func=query_finance_3_finance_3_records),
]
`);
    await writeWorkspaceText(workspace, WORKSPACE_PATHS.smokeTest, `
from app.tools import query_auditboard_auditboard_records, query_finance_3_finance_3_records
`);
    await writeWorkspaceJson(workspace, WORKSPACE_PATHS.goldenEvals, {
      evals: [{
        id: "audit",
        expectedToolCalls: ["query_auditboard_auditboard_records", "query_finance_3_finance_3_records"],
      }],
    });
    await writeWorkspaceJson(workspace, WORKSPACE_PATHS.behaviorEvalset, { eval_cases: [{ name: "audit" }] });

    const trace = await buildSpecCodeTrace(workspace);
    expect(trace.ok).toBe(true);
    expect(trace.coverage.requiredIntentCoverage).toBe(1);
    expect(trace.intents.map((intent) => intent.canonicalToolName)).toEqual([
      "query_auditboard_auditboard_records",
      "query_finance_3_finance_3_records",
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("query intent candidates retain legacy shortened generated names as fallback", () => {
  const candidates = candidateIntentToolNames(
    { name: "query_auditboard_auditboard_records", kind: "query", sourceSystemId: "auditboard" },
    [{ name: "auditboard_records", sourceSystemId: "auditboard" }],
  );
  expect(candidates).toEqual(["query_auditboard_auditboard_records", "query_auditboard_records"]);
});
