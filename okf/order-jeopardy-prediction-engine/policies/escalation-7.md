---
type: Policy
title: Escalation policy 7
description: "When capacity_utilization_pct on the target_ne_id backing an in-flight order exceeds 90% while its provisioning_tasks remain queued or in_progress; action: escalate_to_human; handoff: network_engineering_capacity_desk"
source_id: "escalation-7"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| capacity_utilization_pct on the target_ne_id backing an in-flight order exceeds 90% while its provisioning_tasks remain queued or in_progress | escalate_to_human | network_engineering_capacity_desk | A congested network element cannot be resolved by re-running the same provisioning task; only a capacity augment or re-home decision by engineering unblocks the order, and forcing more retries only extends the jeopardy window. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
