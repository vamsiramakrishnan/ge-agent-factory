---
type: Policy
title: Escalation policy 8
description: "When A new item's proposed base_retail combined with cost_changes.new_unit_cost produces a GMROI more than 15% below the class's merchandise_hierarchy.gmroi_target; action: request_more_info; handoff: Category Manager"
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
| A new item's proposed base_retail combined with cost_changes.new_unit_cost produces a GMROI more than 15% below the class's merchandise_hierarchy.gmroi_target | request_more_info | Category Manager | Publishing a structurally underwater item into the assortment locks in a margin shortfall that only a buyer re-pricing decision can fix. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
