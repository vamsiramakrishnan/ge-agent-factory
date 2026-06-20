# Agent Behavior Contract

The behavior contract is what stops the GE agent factory from emitting a hello-world / list / query shell. Every slide consumed by `ge create` (or `ge-mock from-usecase`) must declare a `generationSpec.behaviorContract` before the factory will compile the workspace.

## Why this exists

`ge-mock tools` derives the generated ADK agent from the behavior contract:

- **Tool intents** become real Python functions in `app/tools.py` (`action`, `notification`, `evidence_lookup`, `calculation`) — not just `query_*` reads.
- **Role + primary objective + in/out scope** become the agent `instruction` block in `app/agent.py`.
- **Evidence requirements** become "EVIDENCE YOU MUST CITE" lines in the instruction.
- **Escalation + refusal rules** become hard guardrails in the instruction.
- **Golden evals** become `evals/golden.json` and the workspace smoke tests.

A workspace whose `behaviorContract` is missing — or whose tool intents are all `kind: "query"` — will fail `workspace-validation` (`behavior:contract_present`, `behavior:non_query_intent`, `agent:contract_instruction_not_generic`, `agent:contract_sections`).

## Required shape

```ts
interface AgentBehaviorContract {
  role: string;                 // "Benefits enrollment copilot for active GE employees in Workday"
  primaryObjective: string;     // single-sentence success criterion (>= 60 chars)
  inScope: string[];            // at least 2
  outOfScope: string[];         // at least 1 explicit refusal
  toolIntents: Array<{
    name: string;               // canonical, e.g. "action_benefits_platform_enroll"
    kind: "query" | "action" | "evidence_lookup" | "notification" | "calculation";
    sourceSystemId: string;     // must exist in generationSpec.sourceSystems[].id
    description: string;        // domain-specific, not generic
    requiredInputs: string[];   // logical input names the agent must collect
    produces: string[];         // outputs / side effects
    evidenceEmitted: Array<"sql_result" | "source_system_record" | "document_reference" | "generated_audit_trail" | "api_response">;
  }>;
  evidenceRequirements: Array<{ claim: string; mustCite: string[]; sourceSystemIds: string[]; }>;
  escalationRules: Array<{ trigger: string; action: "escalate_to_human" | "refuse" | "request_more_info" | "use_fallback_tool"; handoffTarget?: string; rationale: string; }>;
  refusalRules: string[];       // hard guardrails (PII, invention, compliance)
  goldenEvals: Array<{
    id: string;
    prompt: string;
    expectedToolCalls: string[]; // must match toolIntents[].name
    mustReferenceEntities?: string[];
    mustCiteDocuments?: string[];
    expectedActionOutcome?: string;
    forbiddenBehaviors?: string[];
  }>;
}
```

## Quality gates (enforced by check-usecase-spec.mjs and workspace-validation.js)

- `behavior:contract_present` — slide declares a contract.
- `behavior:role` — role string is at least 20 chars and domain-specific.
- `behavior:objective` — primary objective is at least 60 chars.
- `behavior:tool_intents` — at least 3 tool intents.
- `behavior:non_query_intent` — at least one `action` / `notification` / `evidence_lookup` / `calculation` intent.
- `behavior:evidence_requirements` — non-empty.
- `behavior:escalation_rules` and `behavior:refusal_rules` — both non-empty.
- `behavior:golden_evals` — at least one end-to-end prompt.
- `behavior:evals_have_tool_calls` — each eval declares `expectedToolCalls`.
- `behavior:evals_reference_intents` — every eval `expectedToolCalls[]` matches a declared `toolIntents[].name`.
- `agent:contract_instruction_not_generic` — generated `app/agent.py` must not use the generic stub.
- `agent:contract_sections` — generated `app/agent.py` contains `PRIMARY OBJECTIVE` and `TOOL PLAYBOOK` sections.
- `agent:contract_tools_emitted` — every non-query intent has a corresponding `def` in `app/tools.py`.
- `evals:golden_file` — `evals/golden.json` exists with at least one eval.

## Progressive disclosure

Skills should:

1. Confirm the slide's `generationSpec.behaviorContract` exists before any generation step.
2. If missing, route back to the slide owner (or `ge-contextual-agent-interviewer`) to author the contract — do **not** fall back to a generic agent.
3. After generation, re-run `node .gemini/skills/ge-agent-pipeline/scripts/check-usecase-spec.mjs --dir <workspace>` and the workspace validators to confirm the contract was honored end-to-end.

## Exemplar

See `src/components/slides/use-cases/hr/BenefitsAssistant.tsx` for the reference implementation. Its `behaviorContract` declares 8 tool intents (mix of query/action/notification/evidence_lookup), 4 evidence requirements, 5 escalation rules, 5 refusal rules, and 3 golden evals.
