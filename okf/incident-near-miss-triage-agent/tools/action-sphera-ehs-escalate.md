---
type: Agent Tool
title: action_sphera_ehs_escalate
description: Execute the escalate step in Sphera EHS after the agent has gathered evidence and validated escalation gates.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sphera_ehs_escalate

Execute the escalate step in Sphera EHS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)
- **API:** POST /api/sphera_ehs/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Sphera EHS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sphera_ehs_escalate](/policies/confirmation-action-sphera-ehs-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [new_report_intake_permit_cross_reference](/workflow/new-report-intake-permit-cross-reference.md)
- [escalation_audit_closeout](/workflow/escalation-audit-closeout.md)

## Evals

- [Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/incident-near-miss-triage-agent-end-to-end.md)

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
action_sphera_ehs_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
- [Confirmation policy — action_sphera_ehs_escalate](/policies/confirmation-action-sphera-ehs-escalate.md)
- [Idempotency policy — action_sphera_ehs_escalate](/policies/idempotency-action-sphera-ehs-escalate.md)
