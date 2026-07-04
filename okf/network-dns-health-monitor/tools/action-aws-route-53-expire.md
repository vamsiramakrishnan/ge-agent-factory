---
type: Agent Tool
title: action_aws_route_53_expire
description: Execute the expire step in AWS Route 53 after the agent has gathered evidence and validated escalation gates.
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

# action_aws_route_53_expire

Execute the expire step in AWS Route 53 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [AWS Route 53](/systems/aws-route-53.md)
- **API:** POST /api/aws_route_53/expire

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change AWS Route 53 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_aws_route_53_expire](/policies/confirmation-action-aws-route-53-expire.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [AWS Route 53](/systems/aws-route-53.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [health_data_collection](/workflow/health-data-collection.md)

## Evals

- [Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-dns-health-monitor-end-to-end.md)

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
action_aws_route_53_expire(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [AWS Route 53](/systems/aws-route-53.md)
- [Confirmation policy — action_aws_route_53_expire](/policies/confirmation-action-aws-route-53-expire.md)
- [Idempotency policy — action_aws_route_53_expire](/policies/idempotency-action-aws-route-53-expire.md)
