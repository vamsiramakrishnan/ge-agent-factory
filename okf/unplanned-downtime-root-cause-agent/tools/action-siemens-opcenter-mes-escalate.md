---
type: Agent Tool
title: action_siemens_opcenter_mes_escalate
description: Execute the escalate step in Siemens Opcenter MES after the agent has gathered evidence and validated escalation gates.
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

# action_siemens_opcenter_mes_escalate

Execute the escalate step in Siemens Opcenter MES after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
- **API:** POST /api/siemens_opcenter_mes/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Siemens Opcenter MES state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_siemens_opcenter_mes_escalate](/policies/confirmation-action-siemens-opcenter-mes-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [downtime_alarm_event_capture](/workflow/downtime-alarm-event-capture.md)
- [escalation_evidence_package](/workflow/escalation-evidence-package.md)

## Evals

- [Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/unplanned-downtime-root-cause-agent-end-to-end.md)

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
action_siemens_opcenter_mes_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
- [Confirmation policy — action_siemens_opcenter_mes_escalate](/policies/confirmation-action-siemens-opcenter-mes-escalate.md)
- [Idempotency policy — action_siemens_opcenter_mes_escalate](/policies/idempotency-action-siemens-opcenter-mes-escalate.md)
