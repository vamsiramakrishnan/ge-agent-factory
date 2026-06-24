# Golden Evals

Golden evals are part of the spec contract. They are not ad hoc test prompts.

## First Step

Create or load a normalized spec JSON, then generate the Antigravity prompt:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals prompt --spec <normalized-spec.json> --out /tmp/golden-evals.prompt.txt
```

Give that prompt to Antigravity as the task context.

## What Antigravity Should Produce

Antigravity must return JSON only:

```json
{
  "evals": [
    {
      "id": "short-kebab-case-id",
      "prompt": "operator prompt",
      "expectedToolCalls": ["declared_tool_name"],
      "mustReferenceEntities": ["sourceSystem.entityName"],
      "mustCiteDocuments": ["document_id"],
      "expectedActionOutcome": "short expected outcome or null",
      "expectedBehaviors": ["observable behavior"],
      "forbiddenBehaviors": ["unsafe behavior to avoid"]
    }
  ]
}
```

## Validation Loop

Validate before applying:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals validate --spec <normalized-spec.json> --evals <golden-evals.json>
```

If validation fails, ask Antigravity to repair only the eval JSON. Do not change tool names, source systems, entities, or documents unless the user is intentionally revising the spec.

Apply only after validation passes:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals apply --spec <normalized-spec.json> --evals <golden-evals.json> --out <normalized-spec.with-evals.json>
```

## Scope Rules

- Use only declared `behaviorContract.toolIntents[*].name`.
- Use only declared source systems, entities, and documents.
- Cover every tool intent at least once.
- Include happy path, missing-evidence/refusal, escalation, and citation-grounding coverage.
- For action or notification tools, include a safety eval that prevents the write when evidence or approval is missing.
- Do not invent simulator systems, MCP tools, schemas, policy documents, or deployment targets.

## Next Step

Register the spec with validated evals:

```bash
node apps/ge-demo-generator/scripts/register-agent-spec.mjs --input <normalized-spec.with-evals.json>
```

After the factory generates a workspace, the generator converts these spec evals into Agents CLI artifacts:

- `evals/golden.json` keeps the GE behavior-contract evals.
- `tests/eval/evalsets/ge_behavior_contract.evalset.json` is the runnable Agents CLI evalset.
- `tests/eval/eval_config.json` sets tool trajectory and rubric criteria.
- `tests/eval/optimization_config.json` points optimization at the generated evalset.

At that point, use the `google-agents-cli-eval` skill for execution and repair:

```bash
cd <generated-workspace>
agents-cli eval run --all
```

If scores fail, follow the Agents CLI eval-fix loop: diagnose the failing metric, fix agent instructions/tool logic/evalset only where appropriate, rerun, and keep the spec as the source of truth when behavior must change.
