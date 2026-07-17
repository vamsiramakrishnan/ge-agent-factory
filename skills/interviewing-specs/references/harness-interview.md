# Harness Interview

The interview stage is harness-driven. Any supported coding assistant may conduct the interview, but the output must be a normalized spec contract that the generator can compile.

## What the Interview Harness Should Do

1. Ask only for missing information that changes the build.
2. Infer a conservative baseline when the user is vague.
3. Name source systems and what each system owns.
4. Define data contracts for records, documents, metrics, and actions.
5. Define tool intents with required inputs, outputs, and emitted evidence.
6. Define guardrails as executable contract rules, not only prose.
7. Define golden evals that exercise the declared tool intents.
8. Define simulator scope only from declared source systems and data contracts.
9. Return one JSON object suitable for `catalog/interview-specs/`.

## Minimum Buildable Contract

A buildable spec has:

- `id`, `title`, `department`, `persona`, `layer`, `triggerType`
- `generationSpec.sourceSystems`
- `generationSpec.dataContracts`
- `generationSpec.behaviorContract.primaryObjective`
- `generationSpec.behaviorContract.toolIntents`
- `generationSpec.behaviorContract.evidenceRequirements`
- `generationSpec.behaviorContract.escalationRules`
- `generationSpec.behaviorContract.refusalRules`
- `generationSpec.behaviorContract.goldenEvals`

## Simulator and Mock Data Scope

The interview must decide what systems are in scope before any simulator or mock data is generated.

The interview harness may enrich the spec with conservative baseline schemas, but it must not invent systems outside `generationSpec.sourceSystems`. If a required system is missing, ask the user or add it explicitly to the spec with owned entities/documents. After that, the mission/data tools can generate data:

```bash
node apps/factory/scripts/plan-mock-data.mjs --dir <mission-workspace> --usecase <registered-spec-id> --sourceMap apps/factory/src/use-case-source-map.generated.json
node apps/factory/scripts/materialize-simulator-seeds.mjs --dir <mission-workspace>
node apps/factory/scripts/validate-simulator-pack.mjs --dir <mission-workspace>
```

If a simulator pack does not exist for a declared source system, the next action is to scaffold or enrich that simulator pack, not to make the eval or generated agent pretend the system exists.

## Feedback Loop

The normalized spec is the source of truth.

```text
interview output
  -> registry quality gates
  -> catalog sync
  -> generator
  -> harness review/refine
  -> deterministic validators
  -> ready-to-deploy package
```

If the harness discovers missing systems, schema fields, guardrails, or evals after generation, record that as spec feedback. The next run should update the spec first, then regenerate.
