# Behavior Contract

Load this reference when you need to:

- audit whether an upstream slide is substantive enough to scaffold an agent,
- decide whether to refuse and hand back to `ge-contextual-agent-interviewer`,
- or wire the contract into `app/agent.py`, `app/tools.py`, and `evals/golden.json`.

The TypeScript shape lives at `src/types/architecture.ts`
(`AgentBehaviorContract`). The factory reads it from
`generationSpec.behaviorContract` in each use-case TSX and threads it through
to `mock_systems/usecase-spec.json.behaviorContract` in the generated
workspace. Skip any field at your peril — the validator
(`apps/ge-demo-generator/src/workspace-validation.js`) flags each one.

## Required Shape

```ts
{
  role: string,                       // ≥20 chars; "Benefits enrollment copilot for active GE employees in Workday"
  primaryObjective: string,           // ≥60 chars; single-sentence success criterion that names the action surface

  inScope: string[],                  // bullet list of supported workflows; rendered as IN SCOPE block
  outOfScope: string[],               // explicit refusals; rendered as OUT OF SCOPE block

  toolIntents: ToolIntent[],          // ≥3 entries, ≥1 with kind != "query"
  evidenceRequirements: Evidence[],   // ≥1 entry; each must have mustCite[] and sourceSystemIds[]
  escalationRules: Escalation[],      // ≥1 entry
  refusalRules: string[],             // ≥1 entry; hard guardrails (PII, invention, compliance)
  goldenEvals: GoldenEval[],          // ≥1 entry; every expectedToolCalls name must match a declared toolIntent.name
}
```

### ToolIntent

```ts
{
  name: string,                       // canonical, e.g. "submit_benefits_enrollment"
  kind: "query" | "action" | "evidence_lookup" | "notification" | "calculation",
  sourceSystemId: string,             // MUST match a sourceSystem.id in the same spec
  description: string,                // domain-specific, never generic
  requiredInputs: string[],           // logical input names — render as Python kwargs
  produces: string[],                 // outputs / side effects (e.g. "carrier_sync_id")
  evidenceEmitted: Array<"sql_result" | "source_system_record" | "document_reference" | "generated_audit_trail" | "api_response">,
}
```

`query` intents reuse the auto-generated per-table `query_<source_system>_<table>`
functions; only `action`, `notification`, `evidence_lookup`, and
`calculation` intents get their own Python function from
`renderContractToolPython`.

### EvidenceRequirement

```ts
{
  claim: string,                      // type of statement the agent might make
  mustCite: string[],                 // entity columns (`benefit_plans.monthly_premium`) or document citationAnchors
  sourceSystemIds: string[],          // which sourceSystems back the claim
}
```

### EscalationRule

```ts
{
  trigger: string,                    // domain trigger
  action: "escalate_to_human" | "refuse" | "request_more_info" | "use_fallback_tool",
  handoffTarget?: string,
  rationale: string,                  // why this rule exists; surfaced in the instruction
}
```

### GoldenEval

```ts
{
  id: string,
  prompt: string,                     // realistic user utterance
  expectedToolCalls: string[],        // tool intent names — must all resolve to a declared toolIntent.name
  mustReferenceEntities?: string[],
  mustCiteDocuments?: string[],
  expectedActionOutcome?: string,
  forbiddenBehaviors?: string[],
}
```

## How the Factory Renders It

| Contract field | Render target | Validator check |
|---|---|---|
| `role`, `primaryObjective` | `app/agent.py` instruction `PRIMARY OBJECTIVE` block | `behavior:role`, `behavior:objective`, `agent:instruction_uses_objective` |
| `inScope`, `outOfScope` | `IN SCOPE`, `OUT OF SCOPE` blocks | `agent:contract_sections` |
| `toolIntents` (non-query) | Python function in `app/tools.py` + `FunctionTool(...)` in `source_adapters` | `agent:contract_tool:<name>`, `behavior:non_query_intent` |
| `evidenceRequirements` | `EVIDENCE YOU MUST CITE` block | `behavior:evidence_requirements` |
| `escalationRules` | `ESCALATION & REFUSAL TRIGGERS` block | `behavior:escalation_rules` |
| `refusalRules` | `HARD GUARDRAILS` block | `behavior:refusal_rules` |
| `goldenEvals` | `evals/golden.json` | `behavior:golden_evals`, `behavior:evals_have_tool_calls`, `behavior:evals_reference_intents`, `evals:golden_file` |

## Anti-Patterns That Mean You Should Stop

- Agent instruction reads `"Use the fixture-backed source adapters to inspect available data. Never invent data."` — that is the no-contract stub. Re-run `ge-mock tools --force-agent` after the contract is in place.
- Agent instruction reads `"No behavior contract was provided on the upstream slide ..."` — `generationSpec.behaviorContract` is `null` upstream. Do **not** add a placeholder contract; hand back to the interviewer.
- `toolIntents` are all `kind: "query"` — there is no action surface, so the agent has nothing to *do*. Add at least one action / notification / evidence_lookup / calculation intent.
- `goldenEvals[].expectedToolCalls` references names that are not in `toolIntents` — the eval cannot be wired to the generated tools. Fix the names or add the intents.

## Worked Example

See `src/components/slides/use-cases/hr/BenefitsAssistant.tsx` for the
reference contract (eight tool intents across three source systems, four
evidence requirements, five escalation rules, five refusal rules, three
golden evals). The generated `app/agent.py`, `app/tools.py`, and
`evals/golden.json` for that workspace are what every other slide should
match in depth.
