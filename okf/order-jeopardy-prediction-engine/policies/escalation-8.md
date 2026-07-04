---
type: Policy
title: Escalation policy 8
description: "When expedite_flag is true on an order whose due_date is within 3 days and no linked provisioning_task has advanced task_status in the last 24 hours; action: request_more_info; handoff: Delivery Program Manager"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| expedite_flag is true on an order whose due_date is within 3 days and no linked provisioning_task has advanced task_status in the last 24 hours | request_more_info | Delivery Program Manager | A flagged expedite with no task movement in a day signals the recovery path itself may be stalled, not just the order; the Delivery Program Manager needs a fresh status read before a delay notification goes to the customer. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
