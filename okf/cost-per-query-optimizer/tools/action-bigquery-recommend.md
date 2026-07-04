---
type: Agent Tool
title: action_bigquery_recommend
description: Execute the recommend step in BigQuery after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_bigquery_recommend

Execute the recommend step in BigQuery after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [BigQuery](/systems/bigquery.md)
- **API:** POST /api/bigquery/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change BigQuery state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_bigquery_recommend](/policies/confirmation-action-bigquery-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_cost_profiling](/workflow/query-cost-profiling.md)
- [implementation_guidance](/workflow/implementation-guidance.md)

## Evals

- [Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-per-query-optimizer-end-to-end.md)

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
action_bigquery_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — action_bigquery_recommend](/policies/confirmation-action-bigquery-recommend.md)
- [Idempotency policy — action_bigquery_recommend](/policies/idempotency-action-bigquery-recommend.md)
