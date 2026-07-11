import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { __test } from "./factory.mjs";
import { buildWorkflowFromPipeline } from "./factory/agent-workflow.mjs";
import { ensureContractQueryTables } from "./factory/core/contract-schema.mjs";

const { deriveAgentWorkflow, canonicalIntentToolName } = __test;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const GE_MOCK = join(SCRIPT_DIR, "factory.mjs");
// factory resolves its use-case catalog relative to cwd; run subprocesses from the
// app root so `bun test` (which runs from the repo root) finds src/use-cases.js.
const APP_DIR = resolve(SCRIPT_DIR, "..");

// ── deriveAgentWorkflow ──────────────────────────────────────

describe("deriveAgentWorkflow", () => {
  // A manifest whose tables resolve the query intents to canonical tool names,
  // mirroring what the generator emits in tools.py.
  const tables = [
    { name: "gl_entries", sourceSystemId: "sap" },
    { name: "reconciliations", sourceSystemId: "blackline" },
    { name: "controls", sourceSystemId: "bigquery" },
  ];
  const toolIntents = [
    { name: "query_sap_gl_entries", kind: "query", sourceSystemId: "sap" },
    { name: "query_blackline_reconciliations", kind: "query", sourceSystemId: "blackline" },
    { name: "action_sap_post", kind: "action", sourceSystemId: "sap" },
  ];

  test("3-stage pipeline with matching tool intents → sequential with 3 tool-bearing steps", () => {
    const pipeline = [
      { label: "Pull SAP GL entries", description: "Pull gl entries from sap to seed the workflow." },
      { label: "Match BlackLine reconciliations", description: "Match against blackline reconciliations records." },
      { label: "Post to SAP", description: "Post the close action to sap after evidence is gathered." },
    ];
    const behaviorContract = { role: "Controller", refusalRules: ["Never fabricate values."], toolIntents };
    const wf = deriveAgentWorkflow({
      behaviorContract,
      architecture: { pipeline },
      manifest: { id: "recon_agent", tables, useCaseSpec: { behaviorContract } },
    });

    expect(wf.topology).toBe("sequential");
    expect(wf.steps.length).toBe(3);
    // Each step carries the right canonical tool names.
    expect(wf.steps[0].toolNames).toContain("query_sap_gl_entries");
    expect(wf.steps[1].toolNames).toContain("query_blackline_reconciliations");
    expect(wf.steps[2].toolNames).toContain("action_sap_post");
    // Sub-instructions exist and carry the shared guardrails.
    for (const step of wf.steps) {
      expect(step.instruction).toContain("SHARED GUARDRAILS");
      expect(step.instruction).toContain("Use ONLY your assigned tools");
      expect(step.id).not.toMatch(/__|^_|_$/); // ids are clean identifiers
    }
  });

  test("1-stage / single tool-bearing pipeline → single", () => {
    const pipeline = [
      { label: "Pull SAP GL entries", description: "Pull gl entries from sap." },
      { label: "Summarize", description: "Write a human-readable summary. No tools." },
    ];
    const behaviorContract = { role: "Analyst", toolIntents: [toolIntents[0]] };
    const wf = deriveAgentWorkflow({
      behaviorContract,
      architecture: { pipeline },
      manifest: { id: "x", tables, useCaseSpec: { behaviorContract } },
    });
    expect(wf.topology).toBe("single");
    expect(wf.steps).toEqual([]);
  });

  test("no toolIntents → single", () => {
    const wf = deriveAgentWorkflow({
      behaviorContract: { role: "x", toolIntents: [] },
      architecture: { pipeline: [{ label: "a", description: "b" }] },
      manifest: { id: "x", tables: [] },
    });
    expect(wf.topology).toBe("single");
  });

  test("no pipeline → single", () => {
    const behaviorContract = { role: "x", toolIntents };
    const wf = deriveAgentWorkflow({
      behaviorContract,
      architecture: { pipeline: [] },
      manifest: { id: "x", tables, useCaseSpec: { behaviorContract } },
    });
    expect(wf.topology).toBe("single");
  });

  test("explicit behaviorContract.workflow with mode=parallel → parallel", () => {
    const behaviorContract = {
      role: "x",
      toolIntents,
      workflow: {
        mode: "parallel",
        steps: [
          { id: "a", label: "Pull SAP", tools: ["query_sap_gl_entries"], parallel: true },
          { id: "b", label: "Pull BlackLine", tools: ["query_blackline_reconciliations"], parallel: true },
        ],
      },
    };
    const wf = deriveAgentWorkflow({
      behaviorContract,
      architecture: { pipeline: [] },
      manifest: { id: "x", tables, useCaseSpec: { behaviorContract } },
    });
    expect(wf.topology).toBe("parallel");
    expect(wf.steps.length).toBe(2);
    expect(wf.steps[0].toolNames).toEqual(["query_sap_gl_entries"]);
    expect(wf.steps[1].toolNames).toEqual(["query_blackline_reconciliations"]);
  });

  test("steps referencing missing tools are dropped/merged → never reference a missing tool", () => {
    const behaviorContract = {
      role: "x",
      toolIntents,
      workflow: {
        mode: "sequential",
        steps: [
          { id: "a", label: "Pull SAP", tools: ["query_sap_gl_entries"] },
          { id: "ghost", label: "Nonexistent", tools: ["totally_made_up_tool"] },
          { id: "b", label: "Pull BlackLine", tools: ["query_blackline_reconciliations"] },
        ],
      },
    };
    const wf = deriveAgentWorkflow({
      behaviorContract,
      architecture: { pipeline: [] },
      manifest: { id: "x", tables, useCaseSpec: { behaviorContract } },
    });
    expect(wf.topology).toBe("sequential");
    // Ghost step (no resolvable tool) dropped, leaving 2 real stages.
    expect(wf.steps.length).toBe(2);
    const allTools = wf.steps.flatMap((s) => s.toolNames);
    expect(allTools).not.toContain("totally_made_up_tool");
  });
});

