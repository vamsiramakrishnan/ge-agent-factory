---
type: Agent Tool
title: action_category_strategy_docs_create
description: Execute the create step in Category strategy docs after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_category_strategy_docs_create

Execute the create step in Category strategy docs after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Category strategy docs](/systems/category-strategy-docs.md)
- **API:** POST /api/category_strategy_docs/create

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Category strategy docs state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_category_strategy_docs_create](/policies/confirmation-action-category-strategy-docs-create.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Category strategy docs](/systems/category-strategy-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [input_aggregation](/workflow/input-aggregation.md)
- [roadmap_narrative_generation](/workflow/roadmap-narrative-generation.md)

## Evals

- [Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-roadmap-planner-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_category_strategy_docs_create(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Category strategy docs](/systems/category-strategy-docs.md)
- [Confirmation policy — action_category_strategy_docs_create](/policies/confirmation-action-category-strategy-docs-create.md)
- [Idempotency policy — action_category_strategy_docs_create](/policies/idempotency-action-category-strategy-docs-create.md)
