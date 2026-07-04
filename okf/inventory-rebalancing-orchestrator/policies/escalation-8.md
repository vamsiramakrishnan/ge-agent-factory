---
type: Policy
title: Escalation policy 8
description: "When The same material_number shows a deficit at one plant and a surplus at another within the same planning_horizon_weeks window, but the two most recent supply_plans and historical_metrics snapshots disagree on which plant is actually short; action: request_more_info; handoff: Inventory Analyst"
source_id: "escalation-8"
tags:
  - manufacturing
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
| The same material_number shows a deficit at one plant and a surplus at another within the same planning_horizon_weeks window, but the two most recent supply_plans and historical_metrics snapshots disagree on which plant is actually short | request_more_info | Inventory Analyst | Conflicting donor/receiver signals mean the surplus-deficit match is not yet reliable; a fresh, reconciled re-query is required before any transfer recommendation is drafted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
