---
type: Policy
title: Escalation policy 7
description: "When Optimized pack ratio would drop a size below the merchandise_hierarchy class's minimum presentation width (fewer than 4 active sizes) while the class's seasonal_profiles record is still inside its build_weeks ramp toward peak_week; action: escalate_to_human; handoff: Allocation Manager"
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
| Optimized pack ratio would drop a size below the merchandise_hierarchy class's minimum presentation width (fewer than 4 active sizes) while the class's seasonal_profiles record is still inside its build_weeks ramp toward peak_week | escalate_to_human | Allocation Manager | Cutting size breadth during the pre-peak build window risks stockouts exactly as the seasonal_index is climbing, and presentation-width minimums are a merchandising-leadership commitment, not a planner-level call. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
