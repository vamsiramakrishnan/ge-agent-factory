---
type: Policy
title: Escalation policy 8
description: "When forecast_error_pct exceeds plus-or-minus 30% for an A-class demand signal feeding the affected material set of an active scenario run; action: escalate_to_human; handoff: demand_planner"
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
| forecast_error_pct exceeds plus-or-minus 30% for an A-class demand signal feeding the affected material set of an active scenario run | escalate_to_human | demand_planner | High-magnitude forecast error on an A-class SKU undermines the credibility of the demand baseline the scenario is built on and requires planner review of the input before the gap is trusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
