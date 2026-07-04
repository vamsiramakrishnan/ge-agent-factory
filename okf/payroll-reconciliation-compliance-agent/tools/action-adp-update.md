---
type: Agent Tool
title: action_adp_update
description: Execute the update step in ADP after the agent has gathered evidence and validated escalation gates.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_adp_update

Execute the update step in ADP after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [ADP](/systems/adp.md)
- **API:** POST /api/adp/update

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change ADP state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_adp_update](/policies/confirmation-action-adp-update.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [ADP](/systems/adp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [post_run_collection](/workflow/post-run-collection.md)

## Evals

- [Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-reconciliation-compliance-agent-end-to-end.md)

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
action_adp_update(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [ADP](/systems/adp.md)
- [Confirmation policy — action_adp_update](/policies/confirmation-action-adp-update.md)
- [Idempotency policy — action_adp_update](/policies/idempotency-action-adp-update.md)
