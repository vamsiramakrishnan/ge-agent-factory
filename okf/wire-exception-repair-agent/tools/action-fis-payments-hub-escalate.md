---
type: Agent Tool
title: action_fis_payments_hub_escalate
description: Execute the escalate step in FIS Payments Hub after the agent has gathered evidence and validated escalation gates.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_fis_payments_hub_escalate

Execute the escalate step in FIS Payments Hub after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [FIS Payments Hub](/systems/fis-payments-hub.md)
- **API:** POST /api/fis_payments_hub/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change FIS Payments Hub state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_fis_payments_hub_escalate](/policies/confirmation-action-fis-payments-hub-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [FIS Payments Hub](/systems/fis-payments-hub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Wire Exception Repair Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/wire-exception-repair-agent-end-to-end.md)

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
action_fis_payments_hub_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [FIS Payments Hub](/systems/fis-payments-hub.md)
- [Confirmation policy — action_fis_payments_hub_escalate](/policies/confirmation-action-fis-payments-hub-escalate.md)
- [Idempotency policy — action_fis_payments_hub_escalate](/policies/idempotency-action-fis-payments-hub-escalate.md)
