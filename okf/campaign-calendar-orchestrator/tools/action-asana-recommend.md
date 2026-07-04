---
type: Agent Tool
title: action_asana_recommend
description: Execute the recommend step in Asana after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_asana_recommend

Execute the recommend step in Asana after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Asana](/systems/asana.md)
- **API:** POST /api/asana/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Asana state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_asana_recommend](/policies/confirmation-action-asana-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Asana](/systems/asana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [calendar_synchronization](/workflow/calendar-synchronization.md)
- [alert_digest_delivery](/workflow/alert-digest-delivery.md)

## Evals

- [Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-calendar-orchestrator-end-to-end.md)

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
action_asana_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Asana](/systems/asana.md)
- [Confirmation policy — action_asana_recommend](/policies/confirmation-action-asana-recommend.md)
- [Idempotency policy — action_asana_recommend](/policies/idempotency-action-asana-recommend.md)
