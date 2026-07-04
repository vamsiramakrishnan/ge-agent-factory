---
type: Policy
title: Escalation policy 8
description: "When More than 15% of a store's open BOPIS/curbside online_orders show pick_tasks in short_picked or cancelled status within the same wave_id; action: escalate_to_human; handoff: District Fulfillment Manager"
source_id: "escalation-8"
tags:
  - retail
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
| More than 15% of a store's open BOPIS/curbside online_orders show pick_tasks in short_picked or cancelled status within the same wave_id | escalate_to_human | District Fulfillment Manager | Wave-level pick failure at that rate points to a systemic inventory or labor problem, not isolated order noise, and needs district-level intervention. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
