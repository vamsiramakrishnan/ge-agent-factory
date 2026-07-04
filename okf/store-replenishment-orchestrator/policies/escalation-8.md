---
type: Policy
title: Escalation policy 8
description: "When cost_changes shows approval_status of pending for a SKU tied to an active parameter-tuning recommendation, with new_unit_cost more than 15% above old_unit_cost; action: request_more_info; handoff: Merchandise Planner"
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
| cost_changes shows approval_status of pending for a SKU tied to an active parameter-tuning recommendation, with new_unit_cost more than 15% above old_unit_cost | request_more_info | Merchandise Planner | Committing replenishment parameters ahead of a pending cost change risks locking in orders at a superseded cost basis and misstating projected margin impact. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
