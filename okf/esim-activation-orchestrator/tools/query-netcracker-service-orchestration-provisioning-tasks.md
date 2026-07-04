---
type: Agent Tool
title: query_netcracker_service_orchestration_provisioning_tasks
description: Retrieve provisioning tasks from Netcracker Service Orchestration for the eSIM Activation Orchestrator workflow.
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

# query_netcracker_service_orchestration_provisioning_tasks

Retrieve provisioning tasks from Netcracker Service Orchestration for the eSIM Activation Orchestrator workflow.

- **Kind:** query
- **Source system:** [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

## Inputs

- task_id
- order_number
- date_range

## Outputs

- provisioning_tasks_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- task_id
- order_number
- date_range

## Produces

- provisioning_tasks_records

# Examples

```
query_netcracker_service_orchestration_provisioning_tasks(task_id=<task_id>, order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
