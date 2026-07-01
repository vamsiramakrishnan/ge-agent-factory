import { test, expect } from "bun:test";
import { renderAgentPy } from "../scripts/factory/agents/render-agent-py.mjs";

// The golden oracle (factory-tools-golden) pins the single-agent agent.py byte for
// byte. This file locks the MULTI-agent branch of renderAgentPy, which the golden
// fixture (a single-agent scenario) does not reach and which factory-workflow.test
// only exercises through the full from-usecase pipeline (needs the agents-cli env).

const QUALITY_PLAN = {
  naming: { agentName: "demo_agent", displayName: "Demo Agent" },
  adkCapabilities: {
    generateContentConfig: { temperature: 0.2, maxOutputTokens: null },
    outputKey: "final_answer",
    useSubAgentsWhen: "multiple distinct stages",
  },
};
const MANIFEST = { id: "demo-agent", tables: [], systems: [] };
const CONTRACT = { primaryObjective: "Reconcile accounts.", toolIntents: [] };

test("single topology emits one Agent wired to the full source_adapters list", () => {
  const py = renderAgentPy({
    manifest: MANIFEST,
    behaviorContract: CONTRACT,
    instruction: "Do the thing.",
    qualityPlan: QUALITY_PLAN,
    workflow: { topology: "single", steps: [] },
    agentModel: "gemini-test",
  });
  expect(py).toContain("from google.adk.agents import Agent\n");
  expect(py).toContain("root_agent = Agent(");
  expect(py).toContain("    tools=source_adapters,");
  expect(py).toContain('app = App(root_agent=root_agent, name="app")');
  // Single path must NOT emit the multi-agent scaffolding.
  expect(py).not.toContain("_TOOLS_BY_NAME");
  expect(py).not.toContain("SequentialAgent");
});

test("sequential topology emits a SequentialAgent of stage sub-agents", () => {
  const workflow = {
    topology: "sequential",
    steps: [
      { id: "gather", label: "Gather evidence", instruction: "Collect.", toolNames: ["query_a", "query_b"] },
      { id: "decide", label: "Decide", instruction: "Decide.", toolNames: ["act_x"] },
    ],
  };
  const py = renderAgentPy({
    manifest: MANIFEST,
    behaviorContract: CONTRACT,
    instruction: "Do the thing.",
    qualityPlan: QUALITY_PLAN,
    workflow,
    agentModel: "gemini-test",
  });
  expect(py).toContain("from google.adk.agents import Agent, SequentialAgent");
  expect(py).toContain("root_agent = SequentialAgent(");
  expect(py).toContain("def _pick(*names):");
  // One Agent per stage, var-named scenario_stepId.
  expect(py).toContain("demo_agent_gather = Agent(");
  expect(py).toContain("demo_agent_decide = Agent(");
  // before_agent_callback is wired on EVERY sub-agent (parallel branches don't share state).
  expect(py.match(/before_agent_callback=initialize_workflow_state,/g)).toHaveLength(2);
  // Distinct per-stage output_key.
  expect(py).toContain('output_key="gather_output"');
  expect(py).toContain('output_key="decide_output"');
  // Each sub-agent is scoped to its stage's tools.
  expect(py).toContain('tools=_pick("query_a", "query_b"),');
  expect(py).toContain('tools=_pick("act_x"),');
  expect(py).toContain("sub_agents=[demo_agent_gather, demo_agent_decide]");
});

test("parallel topology emits a ParallelAgent", () => {
  const py = renderAgentPy({
    manifest: MANIFEST,
    behaviorContract: CONTRACT,
    instruction: "Do the thing.",
    qualityPlan: QUALITY_PLAN,
    workflow: {
      topology: "parallel",
      steps: [{ id: "branch1", label: "Branch 1", instruction: "Go.", toolNames: ["query_a"] }],
    },
    agentModel: "gemini-test",
  });
  expect(py).toContain("from google.adk.agents import Agent, ParallelAgent");
  expect(py).toContain("root_agent = ParallelAgent(");
});
