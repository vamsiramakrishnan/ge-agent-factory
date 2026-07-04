---
type: Agent Tool
title: action_oracle_xstore_pos_escalate
description: Execute the escalate step in Oracle Xstore POS after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_oracle_xstore_pos_escalate

Execute the escalate step in Oracle Xstore POS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
- **API:** POST /api/oracle_xstore_pos/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Xstore POS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_xstore_pos_escalate](/policies/confirmation-action-oracle-xstore-pos-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Xstore POS](/systems/oracle-xstore-pos.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [register_health_signal_intake](/workflow/register-health-signal-intake.md)
- [playbook_gated_severity_scoring](/workflow/playbook-gated-severity-scoring.md)
- [escalation_lane_status_notification](/workflow/escalation-lane-status-notification.md)

## Evals

- [Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pos-exception-triage-agent-end-to-end.md)

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
action_oracle_xstore_pos_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
- [Confirmation policy — action_oracle_xstore_pos_escalate](/policies/confirmation-action-oracle-xstore-pos-escalate.md)
- [Idempotency policy — action_oracle_xstore_pos_escalate](/policies/idempotency-action-oracle-xstore-pos-escalate.md)
