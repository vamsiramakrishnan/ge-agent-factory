---
type: Policy
title: Escalation policy 7
description: "When Two consecutive weekly forecasts rank the same site_id in the top-10 augment backlog but recommend different remedies (e.g., parameter rebalancing vs. new site build) with no change in the underlying performance_counters or cell_sites inputs; action: request_more_info; handoff: capacity_planning_lead"
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
| Two consecutive weekly forecasts rank the same site_id in the top-10 augment backlog but recommend different remedies (e.g., parameter rebalancing vs. new site build) with no change in the underlying performance_counters or cell_sites inputs | request_more_info | capacity_planning_lead | Conflicting remedy recommendations against unchanged evidence signal a scoring or model inconsistency that a human planner must reconcile before the augment plan is published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
