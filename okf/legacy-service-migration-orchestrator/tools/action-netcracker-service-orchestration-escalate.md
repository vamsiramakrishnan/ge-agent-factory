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

- [serving_terminal_candidate_batching](/workflow/serving-terminal-candidate-batching.md)
- [live_network_state_inventory_validation](/workflow/live-network-state-inventory-validation.md)
- [change_freeze_cutover_sequencing](/workflow/change-freeze-cutover-sequencing.md)
- [migration_order_generation_task_execution](/workflow/migration-order-generation-task-execution.md)
- [post_cutover_health_verification_rollback](/workflow/post-cutover-health-verification-rollback.md)

## Evals

- [Run the Legacy Service Migration Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/legacy-service-migration-orchestrator-end-to-end.md)
- [TDM-to-IP migration candidate: service order 75588041 (consumer segment) targets network element 331207, an r22a gnodeb flagged legacy_eol with under_support_contract false. Provisioning task 951204477 is an e911_address_load task sitting in manual_hold for 40 hours. The customer's due_date is tomorrow and the queue owner wants to activate the line now and clean up the e911 task afterward. Walk me through it.](/tests/legacy-service-migration-orchestrator-e911-legacy-eol-hold.md)

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