// ── buildWorkflowFromPipeline (spec-authoring shared builder) ─────────

describe("buildWorkflowFromPipeline", () => {
  const toolIntents = [
    { name: "query_sap_gl_entries", kind: "query", sourceSystemId: "sap" },
    { name: "query_blackline_reconciliations", kind: "query", sourceSystemId: "blackline" },
    { name: "action_sap_post", kind: "action", sourceSystemId: "sap" },
  ];
  const pipeline = [
    { label: "Pull SAP GL entries", description: "Pull gl entries from sap to seed the workflow." },
    { label: "Match BlackLine reconciliations", description: "Match against blackline reconciliations records." },
    { label: "Post to SAP", description: "Post the close action to sap after evidence is gathered." },
  ];

  test("real multi-stage pipeline → spec-shape workflow with toolIntent NAMES", () => {
    const wf = buildWorkflowFromPipeline({ behaviorContract: { toolIntents }, architecture: { pipeline } });
    expect(wf).not.toBeNull();
    expect(wf.mode).toBe("sequential");
    expect(wf.steps.length).toBe(3);
    // tools are the declared toolIntent names, not canonical Python names.
    expect(wf.steps[0].tools).toContain("query_sap_gl_entries");
    expect(wf.steps[1].tools).toContain("query_blackline_reconciliations");
    expect(wf.steps[2].tools).toContain("action_sap_post");
    for (const step of wf.steps) {
      expect(typeof step.label).toBe("string");
      expect(Array.isArray(step.tools)).toBe(true);
      // every emitted tool corresponds to a declared toolIntent name
      for (const t of step.tools) expect(toolIntents.some((i) => i.name === t)).toBe(true);
    }
  });

  test("fewer than 2 stages → null (stays single-agent)", () => {
    const wf = buildWorkflowFromPipeline({
      behaviorContract: { toolIntents },
      architecture: { pipeline: [pipeline[0]] },
    });
    expect(wf).toBeNull();
  });

  test("fewer than 2 tool-bearing stages → null", () => {
    const wf = buildWorkflowFromPipeline({
      behaviorContract: { toolIntents: [toolIntents[0]] },
      architecture: {
        pipeline: [
          { label: "Pull SAP GL entries", description: "Pull gl entries from sap." },
          { label: "Summarize", description: "Write a human-readable summary. No tools." },
        ],
      },
    });
    expect(wf).toBeNull();
  });

  test("no toolIntents → null", () => {
    expect(buildWorkflowFromPipeline({ behaviorContract: { toolIntents: [] }, architecture: { pipeline } })).toBeNull();
  });

  test("explicit architecture.parallel → mode=parallel", () => {
    const wf = buildWorkflowFromPipeline({
      behaviorContract: { toolIntents },
      architecture: { pipeline, parallel: true },
    });
    expect(wf).not.toBeNull();
    expect(wf.mode).toBe("parallel");
  });

  test("spec workflow round-trips through deriveAgentWorkflow to the same topology", () => {
    // The spec-authored workflow (intent names) must resolve at build time to the
    // same sequential topology the pure-pipeline derivation would produce.
    const tables = [
      { name: "gl_entries", sourceSystemId: "sap" },
      { name: "reconciliations", sourceSystemId: "blackline" },
    ];
    const wf = buildWorkflowFromPipeline({ behaviorContract: { toolIntents }, architecture: { pipeline } });
    const contract = { role: "Controller", toolIntents, workflow: wf };
    const derived = deriveAgentWorkflow({
      behaviorContract: contract,
      architecture: { pipeline },
      manifest: { id: "x", tables, useCaseSpec: { behaviorContract: contract } },
    });
    expect(derived.topology).toBe("sequential");
    expect(derived.steps.length).toBe(wf.steps.length);
  });
});

