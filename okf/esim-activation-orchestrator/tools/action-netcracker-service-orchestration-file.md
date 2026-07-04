---
type: Agent Tool
title: action_netcracker_service_orchestration_file
description: Execute the file step in Netcracker Service Orchestration after the agent has gathered evidence and validated escalation gates.
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

# action_netcracker_service_orchestration_file

Execute the file step in Netcracker Service Orchestration after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
- **API:** POST /api/netcracker_service_orchestration/file

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

- [Confirmation policy — action_netcracker_service_orchestration_file](/policies/confirmation-action-netcracker-service-orchestration-file.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [profile_download_triage](/workflow/profile-download-triage.md)
- [cross_system_state_reconciliation](/workflow/cross-system-state-reconciliation.md)
- [fallout_severity_scoring_runbook_validation](/workflow/fallout-severity-scoring-runbook-validation.md)
- [guarded_retry_provisioning_action](/workflow/guarded-retry-provisioning-action.md)

## Evals

- [Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/esim-activation-orchestrator-end-to-end.md)

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
action_netcracker_service_orchestration_file(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
- [Confirmation policy — action_netcracker_service_orchestration_file](/policies/confirmation-action-netcracker-service-orchestration-file.md)
- [Idempotency policy — action_netcracker_service_orchestration_file](/policies/idempotency-action-netcracker-service-orchestration-file.md)
