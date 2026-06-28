---
title: Agent generation
parent: Reference
nav_order: 5
layout: default
---

# Agent generation

Generated agents are **real ADK** code — not mocks. The emitter is the `tools`
command of
[`apps/factory/scripts/factory.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory)
(`cmdTools`), which reads the use-case [spec](spec-schema.html) and writes a
runnable [`agents-cli`](https://github.com/vamsiramakrishnan/ge-agent-factory)
workspace. The reference example is
[`generated-agents/account-reconciliation-agent/`](https://github.com/vamsiramakrishnan/ge-agent-factory).

---

## Workspace layout

```
account-reconciliation-agent/
├── app/
│   ├── __init__.py
│   ├── agent.py            # ADK Agent/App + the 3 callbacks
│   ├── tools.py            # FunctionTools + the dual (fixtures|mcp) backend
│   └── knowledge/          # OKF grounding bundle (emitted when the spec qualifies)
├── fixtures/               # tables/*.json + documents/*.md (the offline data)
├── mock_data/              # semantic model + metadata
├── mock_systems/           # schema + scenarios
├── tests/
│   └── eval/
│       ├── eval_config.json
│       └── evalsets/ge_behavior_contract.evalset.json
├── evals/golden.json       # human-readable golden eval specs
├── pyproject.toml
└── agents-cli-manifest.yaml
```

> The checked-in `account-reconciliation-agent` sample is **single-agent** and has
> no `app/knowledge/` directory: the OKF bundle and multi-agent topology are
> emitted **conditionally** (see below), and this committed snapshot predates
> them. New builds emit `app/knowledge/` whenever the spec carries a
> behavior contract.

---

## `app/agent.py` — ADK assembly

Imports (verified):

```python
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.agents.callback_context import CallbackContext
from google.genai import types as genai_types
from .tools import source_adapters
```

The root agent wires three callbacks and the tool set:

```python
root_agent = Agent(
    name="account_reconciliation_agent_agent",
    model="gemini-3.5-flash",
    instruction=_INSTRUCTION,
    generate_content_config=genai_types.GenerateContentConfig(temperature=0.2),
    tools=source_adapters,
    before_agent_callback=initialize_workflow_state,
    before_tool_callback=enforce_tool_contract,
    after_tool_callback=capture_tool_evidence,
    output_key="last_response",
)
app = App(root_agent=root_agent, name="app")
```

`max_output_tokens` is emitted **only** when the spec/harness warrants a bound;
otherwise it is omitted to use the model default (never a `2048` boilerplate).

### The three callbacks

| Callback | Wired as | Behavior |
|---|---|---|
| `initialize_workflow_state` | `before_agent_callback` | Seeds session state: `scenario_id`, `primary_objective`, `expected_tools`, `evidence_log`, `audit_trails`. Runs once before any tool call. |
| `enforce_tool_contract` | `before_tool_callback` | Gates write-like tools: checks required inputs are present, validates the idempotency key, and enforces a minimum number of evidence systems before an action fires. Returns an error/escalation dict to block, or `None` to allow. |
| `capture_tool_evidence` | `after_tool_callback` | Appends each tool's emitted evidence (source system, table, totals) to `evidence_log` and collects audit-trail ids — without modifying the tool result. |

These three callbacks are the runtime enforcement of the
`behaviorContract.evidenceRequirements` / `escalationRules`.

### Multi-agent topology

When the spec's `behaviorContract.workflow` qualifies (≥2 tool-bearing stages over
≥2 distinct tools), `factory` emits a multi-agent topology instead of a single
`Agent`:

- `workflow.mode === "sequential"` → `from google.adk.agents import Agent, SequentialAgent`
- `workflow.mode === "parallel"` → `... import Agent, ParallelAgent`

Each step becomes a sub-`Agent` scoped to that step's tools (via a `_pick(*names)`
helper over `_TOOLS_BY_NAME`), and the root is a `SequentialAgent`/`ParallelAgent`
with `sub_agents=[...]`. Single-stage specs emit a plain `Agent` (as in the
reference sample).

---

## `app/tools.py` — the dual tool backend

Tools are real `FunctionTool`s over the offline fixtures. The backend is selected
by the **`GE_DATA_BACKEND`** env var:

```python
from google.adk.tools import FunctionTool

source_adapters_fixtures = [FunctionTool(func=query_sap_s_4hana_fi_gl_entries), ...]

_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")

def _mcp_toolsets():
    from google.adk.auth.credential_manager import CredentialManager
    from google.adk.integrations.agent_identity import GcpAuthProvider
    from google.adk.integrations.agent_registry import AgentRegistry
    CredentialManager.register_auth_provider(GcpAuthProvider())
    registry = AgentRegistry(project_id=_PROJECT, location=_LOCATION)
    return [registry.get_mcp_toolset(mcp_server_name=_name) for _name in [...]]

source_adapters = _mcp_toolsets() or source_adapters_fixtures if _BACKEND == "mcp" \
    else source_adapters_fixtures
```

- **`fixtures`** (default, local/offline) — in-process `FunctionTool`s reading the
  `fixtures/` tables + documents.
- **`mcp`** (cloud) — tools resolved from the **Agent Registry** by name, with
  Agent Runtime identity via **`GcpAuthProvider`** (ADC, no hardcoded URL).
  Resolution falls back to fixtures on any error.

---

## Knowledge bundle (`app/knowledge/`)

When the spec carries a behavior contract, `cmdTools` builds an OKF bundle
(`buildOkfBundle`) and writes the Markdown concepts under `app/knowledge/`. This is
the same [OKF](okf.html) format as the standalone bundles, grounding the agent in
its own systems, tables, tools, workflow, queries, and tests. Emission is
best-effort: a failure leaves the agent without the bundle rather than failing the
build.

---

## Eval set

Two artifacts:

- **`tests/eval/evalsets/ge_behavior_contract.evalset.json`** — the `agents-cli`
  evalset. Each `eval_case` has a `conversation` with `user_content` and
  `intermediate_data.tool_uses` (canonical tool names + inferred args), derived
  from the contract's golden evals. The accompanying `eval_config.json` defines the
  criteria (e.g. `tool_trajectory_avg_score` with `ANY_ORDER`, plus rubric- and
  safety-based scores).
- **`evals/golden.json`** — the human-readable golden specs (prompt,
  `expectedToolCalls`, `mustReferenceEntities`, `mustCiteDocuments`,
  `forbiddenBehaviors`, refusal rules) used for harness review.

---

## Antigravity validation & self-correction

[`apps/factory/scripts/antigravity-sdk-agent.py`](https://github.com/vamsiramakrishnan/ge-agent-factory)
is the harness driver run at the review/refine stages. It checks the generated
agent **against the spec** — that the topology matches the workflow
(single vs `SequentialAgent`/`ParallelAgent` with the right sub-agents), that the
three callbacks are wired, that every expected tool is reachable, and (when the
OKF bundle is present) that every Query Capability and Eval Scenario mechanism is
covered. On a mismatch it edits `app/agent.py` to self-correct, leaving
`app/tools.py` unchanged.

> The SDK driver wires all of Antigravity's capabilities but is default-off;
> `--dry-run` validates headlessly. The committed sample reflects a build where the
> refine step had not (re)emitted the conditional bundle/topology.
