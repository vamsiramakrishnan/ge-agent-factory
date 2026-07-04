---
type: Agent Tool
title: action_netcracker_service_orchestration_escalate
description: Execute the escalate step in Netcracker Service Orchestration after the agent has gathered evidence and validated escalation gates.
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

# action_netcracker_service_orchestration_escalate

Execute the escalate step in Netcracker Service Orchestration after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
- **API:** POST /api/netcracker_service_orchestration/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Netcracker Service Orchestration state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_netcracker_service_orchestration_escalate](/policies/confirmation-action-netcracker-service-orchestration-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Number Porting Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/number-porting-exception-agent-end-to-end.md)

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
action_netcracker_service_orchestration_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
- [Confirmation policy — action_netcracker_service_orchestration_escalate](/policies/confirmation-action-netcracker-service-orchestration-escalate.md)
- [Idempotency policy — action_netcracker_service_orchestration_escalate](/policies/idempotency-action-netcracker-service-orchestration-escalate.md)
