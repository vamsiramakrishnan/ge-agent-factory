---
type: Agent Tool
title: action_finance_3_route
description: Execute the route step in FINANCE 3 after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_finance_3_route

Execute the route step in FINANCE 3 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [FINANCE 3](/systems/finance-3.md)
- **API:** POST /api/finance_3/route

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change FINANCE 3 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_finance_3_route](/policies/confirmation-action-finance-3-route.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [FINANCE 3](/systems/finance-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kpi-dashboard-builder-end-to-end.md)

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
action_finance_3_route(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [FINANCE 3](/systems/finance-3.md)
- [Confirmation policy — action_finance_3_route](/policies/confirmation-action-finance-3-route.md)
- [Idempotency policy — action_finance_3_route](/policies/idempotency-action-finance-3-route.md)
