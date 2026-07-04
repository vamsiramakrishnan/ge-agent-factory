---
type: Agent Tool
title: action_coupa_analytics_generate
description: Execute the generate step in Coupa Analytics after the agent has gathered evidence and validated escalation gates.
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

# action_coupa_analytics_generate

Execute the generate step in Coupa Analytics after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Coupa Analytics](/systems/coupa-analytics.md)
- **API:** POST /api/coupa_analytics/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Coupa Analytics state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_coupa_analytics_generate](/policies/confirmation-action-coupa-analytics-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa Analytics](/systems/coupa-analytics.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [etl_aggregation](/workflow/etl-aggregation.md)
- [commentary_generation](/workflow/commentary-generation.md)

## Evals

- [Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-spend-dashboard-end-to-end.md)

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
action_coupa_analytics_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Coupa Analytics](/systems/coupa-analytics.md)
- [Confirmation policy — action_coupa_analytics_generate](/policies/confirmation-action-coupa-analytics-generate.md)
- [Idempotency policy — action_coupa_analytics_generate](/policies/idempotency-action-coupa-analytics-generate.md)
