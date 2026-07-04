---
type: Agent Tool
title: action_kubernetes_trigger
description: Execute the trigger step in Kubernetes after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_kubernetes_trigger

Execute the trigger step in Kubernetes after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Kubernetes](/systems/kubernetes.md)
- **API:** POST /api/kubernetes/trigger

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Kubernetes state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_kubernetes_trigger](/policies/confirmation-action-kubernetes-trigger.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kubernetes](/systems/kubernetes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [utilization_collection](/workflow/utilization-collection.md)

## Evals

- [Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capacity-planning-agent-end-to-end.md)

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
action_kubernetes_trigger(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Kubernetes](/systems/kubernetes.md)
- [Confirmation policy — action_kubernetes_trigger](/policies/confirmation-action-kubernetes-trigger.md)
- [Idempotency policy — action_kubernetes_trigger](/policies/idempotency-action-kubernetes-trigger.md)
