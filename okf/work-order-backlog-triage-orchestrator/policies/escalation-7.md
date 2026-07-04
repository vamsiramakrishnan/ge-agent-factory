---
type: Policy
title: Escalation policy 7
description: "When A maintenance_work_order with priority=emergency remains at work_order_status=awaiting_parts for more than 5 calendar days; action: escalate_to_human; handoff: Maintenance Supervisor"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A maintenance_work_order with priority=emergency remains at work_order_status=awaiting_parts for more than 5 calendar days | escalate_to_human | Maintenance Supervisor | Parts logistics blocking a safety-critical repair for this long needs supervisor authority to expedite procurement or approve alternate sourcing rather than waiting on the normal replenishment cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
