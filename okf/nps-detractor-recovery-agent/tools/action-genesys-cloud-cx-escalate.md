---
type: Agent Tool
title: action_genesys_cloud_cx_escalate
description: Execute the escalate step in Genesys Cloud CX after the agent has gathered evidence and validated escalation gates.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_genesys_cloud_cx_escalate

Execute the escalate step in Genesys Cloud CX after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
- **API:** POST /api/genesys_cloud_cx/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Genesys Cloud CX state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_genesys_cloud_cx_escalate](/policies/confirmation-action-genesys-cloud-cx-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Genesys Cloud CX](/systems/genesys-cloud-cx.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nps-detractor-recovery-agent-end-to-end.md)

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
action_genesys_cloud_cx_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
- [Confirmation policy — action_genesys_cloud_cx_escalate](/policies/confirmation-action-genesys-cloud-cx-escalate.md)
- [Idempotency policy — action_genesys_cloud_cx_escalate](/policies/idempotency-action-genesys-cloud-cx-escalate.md)