// ── End-to-end emitter (subprocess: from-usecase → generate → tools) ──

// Drive the spec → fixtures → tools/agent emission without the heavy pytest step:
// `from-usecase` builds the schema/spec (init + schema), then we run generate + tools
// directly. We skip from-usecase's internal `cmdTest` (uv/pytest) so the test is fast
// and hermetic. The usecase-spec.json from-usecase writes carries the behaviorContract
// + architecture.pipeline the emitter needs.
function generateAgent(usecase) {
  const dir = mkdtempSync(join(tmpdir(), "ge-wf-emit-"));
  const env = { ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" };
  // from-usecase runs init + schema + generate + tools + test. Re-running tools with
  // --force-agent guarantees a fresh agent.py from the current emitter. The internal
  // pytest run is tolerated (it passes), but the long bun timeout below covers it.
  // --harness-review false: this test exercises the deterministic emitter only;
  // without the pin, from-usecase auto-enables the Antigravity review whenever an
  // ambient GEMINI_API_KEY/Vertex env exists and then fails on machines without
  // the google.antigravity Python runtime.
  execFileSync("node", [GE_MOCK, "from-usecase", "--dir", dir, "--usecase", usecase, "--rows", "12", "--seed", "42", "--harness-review", "false"], { env, stdio: "ignore", cwd: APP_DIR });
  execFileSync("node", [GE_MOCK, "tools", "--dir", dir, "--force-agent", "true"], { env, stdio: "ignore", cwd: APP_DIR });
  const agentPy = readFileSync(join(dir, "app", "agent.py"), "utf8");
  const toolsPy = readFileSync(join(dir, "app", "tools.py"), "utf8");
  return { dir, agentPy, toolsPy };
}

function astParse(source) {
  const dir = mkdtempSync(join(tmpdir(), "ge-wf-ast-"));
  const p = join(dir, "agent.py");
  require("node:fs").writeFileSync(p, source, "utf8");
  try {
    execFileSync("python3", ["-c", `import ast; ast.parse(open(${JSON.stringify(p)}).read())`], { stdio: "pipe" });
    return true;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("multi-agent emitter", () => {
  test("multi-step spec → SequentialAgent + sub-agents + _pick, tools.py unchanged", () => {
    const { dir, agentPy, toolsPy } = generateAgent("account-reconciliation-agent");
    try {
      expect(agentPy).toContain("from google.adk.agents import Agent, SequentialAgent");
      expect(agentPy).toContain("SequentialAgent(");
      expect(agentPy).toContain("_TOOLS_BY_NAME");
      expect(agentPy).toContain("def _pick(");
      expect(agentPy).toContain("tools=_pick(");
      expect(agentPy).toContain("sub_agents=[");
      expect(agentPy).toContain("before_agent_callback=initialize_workflow_state");
      expect(agentPy).toContain("before_tool_callback=enforce_tool_contract");
      expect(agentPy).toContain("after_tool_callback=capture_tool_evidence");
      // At least two sub-agent Agent(...) definitions (named <scenario>_<stepid>).
      const subAgentDefs = agentPy.match(/^account_reconciliation_agent_\w+ = Agent\(/gm) || [];
      expect(subAgentDefs.length).toBeGreaterThanOrEqual(2);
      // tools.py keeps the full FunctionTool list (unchanged contract): the dual
      // backend defines source_adapters_fixtures and binds source_adapters from it.
      expect(toolsPy).toContain("source_adapters_fixtures = [FunctionTool(");
      expect(toolsPy).toContain("source_adapters = source_adapters_fixtures");
      // Emitted Python parses.
      expect(astParse(agentPy)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);

  test("single-step spec → single Agent + tools=source_adapters, no multi-agent constructs", () => {
    const { dir, agentPy } = generateAgent("ad-hoc-query-agent");
    try {
      expect(agentPy).toContain("from google.adk.agents import Agent\n");
      expect(agentPy).toContain("root_agent = Agent(");
      expect(agentPy).toContain("tools=source_adapters,");
      expect(agentPy).not.toContain("SequentialAgent");
      expect(agentPy).not.toContain("ParallelAgent");
      expect(agentPy).not.toContain("_pick(");
      expect(astParse(agentPy)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);

  // BUG 1 — every sub-agent must carry the global contract governance (primary
  // objective + out-of-scope + refusal rules), not just stage text + a trimmed
  // guardrail subset. We assert against the concatenation of all sub-agent
  // instructions emitted in agent.py.
  test("BUG1: every sub-agent instruction carries objective + outOfScope + refusal governance", async () => {
    const { getUseCases } = await import("../src/use-cases.js");
    const uc = (await getUseCases()).find((u) => u.id === "account-reconciliation-agent");
    const bc = uc.generationSpec?.behaviorContract || uc.behaviorContract;
    const { dir, agentPy } = generateAgent("account-reconciliation-agent");
    try {
      // The set of instruction="""...""" blocks belonging to sub-agents (Agent(...)).
      // The orchestration root (SequentialAgent/ParallelAgent) has no instruction
      // arg in the buggy build; concatenating ALL instruction blocks is a superset
      // and still proves each governance item appears in the per-stage prompts.
      const blocks = [...agentPy.matchAll(/instruction="""([\s\S]*?)"""/g)].map((m) => m[1]);
      expect(blocks.length).toBeGreaterThanOrEqual(2);
      const allInstr = blocks.join("\n\n");
      // Primary objective (first ~80 chars, robust to triple-escaping).
      const objHead = (bc.primaryObjective || "").slice(0, 60);
      expect(objHead.length).toBeGreaterThan(10);
      expect(allInstr).toContain(objHead);
      // Each out-of-scope item must be governed in the multi-agent prompts.
      for (const item of bc.outOfScope || []) {
        expect(allInstr).toContain(item.slice(0, 40));
      }
      // Each refusal rule must be governed in the multi-agent prompts.
      for (const rule of bc.refusalRules || []) {
        expect(allInstr).toContain(rule.slice(0, 40));
      }
      expect(astParse(agentPy)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);

  // BUG 2 — before_agent_callback=initialize_workflow_state must be wired on the
  // root orchestrator and EVERY sub-agent. The root can short-circuit governance
  // bypass requests before the workflow runs; branches still seed their own state.
  test("BUG2: before_agent_callback is on root and every sub-agent", () => {
    const { dir, agentPy } = generateAgent("account-reconciliation-agent");
    try {
      const subAgentDefs = (agentPy.match(/^account_reconciliation_agent_\w+ = Agent\(/gm) || []).length;
      expect(subAgentDefs).toBeGreaterThanOrEqual(2);
      const initCallbacks = (agentPy.match(/before_agent_callback=initialize_workflow_state/g) || []).length;
      expect(initCallbacks).toBe(subAgentDefs + 1);
      expect(astParse(agentPy)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);

  // BUG 3 — each sub-agent must get a distinct output_key so sequential stages
  // don't clobber each other and parallel branches don't collide.
  test("BUG3: sub-agents have distinct output_key values", () => {
    const { dir, agentPy } = generateAgent("account-reconciliation-agent");
    try {
      const keys = [...agentPy.matchAll(/output_key="([^"]+)"/g)].map((m) => m[1]);
      // root is multi-agent so all output_keys here belong to sub-agents.
      expect(keys.length).toBeGreaterThanOrEqual(2);
      expect(new Set(keys).size).toBe(keys.length);
      expect(astParse(agentPy)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120000);
});

// ── BUG 4 — query-table tail collisions across systems ───────────────
//
// Two query intents from DIFFERENT source systems that share a name tail
// (query_workday_records + query_okta_records → tail "records") must
// materialize TWO distinct backing tables and resolve to TWO distinct canonical
// tool names — neither resolving to the other system's tool.
describe("ensureContractQueryTables / canonicalIntentToolName tail collisions", () => {
  function makeSchema() {
    const behaviorContract = {
      role: "x",
      toolIntents: [
        { name: "query_workday_records", kind: "query", sourceSystemId: "workday", requiredInputs: ["employee_id"] },
        { name: "query_okta_records", kind: "query", sourceSystemId: "okta", requiredInputs: ["employee_id"] },
      ],
    };
    return {
      tables: [{ name: "employees", columns: [{ name: "id", type: "seq" }] }],
      rowPolicy: { defaultRowsPerEntity: 10 },
      useCaseSpec: { behaviorContract },
    };
  }

  test("BUG4: two same-tail intents from different systems → two distinct tables", () => {
    const schema = ensureContractQueryTables(makeSchema());
    const generated = (schema.tables || []).filter((t) => t._sourceKind === "generated_contract_table");
    expect(generated.length).toBe(2);
    const systems = generated.map((t) => t._sourceSystemId).sort();
    expect(systems).toEqual(["okta", "workday"]);
    // Distinct table identities (no collapse onto a single "records" table).
    expect(new Set(generated.map((t) => t.name)).size).toBe(2);
  });

  test("BUG4: canonicalIntentToolName resolves each intent to its OWN system's tool", () => {
    const schema = ensureContractQueryTables(makeSchema());
    // Tables as loaded by the generator expose sourceSystemId (from _sourceSystemId).
    const tables = (schema.tables || []).map((t) => ({
      ...t,
      sourceSystemId: t._sourceSystemId || t.sourceSystemId || null,
    }));
    const intents = schema.useCaseSpec.behaviorContract.toolIntents;
    const wdName = canonicalIntentToolName(intents[0], tables);
    const oktaName = canonicalIntentToolName(intents[1], tables);
    expect(wdName).not.toBe(oktaName);
    expect(wdName).toContain("workday");
    expect(oktaName).toContain("okta");
    // Neither resolves into the other's system.
    expect(wdName).not.toContain("okta");
    expect(oktaName).not.toContain("workday");
  });
});

// ── bigQueryType / numeric inference ─────────────────────────
// Regression: decimal-bearing fields (amount/value/variance_pct/match_rate)
// were typed INT64, so `bq load` rejected NDJSON like "62745.86". Inference must
// be value-based: INT64 only when EVERY sampled value is an integer.

const { bigQueryType, bigQueryNumericType } = __test;

describe("bigQueryType", () => {
  test("integers-only number column → INT64", () => {
    expect(bigQueryType({ name: "qty", type: "number" }, [1, 2, 3, 0, 42])).toBe("INT64");
  });

  test("any decimal present → FLOAT64", () => {
    expect(bigQueryType({ name: "qty", type: "number" }, [1, 2, 3.5, 4])).toBe("FLOAT64");
  });

  test("mixed integers and decimals → FLOAT64", () => {
    expect(bigQueryType({ name: "amount", type: "number" }, [1, 2, 62745.86, 4])).toBe("FLOAT64");
  });

  test("first row whole but later rows decimal → FLOAT64 (no first-row trap)", () => {
    // The collapse path: a float column rebuilt from rows arrives as type "number".
    const sampled = [100, 200, 300, 415.27, 12.5];
    expect(bigQueryType({ name: "value", type: "number" }, sampled)).toBe("FLOAT64");
  });

  test("declared float type → FLOAT64 regardless of sample", () => {
    expect(bigQueryType({ name: "match_rate", type: "float" }, [1, 2, 3])).toBe("FLOAT64");
  });

  test("decimal-ish field name with no sample → FLOAT64 backstop", () => {
    expect(bigQueryType({ name: "variance_pct", type: "number" }, [])).toBe("FLOAT64");
    expect(bigQueryType({ name: "unit_price", type: "number" }, [])).toBe("FLOAT64");
  });

  test("decimal-ish name but a strong integer-only sample → INT64 (data wins)", () => {
    const allWhole = [10, 20, 30, 40, 50, 60, 70, 80];
    expect(bigQueryType({ name: "total", type: "number" }, allWhole)).toBe("INT64");
  });

  test("decimal-ish name with a tiny integer-only sample → FLOAT64 (sample untrusted)", () => {
    expect(bigQueryType({ name: "amount", type: "number" }, [10, 20])).toBe("FLOAT64");
  });

  test("non-numeric column → STRING; boolean → BOOL; date → DATE", () => {
    expect(bigQueryType({ name: "code", type: "string" }, ["a", "b"])).toBe("STRING");
    expect(bigQueryType({ name: "is_open", type: "boolean" }, [true, false])).toBe("BOOL");
    expect(bigQueryType({ name: "posted_on", type: "date" }, ["2026-01-01"])).toBe("DATE");
  });

  test("untyped column inferred from sampled values: decimals → FLOAT64", () => {
    expect(bigQueryType({ name: "x" }, [1.5, 2.5])).toBe("FLOAT64");
    expect(bigQueryType({ name: "x" }, [1, 2, 3])).toBe("INT64");
    expect(bigQueryType({ name: "x" }, ["text"])).toBe("STRING");
  });

  test("bigQueryNumericType: empty sample, neutral name → INT64", () => {
    expect(bigQueryNumericType({ name: "seq_no", type: "number" }, [])).toBe("INT64");
  });
});
