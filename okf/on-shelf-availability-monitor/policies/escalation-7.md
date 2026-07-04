---
type: Policy
title: Escalation policy 7
description: "When A single SKU/store position shows a zero-sales anomaly for more than 14 consecutive days despite a positive on-hand balance (chronic phantom inventory that a cycle-count task has not resolved); action: escalate_to_human; handoff: district_inventory_control_manager"
source_id: "escalation-7"
tags:
  - retail
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
| A single SKU/store position shows a zero-sales anomaly for more than 14 consecutive days despite a positive on-hand balance (chronic phantom inventory that a cycle-count task has not resolved) | escalate_to_human | district_inventory_control_manager | A phantom-inventory position that survives two-plus cycle-count cycles points to a receiving, shrink, or system-integrity problem beyond routine shelf-recovery tasking and needs district-level investigation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
